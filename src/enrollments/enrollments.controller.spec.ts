import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { EnrollmentsController } from './enrollments.controller.js';
import { EnrollmentsService } from './enrollments.service.js';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  const mockEnrollmentsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByStudentId: vi.fn(),
    findByCourseId: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        {
          provide: EnrollmentsService,
          useValue: mockEnrollmentsService,
        },
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe llamar a create en el servicio', async () => {
    const dto = { studentId: 1, courseId: 1 };
    mockEnrollmentsService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('debe llamar a findAll en el servicio', async () => {
    mockEnrollmentsService.findAll.mockResolvedValue({ items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });

    const result = await controller.findAll({});
    expect(service.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual({ items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
  });

  it('debe llamar a findOne en el servicio', async () => {
    const mockEnrollment = { id: 1 };
    mockEnrollmentsService.findOne.mockResolvedValue(mockEnrollment);

    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEnrollment);
  });

  it('debe llamar a findByStudent en el servicio', async () => {
    mockEnrollmentsService.findByStudentId.mockResolvedValue([]);

    const result = await controller.findByStudent(1);
    expect(service.findByStudentId).toHaveBeenCalledWith(1);
    expect(result).toEqual([]);
  });

  it('debe llamar a findByCourse en el servicio', async () => {
    mockEnrollmentsService.findByCourseId.mockResolvedValue([]);

    const result = await controller.findByCourse(1);
    expect(service.findByCourseId).toHaveBeenCalledWith(1);
    expect(result).toEqual([]);
  });

  it('debe llamar a remove en el servicio', async () => {
    const mockEnrollment = { id: 1 };
    mockEnrollmentsService.remove.mockResolvedValue(mockEnrollment);

    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockEnrollment);
  });
});
