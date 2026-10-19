import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: vi.fn(),
    findByEmailWithPassword: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and return only safe fields (id, email, createdAt)', async () => {
      const now = new Date();
      mockUsersService.create.mockResolvedValue({
        id: 1,
        email: 'ana@example.com',
        passwordHash: 'hashed_password_value',
        createdAt: now,
      });

      const result = await service.register({
        email: 'ana@example.com',
        password: 'securePassword123',
      });

      expect(result).toEqual({
        id: 1,
        email: 'ana@example.com',
        createdAt: now,
      });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockUsersService.create).toHaveBeenCalledWith(
        'ana@example.com',
        expect.stringMatching(/^\$2/),
      );
    });
  });

  describe('login', () => {
    it('should return safe user data when credentials are valid', async () => {
      const now = new Date();
      const plainPassword = 'securePassword123';
      const hash = await bcrypt.hash(plainPassword, 10);

      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        id: 1,
        email: 'ana@example.com',
        passwordHash: hash,
        createdAt: now,
      });

      const result = await service.login({
        email: 'ana@example.com',
        password: plainPassword,
      });

      expect(result).toEqual({
        id: 1,
        email: 'ana@example.com',
        createdAt: now,
      });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      const hash = await bcrypt.hash('correctPassword', 10);
      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        id: 1,
        email: 'ana@example.com',
        passwordHash: hash,
        createdAt: new Date(),
      });

      await expect(
        service.login({
          email: 'ana@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'unknown@example.com',
          password: 'somePassword123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
