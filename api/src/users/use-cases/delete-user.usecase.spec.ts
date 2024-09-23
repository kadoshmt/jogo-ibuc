import { describe, it, expect, beforeEach } from 'vitest';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { DeleteUserUseCase } from './delete-user.usecase';
import { IRole, IUsers } from '../interfaces/users.interface';
import { IGenre } from 'src/profile/interfaces/profile.interface';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;
  let adminUser: IUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    deleteUserUseCase = new DeleteUserUseCase(
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

  it('should delete user and profile successfully', async () => {
    // Arrange
    const userToDelete = await userRepository.create({
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      genre: IGenre.MASCULINO,
      username: 'newuser',
      role: IRole.JOGADOR,
      country: 'Country',
      region: 'Region',
      city: 'City',
    });

    await profileRepository.create({
      userId: userToDelete.id,
      name: 'User Name',
      username: 'username',
      genre: 'MASCULINO',
    });

    const createdAdmin = await userRepository.create({
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      genre: IGenre.MASCULINO,
      username: 'newuser',
      role: IRole.ADMIN,
    });

    const transferibleUser = createdAdmin;

    // Act
    await deleteUserUseCase.execute(
      userToDelete.id,
      transferibleUser.id,
      adminUser,
    );

    // Assert

    const deletedProfile = await profileRepository.findByUserId(
      userToDelete.id,
    );
    expect(deletedProfile).toBeNull();

    const deletedUser = await userRepository.findOneById(userToDelete.id);
    expect(deletedUser).toBeNull();
  });

  it('should throw UnauthorizedException if logged user is not admin', async () => {
    // Arrange
    const nonAdminUser = {
      ...adminUser,
      role: IRole.JOGADOR,
    };

    // Act & Assert
    await expect(
      deleteUserUseCase.execute('user-id', 'transferible-id', nonAdminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw NotFoundException if user to be deleted does not exist', async () => {
    // Act & Assert
    await expect(
      deleteUserUseCase.execute('non-existent-id', adminUser.id, adminUser),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if transferible user is the same as user to be deleted', async () => {
    // Act & Assert
    await expect(
      deleteUserUseCase.execute(adminUser.id, adminUser.id, adminUser),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UserProfileNotFoundException if transferible user does not exist', async () => {
    // Arrange
    const userToDelete = await userRepository.create({
      email: 'user@example.com',
      password: 'password',
      name: 'User Jonh',
      genre: IGenre.MASCULINO,
      username: 'user',
      role: IRole.JOGADOR,
    });

    await profileRepository.create({
      userId: userToDelete.id,
      name: 'User Name',
      username: 'username',
      genre: IGenre.MASCULINO,
    });

    const nonExistentTransferibleId = 'non-existent-transferible-id';

    // Act & Assert
    await expect(
      deleteUserUseCase.execute(
        userToDelete.id,
        nonExistentTransferibleId,
        adminUser,
      ),
    ).rejects.toThrow(UserProfileNotFoundException);
  });

  it('should throw UnauthorizedException if transferible user is not admin', async () => {
    // Arrange
    const userToDelete = await userRepository.create({
      email: 'user@example.com',
      password: 'password',
      name: 'User Jonh',
      genre: IGenre.MASCULINO,
      username: 'user',
      role: IRole.JOGADOR,
    });

    await profileRepository.create({
      userId: userToDelete.id,
      name: 'User Name',
      username: 'username',
      genre: IGenre.MASCULINO,
    });

    const transferibleUser = await userRepository.create({
      email: 'transferible@example.com',
      password: 'password',
      name: 'Another Name',
      username: 'user2',
      genre: IGenre.MASCULINO,
      role: IRole.JOGADOR, // Não é ADMIN
    });

    // Act & Assert
    await expect(
      deleteUserUseCase.execute(
        userToDelete.id,
        transferibleUser.id,
        adminUser,
      ),
    ).rejects.toThrow(UnauthorizedException);
  });
});
