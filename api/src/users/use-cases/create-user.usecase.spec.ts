import { describe, it, expect, beforeEach } from 'vitest';

import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { CreateUserInputDto } from '../dtos/create-user-input.dto';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { CreateUserUseCase } from './create-user.usecase';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IRole, IUsers } from '../interfaces/users.interface';
import { IGenre } from 'src/profile/interfaces/profile.interface';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;
  let adminUser: IUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    createUserUseCase = new CreateUserUseCase(
      profileRepository,
      userRepository,
      new PrismaService(),
    );

    adminUser = {
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: IRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should create a new user and profile successfully', async () => {
    const userInput: CreateUserInputDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      genre: IGenre.MASCULINO,
      username: 'newuser',
      role: IRole.JOGADOR,
      country: 'Country',
      region: 'Region',
      city: 'City',
    };

    const result = await createUserUseCase.execute(userInput, adminUser);

    expect(result).toBeDefined();
    expect(result.email).toBe(userInput.email);
    expect(result.name).toBe(userInput.name);
    expect(result.username).toContain(userInput.username);
  });

  it('should throw UnauthorizedException if logged user is not admin', async () => {
    const nonAdminUser = {
      ...adminUser,
      role: Role.JOGADOR,
    };

    const userInput: CreateUserInputDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      genre: IGenre.MASCULINO,
      username: 'newuser',
      role: IRole.JOGADOR,
      country: 'Country',
      region: 'Region',
      city: 'City',
    };

    await expect(
      createUserUseCase.execute(userInput, nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw EmailConflictException if email already exists', async () => {
    const userInput: CreateUserInputDto = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User',
      genre: IGenre.MASCULINO,
      username: 'existinguser',
      role: IRole.JOGADOR,
      country: 'Country',
      region: 'Region',
      city: 'City',
    };

    // Simula um usuário existente
    await userRepository.create({
      email: userInput.email,
      password: 'password',
      name: 'Inexisting User',
      genre: IGenre.MASCULINO,
      username: 'inexistinguser',
      role: IRole.JOGADOR,
    });

    await expect(
      createUserUseCase.execute(userInput, adminUser),
    ).rejects.toThrow(EmailConflictException);
  });

  it('should assign a new username if the desired username is already taken', async () => {
    const existingUsername = 'existinguser';
    const userInput: CreateUserInputDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      username: existingUsername,
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
      country: 'Country',
      region: 'Region',
      city: 'City',
    };

    // Cria um perfil com o mesmo username para simular que o username já existe
    await profileRepository.create({
      userId: 'existing-user-id',
      name: 'Existing User',
      username: existingUsername,
      genre: 'MASCULINO',
    });

    const result = await createUserUseCase.execute(userInput, adminUser);

    expect(result).toBeDefined();
    expect(result.email).toBe(userInput.email);
    expect(result.name).toBe(userInput.name);
    expect(result.username).not.toBe(existingUsername);
    expect(result.username).toContain(existingUsername + '_');
  });
});
