import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockQueryBuilder = {
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    getOne: vi.fn(),
  };

  const mockUsersRepository = {
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    createQueryBuilder: vi.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const mockUser = { id: 1, email: 'ana@example.com', createdAt: new Date() };
      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByEmail('ana@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ email: 'ana@example.com' });
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should include passwordHash in query', async () => {
      const mockUser = { id: 1, email: 'ana@example.com', passwordHash: 'hash123' };
      mockQueryBuilder.getOne.mockResolvedValue(mockUser);

      const result = await service.findByEmailWithPassword('ana@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.passwordHash');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'ana@example.com' });
    });
  });

  describe('create', () => {
    it('should successfully create and return user if email does not exist', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      const userToSave = { email: 'ana@example.com', passwordHash: 'hash123' };
      const savedUser = { id: 1, ...userToSave, createdAt: new Date() };

      mockUsersRepository.create.mockReturnValue(userToSave);
      mockUsersRepository.save.mockResolvedValue(savedUser);

      const result = await service.create('ana@example.com', 'hash123');
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if email is already registered', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue({ id: 1, email: 'ana@example.com' });

      await expect(service.create('ana@example.com', 'hash123')).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if duplicate key constraint error (23505) occurs', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      mockUsersRepository.create.mockReturnValue({});
      mockUsersRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create('ana@example.com', 'hash123')).rejects.toThrow(ConflictException);
    });
  });
});
