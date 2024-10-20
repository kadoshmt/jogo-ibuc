import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginUseCase } from './login.usecase';
import { InMemoryUserRepository } from '@src/users/repositories/in-memory-user.repository';
import { InMemoryProfileRepository } from '@src/profile/repositories/in-memory-profile.repository';
import { EncryptionUtil } from '@src/common/utils/encryption.util';
import { Genre } from '@prisma/client';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    loginUseCase = new LoginUseCase(userRepository, profileRepository);

    // Mock do método `comparePassword` do `EncryptionUtil`
    vi.spyOn(EncryptionUtil, 'comparePassword').mockResolvedValue(true);
  });

  it('should login successfully with valid credentials', async () => {
    const email = 'validuser@example.com';
    const password = 'validpassword';

    const user = await userRepository.create({
      email,
      name: 'Name',
      username: 'username',
      genre: 'MASCULINO',
      password: 'hashedpassword',
      role: 'JOGADOR',
    });

    await profileRepository.create({
      userId: user.id,
      username: 'validuser',
      name: 'Valid User',
      genre: Genre.MASCULINO,
    });

    const result = await loginUseCase.execute(email, password);

    expect(result).toBeDefined();
    expect(result?.email).toBe(email);
    expect(result?.username).toBe('validuser');
    expect(result?.name).toBe('Valid User');
  });

  it('should return null if password does not match', async () => {
    vi.spyOn(EncryptionUtil, 'comparePassword').mockResolvedValue(false);
    const email = 'validuser@example.com';
    const password = 'invalidpassword';

    const user = await userRepository.create({
      email,
      password: 'hashedpassword',
      name: 'Name',
      username: 'username',
      genre: 'MASCULINO',
      role: 'JOGADOR',
    });

    await profileRepository.create({
      userId: user.id,
      username: 'validuser',
      name: 'Valid User',
      genre: Genre.MASCULINO,
    });

    const result = await loginUseCase.execute(email, password);

    expect(result).toBeNull();
  });

  it('should return null if user does not exist', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password123';

    const result = await loginUseCase.execute(email, password);

    expect(result).toBeNull();
  });
});
