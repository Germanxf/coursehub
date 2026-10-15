import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity.js';
import { GetStudentsFilterDto } from './dto/get-students-filter.dto.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: any) {
    await this.ensureEmailAvailable(createStudentDto.email);
    const student = this.studentsRepository.create(createStudentDto);
    return this.studentsRepository.save(student);
  }

  async findAll(filterDto?: GetStudentsFilterDto) {
    const where: any = {};
    if (filterDto?.career) where.career = filterDto.career;
    if (filterDto?.semester) where.semester = filterDto.semester;
    if (filterDto?.isActive !== undefined) where.isActive = filterDto.isActive;
    return this.studentsRepository.find({ where });
  }

  async findOne(id: number) {
    const student = await this.studentsRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }
    return student;
  }

  async update(id: number, updateStudentDto: any) {
    const student = await this.findOne(id);
    
    // Si intenta cambiar el correo por otro, verificamos que esté disponible
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      await this.ensureEmailAvailable(updateStudentDto.email);
    }

    Object.assign(student, updateStudentDto);
    return this.studentsRepository.save(student);
  }

  async updateStatus(id: number, isActive: boolean) {
    const student = await this.findOne(id);
    student.isActive = isActive;
    return this.studentsRepository.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    return this.studentsRepository.remove(student);
  }

  private async ensureEmailAvailable(email: string) {
    const studentExists = await this.studentsRepository.findOneBy({ email });
    if (studentExists) {
      throw new ConflictException(`El correo ${email} ya está registrado`);
    }
  }
}