import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should delegate register call to AuthService', async () => {
      const dto = { email: 'ana@example.com', password: 'password123' };
      const expected = { id: 1, email: 'ana@example.com', createdAt: new Date() };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);
      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should delegate login call to AuthService', async () => {
      const dto = { email: 'ana@example.com', password: 'password123' };
      const expected = { id: 1, email: 'ana@example.com', createdAt: new Date() };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);
      expect(result).toEqual(expected);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
