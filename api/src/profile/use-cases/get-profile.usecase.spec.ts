import { describe, it, expect, beforeEach } from 'vitest';

import { NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { GetProfileUseCase } from './get-profile.usecase';
import { getAvatarUrl } from 'src/common/utils/avatar.util';

describe('GetProfileUseCase', () => {
  let getProfileUseCase: GetProfileUseCase;
  let profileRepository: InMemoryProfileRepository;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    getProfileUseCase = new GetProfileUseCase(profileRepository);
  });

  it('should return the profile when found', async () => {
    const profile: Profile = {
      id: 'profile-1',
      userId: 'user-1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: getAvatarUrl(null),
      genre: 'MASCULINO',
      birthDate: null,
      country: null,
      region: null,
      city: null,
    };

    await profileRepository.create(profile);

    const result = await getProfileUseCase.execute('user-1');

    expect(result).toEqual({
      userId: profile.userId,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      genre: profile.genre,
      birthDate: profile.birthDate,
      country: profile.country,
      region: profile.region,
      city: profile.city,
    });
  });

  it('should throw NotFoundException when profile is not found', async () => {
    await expect(
      getProfileUseCase.execute('non-existent-user'),
    ).rejects.toThrow(NotFoundException);
  });
});
