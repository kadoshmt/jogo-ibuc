import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryProfileRepository } from '@src/profile/repositories/in-memory-profile.repository';
import { NotFoundException } from '@nestjs/common';
import { IUsers } from '@src/users/interfaces/users.interface';
import { Genre } from '@prisma/client';
import { ValidateUserUseCase } from './validade-user.usecase';

describe('ValidateUserUseCase', () => {
  let validateUserUseCase: ValidateUserUseCase;
  let profileRepository: InMemoryProfileRepository;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    validateUserUseCase = new ValidateUserUseCase(profileRepository);
  });

  it('should return user profile data if profile exists', async () => {
    const user: IUsers = {
      id: 'user-1',
      email: 'user@example.com',
      role: 'JOGADOR',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await profileRepository.create({
      userId: user.id,
      username: 'validuser',
      name: 'Valid User',
      genre: Genre.MASCULINO,
    });

    const result = await validateUserUseCase.execute(user);

    expect(result).toBeDefined();
    expect(result.id).toBe(user.id);
    expect(result.email).toBe(user.email);
    expect(result.username).toBe('validuser');
    expect(result.name).toBe('Valid User');
  });

  it('should throw NotFoundException if user profile does not exist', async () => {
    const user: IUsers = {
      id: 'user-1',
      email: 'user@example.com',
      role: 'JOGADOR',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await expect(validateUserUseCase.execute(user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
