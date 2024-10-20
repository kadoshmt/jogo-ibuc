import { describe, it, expect, beforeEach } from 'vitest';

import { InMemoryUserRepository } from '@src/users/repositories/in-memory-user.repository';
import { UserProfileNotFoundException } from '@src/common/exceptions/user-profile-not-found.exception';
import { CheckPasswordWasProvidedUseCase } from './check-password-was-provided.usecase';

describe('CheckPasswordWasProvidedUseCase', () => {
  let checkPasswordWasProvidedUseCase: CheckPasswordWasProvidedUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    checkPasswordWasProvidedUseCase = new CheckPasswordWasProvidedUseCase(
      userRepository,
    );
  });

  it('should return true if password was provided', async () => {
    const user = await userRepository.create({
      name: 'Test User',
      email: 'teste@example.com',
      role: 'JOGADOR',
      username: 'testuser',
      genre: 'MASCULINO',
      password: 'hashed-password',
    });

    const result = await checkPasswordWasProvidedUseCase.execute(user.id);

    expect(result).toBe(true);
  });

  it('should return false if password was not provided', async () => {
    const user = await userRepository.createProvider({
      name: 'Test User',
      username: 'testuser',
      email: 'teste@example.com',
      provider: 'google',
      providerId: 'google-id-1',
    });

    const result = await checkPasswordWasProvidedUseCase.execute(user.id);

    expect(result).toBe(false);
  });

  it('should throw UserProfileNotFoundException when user does not exist', async () => {
    await expect(
      checkPasswordWasProvidedUseCase.execute('non-existent-user'),
    ).rejects.toThrow(UserProfileNotFoundException);
  });
});
