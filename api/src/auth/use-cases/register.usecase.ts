import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { RegisterInputDto } from '../dtos/register-input.dto';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { LoggedUserOutputDto } from '../dtos/logged-user-output.dto';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { getAvatarUrl } from 'src/common/utils/avatar.util';
import { PrismaService } from 'src/shared/database/prisma.service';
import { IGenre } from 'src/profile/interfaces/profile.interface';
import { EmailService } from 'src/shared/email/email.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async execute(userForm: RegisterInputDto): Promise<LoggedUserOutputDto> {
    const { email, password, name, username, newsletter, genre } = userForm;

    // Verifica se o e-mail já está registrado
    const existingEmail = await this.userRepository.findOneByEmail(email);
    if (existingEmail) {
      throw new EmailConflictException();
    }

    // Verifica se o username já está em uso
    let newUsername = null;
    const existingUsername =
      await this.profileRepository.findByUsername(username);
    if (existingUsername) {
      newUsername = `${username}_${Math.floor(Math.random() * 10000)}`;
    }

    // Criptografa a senha
    const hashedPassword = await EncryptionUtil.hashPassword(password);

    // Utiliza uma transação para garantir que a criação do usuário e do perfil seja atômica
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, profile] = await this.prisma.$transaction(async (prisma) => {
      // Cria o novo usuário
      const createdUser = await this.userRepository.create({
        email,
        password: hashedPassword,
        newsletter: newsletter ?? true,
      });

      // Cria o perfil associado ao usuário
      const createdProfile = await this.profileRepository.create({
        userId: createdUser.id,
        username: newUsername !== null ? newUsername : username,
        name,
        genre: genre || IGenre.NAO_INFORMADO,
        avatarUrl: getAvatarUrl(genre || IGenre.NAO_INFORMADO),
      });

      return [createdUser, createdProfile];
    });

    // TO-DO: Pegar ao menos o pais via https://ipinfo.io/pricing

    // Envia o e-mail de boas-vindas
    await this.emailService.sendMail({
      to: user.email,
      subject: `🎉 Bem-vindo ao Jogo do IBUC, ${profile.name}! 🌟`,
      template: 'new-register',
      context: {
        name: profile.name,
      },
    });

    // Retorna o objeto transformado para o DTO de resposta
    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? '',
      role: user.role,
      genre: profile.genre,
      createdAt: user.createdAt,
    };
  }
}
