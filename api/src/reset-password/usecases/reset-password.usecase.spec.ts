import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResetPasswordUseCase } from './reset-password.usecase';
import { InMemoryPasswordResetRepository } from '../repositories/in-memory-password-reset.repository';
import { InMemoryUserRepository } from '@src/users/repositories/in-memory-user.repository';
import { IPasswordReset } from '../interfaces/password-reset.interface';
import { BadRequestException } from '@nestjs/common';
import { IRole, IUsers } from '@src/users/interfaces/users.interface';
import { EncryptionUtil } from '@src/common/utils/encryption.util';

describe('ResetPasswordUseCase', () => {
  let resetPasswordUseCase: ResetPasswordUseCase;
  let passwordResetRepository: InMemoryPasswordResetRepository;
  let userRepository: InMemoryUserRepository;
  let user: IUsers;

  beforeEach(async () => {
    passwordResetRepository = new InMemoryPasswordResetRepository();
    userRepository = new InMemoryUserRepository();

    user = await userRepository.create({
      email: 'user@example.com',
      password: 'hashedpassword',
      role: IRole.ADMIN,
      name: 'User Name',
      username: 'username',
      genre: 'MASCULINO',
    });

    resetPasswordUseCase = new ResetPasswordUseCase(
      userRepository,
      passwordResetRepository,
    );
  });

  it('deve redefinir a senha do usuário se o token for válido', async () => {
    const tokenData: IPasswordReset = {
      id: 'token-1',
      userId: user.id,
      token: 'valid-token',
      expiresAt: new Date(Date.now() + 3600 * 1000), // expira em 1 hora
      used: false,
      createdAt: new Date(),
    };

    await passwordResetRepository.createToken(tokenData);

    const newPassword = 'newPassword123';

    const updatePasswordSpy = vi.spyOn(userRepository, 'update');

    await resetPasswordUseCase.execute(tokenData.token, newPassword);

    // Verifica se a senha foi atualizada
    expect(updatePasswordSpy).toHaveBeenCalledWith(user.id, {
      password: expect.any(String),
    });

    // Verifica se a senha foi realmente atualizada
    const updatedUser = await userRepository.findOneById(user.id);
    const passwordMatch = await EncryptionUtil.comparePassword(
      newPassword,
      updatedUser!.password!, // nullish, pois o valor foi definido anteriormente
    );

    expect(passwordMatch).toBe(true);

    // Verifica se o token foi invalidado
    const invalidatedToken = await passwordResetRepository.findOneByToken(
      tokenData.token,
    );
    expect(invalidatedToken?.used).toBe(true);
  });

  it('deve lançar exceção se o token for inválido ou expirado', async () => {
    const tokenData: IPasswordReset = {
      id: 'token-2',
      userId: 'user-2',
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 3600 * 1000), // expirado há 1 hora
      used: false,
      createdAt: new Date(),
    };

    await passwordResetRepository.createToken(tokenData);

    const newPassword = 'newPassword123';

    await expect(
      resetPasswordUseCase.execute(tokenData.token, newPassword),
    ).rejects.toThrow(BadRequestException);

    // Verifica se a senha não foi atualizada
    const user = await userRepository.findOneById(tokenData.userId);
    expect(user).toBeNull();

    // Verifica se o token não foi marcado como usado
    const token = await passwordResetRepository.findOneByToken(tokenData.token);
    expect(token?.used).toBe(false);
  });
});
