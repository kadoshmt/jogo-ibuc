import { describe, it, expect, beforeEach } from 'vitest';
import { EncryptionUtil } from '@src/common/utils/encryption.util';
import { InMemoryUserRepository } from '@src/users/repositories/in-memory-user.repository';
import { ChangePasswordUseCase } from './change-password.usecase';
import { UserProfileWrongPasswordException } from '@src/common/exceptions/user-profile-wrong-password.exception';
import { UserProfileNotFoundException } from '@src/common/exceptions/user-profile-not-found.exception';

describe('ChangePasswordUseCase', () => {
  let changePasswordUseCase: ChangePasswordUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    changePasswordUseCase = new ChangePasswordUseCase(userRepository);
  });

  it('should change the password successfully', async () => {
    const hashedPassword = await EncryptionUtil.hashPassword('oldPassword');

    const cretedUser = await userRepository.create({
      email: 'test@example.com',
      password: hashedPassword,
      role: 'JOGADOR',
      name: 'John Doe',
      username: 'johndoe',
      genre: 'MASCULINO',
    });

    const changePasswordDto = {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    await changePasswordUseCase.execute(cretedUser.id, changePasswordDto);

    const updatedUser = await userRepository.findOneById(cretedUser.id);
    const updatedPassword = updatedUser?.password;

    const isPasswordCorrect = await EncryptionUtil.comparePassword(
      'newPassword',
      updatedPassword!, // nullish, pois o valor foi definido anteriormente
    );
    expect(isPasswordCorrect).toBe(true);
  });

  it('should throw UserProfileNotFoundException if user is not found', async () => {
    const userId = 'non-existent-user';
    const changePasswordDto = {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    await expect(
      changePasswordUseCase.execute(userId, changePasswordDto),
    ).rejects.toThrow(UserProfileNotFoundException);
  });

  it('should throw UserProfileWrongPasswordException if password is not defined', async () => {
    const cretedUser = await userRepository.createProvider({
      name: 'Test User',
      username: 'testuser',
      email: 'teste@example.com',
      provider: 'google',
      providerId: 'google-id-1',
    });

    const userId = cretedUser.id;

    const changePasswordDto = {
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword',
    };

    await expect(
      changePasswordUseCase.execute(userId, changePasswordDto),
    ).rejects.toThrow(UserProfileWrongPasswordException);
  });

  it('should throw UserProfileWrongPasswordException if current password is incorrect', async () => {
    const hashedPassword = await EncryptionUtil.hashPassword('oldPassword');

    const cretedUser = await userRepository.create({
      email: 'test@example.com',
      password: hashedPassword,
      role: 'JOGADOR',
      name: 'John Doe',
      username: 'johndoe',
      genre: 'MASCULINO',
    });

    const userId = cretedUser.id;

    const changePasswordDto = {
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword',
    };

    await expect(
      changePasswordUseCase.execute(userId, changePasswordDto),
    ).rejects.toThrow(UserProfileWrongPasswordException);
  });
});
