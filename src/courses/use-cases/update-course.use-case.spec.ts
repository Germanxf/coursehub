import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { Course } from '../entities/course.entity.js';
import { CourseRepository } from '../ports/course.repository.js';
import { UpdateCourseUseCase } from './update-course.use-case.js';

describe('UpdateCourseUseCase', () => {
  const courses: CourseRepository = {
    findById: vi.fn(),
    save: vi.fn(),
  };
  let useCase: UpdateCourseUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateCourseUseCase(courses);
  });

  it('updates and saves the course', async () => {
    const course = Object.assign(new Course(), {
      id: 1,
      title: 'NestJS',
      level: 'intermedio',
    });

    vi.mocked(courses.findById).mockResolvedValue(course);
    vi.mocked(courses.save).mockImplementation(async (value) => value);

    const result = await useCase.execute(1, { title: 'NestJS avanzado' });

    expect(result.title).toBe('NestJS avanzado');
    expect(courses.save).toHaveBeenCalledOnce();
    expect(courses.save).toHaveBeenCalledWith(course);
  });

  it('returns 404 when the course does not exist', async () => {
    vi.mocked(courses.findById).mockResolvedValue(null);

    await expect(
      useCase.execute(999, { title: 'Curso inexistente' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(courses.save).not.toHaveBeenCalled();
  });

  it('propagates a persistence failure and does not report success', async () => {
    const course = Object.assign(new Course(), {
      id: 1,
      title: 'NestJS',
      level: 'intermedio',
    });
    const persistenceError = new Error('Database unavailable');

    vi.mocked(courses.findById).mockResolvedValue(course);
    vi.mocked(courses.save).mockRejectedValue(persistenceError);

    await expect(
      useCase.execute(1, { title: 'NestJS avanzado' }),
    ).rejects.toBe(persistenceError);

    expect(courses.save).toHaveBeenCalledOnce();
  });
});