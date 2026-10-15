import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { EnrollmentsService } from './enrollments.service.js';
import { Enrollment } from './entities/enrollment.entity.js';
import { StudentsService } from '../students/students.service.js';
import { CoursesService } from '../courses/courses.service.js';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  const mockQueryBuilder = {
    leftJoinAndSelect: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    take: vi.fn().mockReturnThis(),
    getManyAndCount: vi.fn().mockResolvedValue([[], 0]),
  };

  const mockEnrollmentsRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    remove: vi.fn(),
    createQueryBuilder: vi.fn(() => mockQueryBuilder),
  };

  const mockStudentsService = {
    findOne: vi.fn(),
  };

  const mockCoursesService = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentsRepository,
        },
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe crear una matrícula exitosamente', async () => {
    mockStudentsService.findOne.mockResolvedValue({ id: 1, name: 'Ana', isActive: true });
    mockCoursesService.findOne.mockResolvedValue({ id: 1, title: 'NestJS' });
    mockEnrollmentsRepository.findOne.mockResolvedValue(null);
    mockEnrollmentsRepository.create.mockReturnValue({ id: 1, student: { id: 1 }, course: { id: 1 } });
    mockEnrollmentsRepository.save.mockResolvedValue({ id: 1, student: { id: 1 }, course: { id: 1 } });

    const enrollment = await service.create({ studentId: 1, courseId: 1 });
    expect(enrollment).toBeDefined();
    expect(enrollment.id).toBe(1);
  });

  it('debe lanzar BadRequestException si el estudiante está inactivo', async () => {
    mockStudentsService.findOne.mockResolvedValue({ id: 2, name: 'Carlos', isActive: false });

    await expect(service.create({ studentId: 2, courseId: 1 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debe lanzar ConflictException si la matrícula ya existe', async () => {
    mockStudentsService.findOne.mockResolvedValue({ id: 1, name: 'Ana', isActive: true });
    mockCoursesService.findOne.mockResolvedValue({ id: 1, title: 'NestJS' });
    mockEnrollmentsRepository.findOne.mockResolvedValue({ id: 1 });

    await expect(service.create({ studentId: 1, courseId: 1 })).rejects.toThrow(
      ConflictException,
    );
  });

  it('debe lanzar NotFoundException si el curso no existe', async () => {
    mockStudentsService.findOne.mockResolvedValue({ id: 1, name: 'Ana', isActive: true });
    mockCoursesService.findOne.mockRejectedValue(new NotFoundException());

    await expect(service.create({ studentId: 1, courseId: 999 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debe filtrar matrículas con QueryBuilder y devolver items y meta', async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValue([[{ id: 1 }], 1]);

    const result = await service.findAll({ studentId: 1, courseId: 1, page: 1, limit: 10 });
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('meta');
    expect(result.items).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('debe cancelar una matrícula existente', async () => {
    const mockEnrollment = { id: 1 };
    mockEnrollmentsRepository.findOne.mockResolvedValue(mockEnrollment);
    mockEnrollmentsRepository.remove.mockResolvedValue(mockEnrollment);

    const removed = await service.remove(1);
    expect(removed).toEqual(mockEnrollment);
  });
});
