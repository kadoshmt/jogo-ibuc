import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@src/users/interfaces/user-repository.interface';
import { EmailService } from '@shared/email/email.service';
import { UserProfileNotFoundException } from '@src/common/exceptions/user-profile-not-found.exception';
import { IPasswordResetRepository } from '../interfaces/password-reset-repository.interface';
import { randomBytes } from 'crypto';
import { IProfileRepository } from '@src/profile/interfaces/profile-repository.interface';

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IPasswordResetRepository')
    private readonly passwordResetRepository: IPasswordResetRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string): Promise<void> {
    // Verifica se o e-mail já está registrado
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new UserProfileNotFoundException('E-mail não encontrado.');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await this.passwordResetRepository.createToken({
      userId: user.id,
      token,
      expiresAt,
    });

    const profile = await this.profileRepository.findByUserId(user.id);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Envia o e-mail com a url de reset
    await this.emailService.sendMail({
      to: user.email,
      subject: '🔒 Solicitação de Redefinição de Senha',
      template: 'reset-password',
      context: {
        name: profile?.name,
        resetLink,
      },
    });
  }
}
