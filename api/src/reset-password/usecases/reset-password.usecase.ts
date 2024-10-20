import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IPasswordResetRepository } from '../interfaces/password-reset-repository.interface';
import { IUserRepository } from '@src/users/interfaces/user-repository.interface';
import { EncryptionUtil } from '@src/common/utils/encryption.util';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordResetRepository')
    private readonly passwordResetRepository: IPasswordResetRepository,
  ) {}

  async execute(token: string, newPassword: string): Promise<boolean> {
    const passwordResetToken =
      await this.passwordResetRepository.findOneByToken(token);

    if (
      !passwordResetToken ||
      passwordResetToken.expiresAt < new Date() ||
      passwordResetToken.used
    ) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashedPassword = await EncryptionUtil.hashPassword(newPassword);

    await this.userRepository.update(passwordResetToken.userId, {
      password: hashedPassword,
    });

    return await this.passwordResetRepository.invalidateToken(
      passwordResetToken.token,
    );
  }
}
