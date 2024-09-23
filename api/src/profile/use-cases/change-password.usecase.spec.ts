import { describe, it, expect, beforeEach } from 'vitest';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { BadRequestException } from '@nestjs/common';
import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user.repository';
import { ChangePasswordUseCase } from './change-password.usecase';

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

  it('should throw BadRequestException if user is not found', async () => {
    const userId = 'non-existent-user';
    const changePasswordDto = {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    await expect(
      changePasswordUseCase.execute(userId, changePasswordDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if current password is incorrect', async () => {
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
    ).rejects.toThrow(BadRequestException);
  });
});
