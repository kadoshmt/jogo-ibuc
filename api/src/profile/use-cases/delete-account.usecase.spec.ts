import { describe, it, expect, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { DeleteAccountUseCase } from './delete-account.usecase';
import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user.repository';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IGenre } from '../interfaces/profile.interface';
import { IRole } from 'src/users/interfaces/users.interface';

describe('DeleteAccountUseCase', () => {
  let deleteAccountUseCase: DeleteAccountUseCase;
  let profileRepository: InMemoryProfileRepository;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    userRepository = new InMemoryUserRepository();
    deleteAccountUseCase = new DeleteAccountUseCase(
      profileRepository,
      userRepository,
      new PrismaService(),
    );
  });

  it('should delete the profile successfully', async () => {
    const userToDelete = await userRepository.create({
      email: 'newuser@example.com',
      password: 'password123',
      username: 'johndoe',
      name: 'New User',
      role: IRole.JOGADOR,
      genre: IGenre.MASCULINO,
    });

    const userId = userToDelete.id;

    const profileToDelete = await profileRepository.create({
      id: 'profile-1',
      userId,
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: null,
      genre: 'MASCULINO',
      birthDate: null,
      country: null,
      region: null,
      city: null,
    });

    await deleteAccountUseCase.execute(userId);

    const deletedProfile = await profileRepository.findByUserId(userId);

    expect(profileToDelete.userId).toBe(userId);
    expect(deletedProfile).toBeNull();
  });

  it('should throw NotFoundException when profile does not exist', async () => {
    await expect(
      deleteAccountUseCase.execute('non-existent-user'),
    ).rejects.toThrow(NotFoundException);
  });
});
