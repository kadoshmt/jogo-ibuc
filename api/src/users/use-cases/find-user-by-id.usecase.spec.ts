import { describe, it, expect, beforeEach } from 'vitest';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { FindUserByIdUserCase } from './find-user-by-id.usecase';
import { IRole, IUsers } from '../interfaces/users.interface';
import { IGenre } from 'src/profile/interfaces/profile.interface';

describe('FindUserByIdUserCase', () => {
  let findUserByIdUserCase: FindUserByIdUserCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;
  let adminUser: IUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    findUserByIdUserCase = new FindUserByIdUserCase(
      profileRepository,
      userRepository,
    );

    adminUser = {
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should return user profile successfully for an admin user', async () => {
    // Arrange
    const createdUser = await userRepository.create({
      email: 'user@example.com',
      name: 'New User',
      username: 'newuser',
      password: 'hashedpassword',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    });

    await profileRepository.create({
      userId: createdUser.id,
      name: 'User Name',
      genre: IGenre.NAO_INFORMADO,
      country: 'Country',
      region: 'Region',
      city: 'City',
      avatarUrl: 'https://example.com/avatar.png',
    });

    // Act
    const result = await findUserByIdUserCase.execute(
      createdUser.id,
      adminUser,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe('user@example.com');
    expect(result.name).toBe('User Name');
    expect(result.city).toBe('City');
  });

  it('should throw UnauthorizedException if logged user is not admin or colaborador', async () => {
    // Arrange
    const nonAdminUser: IUsers = {
      ...adminUser,
      role: IRole.JOGADOR,
    };
    const userId = 'user-1';

    // Act & Assert
    await expect(
      findUserByIdUserCase.execute(userId, nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    // Arrange
    const userId = 'non-existent-id';

    // Act & Assert
    await expect(
      findUserByIdUserCase.execute(userId, adminUser),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if profile does not exist', async () => {
    // Arrange
    const userCreated = await userRepository.create({
      email: 'user@example.com',
      password: 'hashedpassword',
      name: 'New User',
      username: 'newuser',
      role: IRole.JOGADOR,
      genre: IGenre.NAO_INFORMADO,
    });

    // Act & Assert
    await expect(
      findUserByIdUserCase.execute(userCreated.id, adminUser),
    ).rejects.toThrow(NotFoundException);
  });
});
