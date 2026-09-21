import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CoursesService } from '../courses/courses.service.js';
import { StudentsService } from '../students/students.service.js';
import { EnrollmentsService } from './enrollments.service.js';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  beforeEach(() => {
    const students = new StudentsService();
    const base = { age: 20, career: 'Software', semester: 5 };
    students.create({ ...base, name: 'Ana', email: 'ana@x.com' }); // id 1, activa
    students.create({ ...base, name: 'Luis', email: 'luis@x.com', isActive: false }); // id 2, inactivo
    students.create({ ...base, name: 'Carla', email: 'carla@x.com' }); // id 3, activa
    service = new EnrollmentsService(students, new CoursesService());
  });

  it('registra una matrícula válida con id consecutivo', () => {
    expect(service.create({ studentId: 1, courseId: 1 })).toEqual({ id: 1, studentId: 1, courseId: 1 });
    expect(service.create({ studentId: 1, courseId: 2 }).id).toBe(2);
  });

  it('rechaza duplicados (409)', () => {
    service.create({ studentId: 1, courseId: 1 });
    expect(() => service.create({ studentId: 1, courseId: 1 })).toThrow(ConflictException);
  });

  it('rechaza estudiante inactivo (422)', () => {
    expect(() => service.create({ studentId: 2, courseId: 1 })).toThrow(UnprocessableEntityException);
  });

  it('rechaza estudiante o curso inexistente (404)', () => {
    expect(() => service.create({ studentId: 99, courseId: 1 })).toThrow(NotFoundException);
    expect(() => service.create({ studentId: 1, courseId: 99 })).toThrow(NotFoundException);
  });

  it('filtra por studentId y courseId combinados', () => {
    service.create({ studentId: 1, courseId: 1 });
    service.create({ studentId: 1, courseId: 2 });
    service.create({ studentId: 3, courseId: 1 });
    expect(service.findAll({ studentId: 1 })).toHaveLength(2);
    expect(service.findAll({ studentId: 1, courseId: 2 })).toHaveLength(1);
  });

  it('cancela una matrícula y falla si no existe', () => {
    const { id } = service.create({ studentId: 1, courseId: 1 });
    service.remove(id);
    expect(service.findAll()).toHaveLength(0);
    expect(() => service.remove(id)).toThrow(NotFoundException);
  });
});
