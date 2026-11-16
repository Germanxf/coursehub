import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { Course } from '../entities/course.entity.js';
import { CourseRepository } from '../ports/course.repository.js';
import { UpdateCourseUseCase } from './update-course.use-case.js';

describe('UpdateCourseUseCase', () => {
  const course = Object.assign(new Course(), {
    id: 1,
    title: 'NestJS',
    level: 'beginner',
  });
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
    vi.mocked(courses.findById).mockResolvedValue(course);
    vi.mocked(courses.save).mockImplementation(async (value) => value);

    await expect(useCase.execute(1, { title: 'NestJS avanzado' })).resolves.toBe(
      course,
    );

    expect(course.title).toBe('NestJS avanzado');
    expect(courses.save).toHaveBeenCalledWith(course);
  });

  it('returns 404 when the course does not exist', async () => {
    vi.mocked(courses.findById).mockResolvedValue(null);

    await expect(useCase.execute(1, { title: 'NestJS avanzado' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(courses.save).not.toHaveBeenCalled();
  });
});