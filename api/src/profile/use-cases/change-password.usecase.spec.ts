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
    // Arrange
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

    // Act
    await changePasswordUseCase.execute(cretedUser.id, changePasswordDto);

    // Assert
    //expect(result).toBe(true);

    const updatedUser = await userRepository.findOneById(cretedUser.id);
    const updatedPassword = updatedUser?.password;

    if (!updatedPassword) {
      throw new Error('Updated password is null or undefined');
    }

    const isPasswordCorrect = await EncryptionUtil.comparePassword(
      'newPassword',
      updatedPassword,
    );
    expect(isPasswordCorrect).toBe(true);
  });

  it('should throw BadRequestException if user is not found', async () => {
    // Arrange
    const userId = 'non-existent-user';
    const changePasswordDto = {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    // Act & Assert
    await expect(
      changePasswordUseCase.execute(userId, changePasswordDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if current password is incorrect', async () => {
    // Arrange

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

    // Act & Assert
    await expect(
      changePasswordUseCase.execute(userId, changePasswordDto),
    ).rejects.toThrow(BadRequestException);
  });
});
