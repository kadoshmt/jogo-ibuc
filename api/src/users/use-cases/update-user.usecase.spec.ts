import { describe, it, expect, beforeEach } from 'vitest';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { UpdateUserInputDto } from '../dto/update-user-input.dto';
import { UpdateUserUseCase } from './update-user.usecase';
import { IRole, IUsers } from '../interfaces/users.interface';
import { IGenre } from 'src/profile/interfaces/profile.interface';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;
  let adminUser: IUsers;
  let userInput: UpdateUserInputDto;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    updateUserUseCase = new UpdateUserUseCase(
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

    userInput = {
      email: 'user@example.com',
      name: 'Some User',
      username: 'userinput',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    };
  });

  it('should update user and profile successfully', async () => {
    // Arrange

    const existingUser = await userRepository.create({
      ...userInput,
      password: 'password',
    });

    await profileRepository.create({
      userId: existingUser.id,
      name: 'User Name',
      username: 'username',
      genre: 'MASCULINO',
    });

    const userInputToUpdate: UpdateUserInputDto = {
      email: 'updated@example.com',
      name: 'Updated Name',
      username: 'updatedusername',
      role: IRole.PROFESSOR,
      genre: IGenre.MASCULINO,
      country: 'Updated Country',
      region: 'Updated Region',
      city: 'Updated City',
    };

    // Act
    const result = await updateUserUseCase.execute(
      existingUser.id,
      userInputToUpdate,
      adminUser,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(userInputToUpdate.email);
    expect(result.name).toBe(userInputToUpdate.name);
    expect(result.genre).toBe(IGenre.MASCULINO);
    expect(result.role).toBe(IRole.PROFESSOR);
    expect(result.username).toContain('updatedusername');
    expect(result.country).toBe(userInputToUpdate.country);
    expect(result.region).toBe(userInputToUpdate.region);
    expect(result.city).toBe(userInputToUpdate.city);
  });

  it('should throw UnauthorizedException if logged user is not admin', async () => {
    // Arrange
    const nonAdminUser = {
      ...adminUser,
      role: IRole.JOGADOR,
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute('user-id', userInput, nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    // Arrange
    const userInputToUpdate: UpdateUserInputDto = {
      ...userInput,
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute(
        'non-existent-id',
        userInputToUpdate,
        adminUser,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw EmailConflictException if new email is already in use', async () => {
    // Arrange
    // Cria um usuário existente com o email 'existing@example.com'
    await userRepository.create({
      email: 'existing@example.com',
      name: 'Existing User',
      username: 'existinguser',
      genre: IGenre.NAO_INFORMADO,
      password: 'password',
      role: IRole.JOGADOR,
    });

    // Cria o usuário a ser atualizado com um email diferente
    const userToUpdate = await userRepository.create({
      email: 'user@example.com',
      password: 'password',
      name: 'User',
      username: 'user',
      genre: IGenre.NAO_INFORMADO,
      role: IRole.JOGADOR,
    });

    await profileRepository.create({
      userId: userToUpdate.id,
      name: 'User Name',
      username: 'userusername',
      genre: IGenre.MASCULINO,
    });

    const userInputToUpdate: UpdateUserInputDto = {
      email: 'existing@example.com', // Tentando atualizar para um email que já existe
      name: 'Updated Name',
      username: 'updatedusername',
      role: IRole.JOGADOR,
      genre: IGenre.MASCULINO,
      country: 'Updated Country',
      region: 'Updated Region',
      city: 'Updated City',
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute(userToUpdate.id, userInputToUpdate, adminUser),
    ).rejects.toThrow(EmailConflictException);
  });

  it('should throw NotFoundException if profile does not exist', async () => {
    // Arrange
    // Cria um usuário sem criar o perfil correspondente
    const existingUser = await userRepository.create({
      email: 'user@example.com',
      password: 'password',
      name: 'Existing User',
      username: 'existingusername',
      genre: IGenre.NAO_INFORMADO,
      role: IRole.JOGADOR,
    });

    // Não criamos o perfil para o usuário
    const userInputToUpdate: UpdateUserInputDto = {
      email: 'updated@example.com',
      name: 'Updated Name',
      username: 'updatedusername',
      role: IRole.PROFESSOR,
      genre: IGenre.MASCULINO,
      country: 'Updated Country',
      region: 'Updated Region',
      city: 'Updated City',
    };

    // Act & Assert
    await expect(
      updateUserUseCase.execute(existingUser.id, userInputToUpdate, adminUser),
    ).rejects.toThrow(NotFoundException);
  });

  it('should assign a new username if the new username is already taken', async () => {
    // Cria um perfil existente com o username 'existingusername'
    const existingUser = await userRepository.create({
      email: 'existing@example.com',
      name: 'Existing User',
      username: 'existingusername',
      genre: IGenre.NAO_INFORMADO,
      password: 'password',
      role: IRole.JOGADOR,
    });

    await profileRepository.create({
      userId: existingUser.id,
      name: 'Existing User',
      username: 'existingusername',
      genre: IGenre.MASCULINO,
    });

    // Cria o usuário e perfil que será atualizado
    const userToUpdate = await userRepository.create({
      email: 'user@example.com',
      password: 'password',
      role: IRole.JOGADOR,
      name: 'User Name',
      username: 'userusername',
      genre: IGenre.MASCULINO,
    });

    await profileRepository.create({
      userId: userToUpdate.id,
      name: 'User Name',
      username: 'userusername',
      genre: IGenre.MASCULINO,
    });

    const userInputToUpdate: UpdateUserInputDto = {
      email: 'user@example.com', // Mesmo email
      name: 'Updated Name',
      username: 'existingusername', // Tentando atualizar para um username que já existe
      role: IRole.JOGADOR,
      genre: IGenre.MASCULINO,
      country: 'Updated Country',
      region: 'Updated Region',
      city: 'Updated City',
    };

    // Act
    const result = await updateUserUseCase.execute(
      userToUpdate.id,
      userInputToUpdate,
      adminUser,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.username).not.toBe('existingusername');
    expect(result.username).toMatch(/^existingusername_\d+$/);
  });
});
