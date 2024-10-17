import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RequestPasswordResetUseCase } from './request-password-reset.usecase';
import { InMemoryUserRepository } from 'src/users/repositories/in-memory-user.repository';
import { InMemoryProfileRepository } from 'src/profile/repositories/in-memory-profile.repository';
import { InMemoryPasswordResetRepository } from '../repositories/in-memory-password-reset.repository';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';
import { EmailService } from 'src/shared/email/email.service';
import { IRole, IUsers } from 'src/users/interfaces/users.interface';

describe('RequestPasswordResetUseCase', () => {
  let requestPasswordResetUseCase: RequestPasswordResetUseCase;
  let userRepository: InMemoryUserRepository;
  let profileRepository: InMemoryProfileRepository;
  let passwordResetRepository: InMemoryPasswordResetRepository;
  let emailService: EmailService;
  let user: IUsers;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    profileRepository = new InMemoryProfileRepository();
    passwordResetRepository = new InMemoryPasswordResetRepository();
    emailService = {
      sendMail: vi.fn(), // Mock da função sendMail
    } as any; // Casting para ignorar tipagem do TypeScript

    user = await userRepository.create({
      email: 'user@example.com',
      password: 'hashedpassword',
      role: IRole.ADMIN,
      name: 'User Name',
      username: 'username',
      genre: 'MASCULINO',
    });

    requestPasswordResetUseCase = new RequestPasswordResetUseCase(
      userRepository,
      profileRepository,
      passwordResetRepository,
      emailService,
    );
  });

  it('deve enviar um e-mail de redefinição de senha se o e-mail existir', async () => {
    const profile = await profileRepository.create({
      userId: user.id,
      name: 'User Name',
      username: 'username',
      genre: 'MASCULINO',
    });

    const email = 'user@example.com';

    // Espiar o método createToken
    const createTokenSpy = vi.spyOn(passwordResetRepository, 'createToken');

    await requestPasswordResetUseCase.execute(email);

    // Verifica se o método createToken foi chamado
    expect(createTokenSpy).toHaveBeenCalledTimes(1);

    // Captura os argumentos passados para createToken
    const tokenData = createTokenSpy.mock.calls[0][0];
    expect(tokenData.userId).toBe(user.id);
    expect(tokenData.token).toBeDefined();
    expect(tokenData.expiresAt).toBeDefined();

    // Verifica se o e-mail foi enviado com o link correto
    expect(emailService.sendMail).toHaveBeenCalledTimes(1);
    expect(emailService.sendMail).toHaveBeenCalledWith({
      to: email,
      subject: '🔒 Solicitação de Redefinição de Senha',
      template: 'reset-password',
      context: {
        name: profile.name,
        resetLink: `${process.env.FRONTEND_URL}/reset-password/${tokenData.token}`,
      },
    });
  });

  it('deve lançar UserProfileNotFoundException se o e-mail não for encontrado', async () => {
    const email = 'nonexistent@example.com';

    await expect(requestPasswordResetUseCase.execute(email)).rejects.toThrow(
      UserProfileNotFoundException,
    );

    // Verifica que o e-mail não foi enviado
    expect(emailService.sendMail).not.toHaveBeenCalled();
  });
});
