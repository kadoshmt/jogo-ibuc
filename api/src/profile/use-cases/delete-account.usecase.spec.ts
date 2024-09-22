import { describe, it, expect, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { DeleteAccountUseCase } from './delete-account.usecase';
import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user.repository';
import { PrismaService } from 'src/shared/database/prisma.service';

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
    // Arrange
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: null,
      genre: 'MASCULINO',
      birthDate: null,
      country: null,
      region: null,
      city: null,
    };

    const profileCreated = await profileRepository.create(profile);

    await deleteAccountUseCase.execute('user-1');

    const deletedProfile = await profileRepository.findByUserId('user-1');

    expect(profileCreated.userId).toBe('user-1');
    expect(deletedProfile).toBeNull();
  });

  it('should throw NotFoundException when profile does not exist', async () => {
    // Act & Assert
    await expect(
      deleteAccountUseCase.execute('non-existent-user'),
    ).rejects.toThrow(NotFoundException);
  });
});
