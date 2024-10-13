import { describe, it, expect, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { UpdateProfileUseCase } from './update-profile.usecase';
import { IGenre } from '../interfaces/profile.interface';

describe('UpdateProfileUseCase', () => {
  let updateProfileUseCase: UpdateProfileUseCase;
  let profileRepository: InMemoryProfileRepository;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
  });

  it('should update the profile successfully', async () => {
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: null,
      genre: IGenre.MASCULINO,
      birthDate: null,
      country: null,
      region: null,
      city: null,
      phone: null,
    };

    await profileRepository.create(profile);

    const updateData = {
      name: 'John Smith',
      username: 'johnsmith',
      genre: IGenre.MASCULINO,
    };

    const result = await updateProfileUseCase.execute('user-1', updateData);

    expect(result.name).toBe('John Smith');
    expect(result.username).toBe('johnsmith');
  });

  it('should throw BadRequestException if profile does not exist', async () => {
    const profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Smith',
      username: 'johnsmith',
      genre: IGenre.MASCULINO,
    };

    await expect(
      updateProfileUseCase.execute('non-existent-user', profile),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if username already in use by another user', async () => {
    const profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Smith',
      username: 'user1',
      genre: IGenre.MASCULINO,
    };

    const profile2 = {
      id: 'profile-2',
      userId: 'user-2',
      name: 'John Smith Jr.',
      username: 'user1',
      genre: IGenre.MASCULINO,
    };

    await profileRepository.create(profile);

    await expect(
      updateProfileUseCase.execute('user-2', profile2),
    ).rejects.toThrow(BadRequestException);
  });
});
