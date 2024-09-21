import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { RegisterInputDto } from '../dto/register-input.dto';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { LoggedUserOutputDto } from '../dto/logged-user-output.dto';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userForm: RegisterInputDto): Promise<LoggedUserOutputDto> {
    const { email, password, name, username } = userForm;

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
      });

      // Cria o perfil associado ao usuário
      const createdProfile = await this.profileRepository.create({
        userId: createdUser.id,
        username: newUsername !== null ? newUsername : username,
        name,
      });

      return [createdUser, createdProfile];
    });

    // Retorna o objeto transformado para o DTO de resposta
    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatar ?? '',
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
