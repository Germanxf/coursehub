import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CoursesService } from '../courses/courses.service.js';
import { StudentsService } from '../students/students.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';

export type Enrollment = {
  id: number;
  studentId: number;
  courseId: number;
};

@Injectable()
export class EnrollmentsService {
  private readonly enrollments: Enrollment[] = [];
  private nextId = 1;

  constructor(
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
  ) {}

  create(dto: CreateEnrollmentDto): Enrollment {
    // StudentsService.findOne lanza NotFoundException (404) si no existe
    const student = this.studentsService.findOne(dto.studentId);

    // CoursesService.findOne devuelve undefined si no existe
    const course = this.coursesService.findOne(dto.courseId);
    if (!course) {
      throw new NotFoundException(`El curso con ID ${dto.courseId} no existe`);
    }

    if (!student.isActive) {
      throw new UnprocessableEntityException(
        `El estudiante ${dto.studentId} está inactivo y no puede matricularse`,
      );
    }

    const duplicated = this.enrollments.some(
      (e) => e.studentId === dto.studentId && e.courseId === dto.courseId,
    );
    if (duplicated) {
      throw new ConflictException(
        `El estudiante ${dto.studentId} ya está matriculado en el curso ${dto.courseId}`,
      );
    }

    const enrollment: Enrollment = {
      id: this.nextId++,
      studentId: dto.studentId,
      courseId: dto.courseId,
    };
    this.enrollments.push(enrollment);
    return enrollment;
  }

  findAll(filters: { studentId?: number; courseId?: number } = {}): Enrollment[] {
    return this.enrollments.filter(
      (e) =>
        (filters.studentId === undefined || e.studentId === filters.studentId) &&
        (filters.courseId === undefined || e.courseId === filters.courseId),
    );
  }

  findByStudent(studentId: number): Enrollment[] {
    this.studentsService.findOne(studentId); // 404 si no existe
    return this.findAll({ studentId });
  }

  findByCourse(courseId: number): Enrollment[] {
    if (!this.coursesService.findOne(courseId)) {
      throw new NotFoundException(`El curso con ID ${courseId} no existe`);
    }
    return this.findAll({ courseId });
  }

  remove(id: number): Enrollment {
    const index = this.enrollments.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`La matrícula con ID ${id} no existe`);
    }
    const [removed] = this.enrollments.splice(index, 1);
    return removed;
  }
}
