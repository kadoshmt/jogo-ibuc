import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStrategy } from './local.strategy';
import { LoginUseCase } from '../use-cases/login.usecase';
import { UnauthorizedException } from '@nestjs/common';
import { LoggedUserOutputDto } from '../dtos/logged-user-output.dto';
import { Genre } from '@prisma/client';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = {
      execute: vi.fn(),
    } as any;

    localStrategy = new LocalStrategy(loginUseCase);
  });

  it('should validate and return a user if valid credentials are provided', async () => {
    const mockUser: LoggedUserOutputDto = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      role: 'ADMIN',
      genre: Genre.MASCULINO,
      createdAt: new Date(),
      avatarUrl: 'http://example.com/avatar.png',
      country: 'Country',
      region: 'Region',
      city: 'City',
    };

    (loginUseCase.execute as any).mockResolvedValue(mockUser);

    const result = await localStrategy.validate(
      'test@example.com',
      'password123',
    );

    expect(result).toBeDefined();
    expect(result.email).toBe(mockUser.email);
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    (loginUseCase.execute as any).mockResolvedValue(null);

    await expect(
      localStrategy.validate('test@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
