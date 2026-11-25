import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { vi } from 'vitest';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case.js';

describe('CoursesController', () => {
  let controller: CoursesController;

  const mockCoursesService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
  const mockUpdateCourse = { execute: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        { provide: JwtService, useValue: { verifyAsync: vi.fn() } },
        { provide: JwtAuthGuard, useValue: { canActivate: vi.fn(() => true) } },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
        { provide: UpdateCourseUseCase, useValue: mockUpdateCourse },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates update with the id and body unchanged', async () => {
    const id = 7;
    const body = { title: 'NestJS avanzado', level: 'avanzado' };
    const updatedCourse = { id, ...body };
    mockUpdateCourse.execute.mockResolvedValue(updatedCourse);

    await expect(controller.update(id, body)).resolves.toEqual(updatedCourse);

    expect(mockUpdateCourse.execute).toHaveBeenCalledOnce();
    expect(mockUpdateCourse.execute).toHaveBeenCalledWith(id, body);
  });

  it('propagates an error from the update use case', async () => {
    const error = new NotFoundException('Course with ID 999 not found');
    mockUpdateCourse.execute.mockRejectedValue(error);

    await expect(
      controller.update(999, { title: 'Curso inexistente' }),
    ).rejects.toBe(error);

    expect(mockUpdateCourse.execute).toHaveBeenCalledWith(999, {
      title: 'Curso inexistente',
    });
  });
});
