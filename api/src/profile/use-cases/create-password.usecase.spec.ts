import { describe, it, expect, beforeEach } from 'vitest';
import { EncryptionUtil } from '@src/common/utils/encryption.util';
import { InMemoryUserRepository } from '@src/users/repositories/in-memory-user.repository';
import { UserProfileWrongPasswordException } from '@src/common/exceptions/user-profile-wrong-password.exception';
import { UserProfileNotFoundException } from '@src/common/exceptions/user-profile-not-found.exception';
import { CreatePasswordUseCase } from './create-password.usecase';

describe('CreatePasswordUseCase', () => {
  let createPasswordUseCase: CreatePasswordUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createPasswordUseCase = new CreatePasswordUseCase(userRepository);
  });

  it('should set the password successfully', async () => {
    const cretedUser = await userRepository.createProvider({
      name: 'Test User',
      username: 'testuser',
      email: 'teste@example.com',
      provider: 'google',
      providerId: 'google-id-1',
    });

    await createPasswordUseCase.execute(cretedUser.id, 'newPassword');

    const updatedUser = await userRepository.findOneById(cretedUser.id);
    const updatedPassword = updatedUser!.password;

    const isPasswordCorrect = await EncryptionUtil.comparePassword(
      'newPassword',
      updatedPassword!, // nullish, pois o valor foi definido anteriormente
    );
    expect(isPasswordCorrect).toBe(true);
  });

  it('should throw UserProfileNotFoundException if user is not found', async () => {
    const userId = 'non-existent-user';

    await expect(
      createPasswordUseCase.execute(userId, 'newPassword'),
    ).rejects.toThrow(UserProfileNotFoundException);
  });

  it('should throw UserProfileWrongPasswordException if exists current password', async () => {
    const cretedUser = await userRepository.create({
      email: 'test@example.com',
      password: 'hashedOldPassword',
      role: 'JOGADOR',
      name: 'John Doe',
      username: 'johndoe',
      genre: 'MASCULINO',
    });

    await expect(
      createPasswordUseCase.execute(cretedUser.id, 'newPassword'),
    ).rejects.toThrow(UserProfileWrongPasswordException);
  });
});
