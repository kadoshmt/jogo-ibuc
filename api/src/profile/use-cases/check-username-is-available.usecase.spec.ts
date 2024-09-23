import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryProfileRepository } from '../repositories/in-memory-profile.repository';
import { CheckUsernameIsAvailableUseCase } from './check-username-is-available.usecase';

describe('CheckUsernameIsAvailableUseCase', () => {
  let checkUsernameIsAvailableUseCase: CheckUsernameIsAvailableUseCase;
  let profileRepository: InMemoryProfileRepository;

  beforeEach(() => {
    profileRepository = new InMemoryProfileRepository();
    checkUsernameIsAvailableUseCase = new CheckUsernameIsAvailableUseCase(
      profileRepository,
    );
  });

  it('should return true if username is available', async () => {
    const username = 'availableUsername';

    const result = await checkUsernameIsAvailableUseCase.execute(username);

    expect(result).toBe(true);
  });

  it('should return false if username is not available', async () => {
    const username = 'existingUsername';
    await profileRepository.create({
      userId: 'user-1',
      name: 'Test User',
      username: username,
      genre: 'MASCULINO',
    });

    const result = await checkUsernameIsAvailableUseCase.execute(username);

    expect(result).toBe(false);
  });
});
