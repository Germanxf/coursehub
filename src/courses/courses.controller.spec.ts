import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
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
});
