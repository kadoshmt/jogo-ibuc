import {
  Injectable,
  Inject,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { CreateUserInputDto } from '../dto/create-user-input.dto';
import { IUser } from '../interfaces/user.interface';
import { RoleUser } from '../interfaces/role-user.enum';
import { UserProfileOutputDto } from '../dto/user-profile-output.dto';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userInput: CreateUserInputDto,
    loggedUser: IUser,
  ): Promise<UserProfileOutputDto> {
    const { email, password, name, username, role } = userInput;

    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (loggedUser.role !== RoleUser.ADMIN) {
      throw new UnauthorizedException('Logged User is not an ADMIN user');
    }

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
    const [createdUser, profile] = await this.prisma.$transaction(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (prisma) => {
        // Cria o novo usuário
        const createdUser = await this.userRepository.create({
          email,
          password: hashedPassword,
          role,
        });

        // Cria o perfil associado ao usuário
        const createdProfile = await this.profileRepository.create({
          userId: createdUser.id,
          username: newUsername !== null ? newUsername : username,
          name,
        });

        return [createdUser, createdProfile];
      },
    );

    if (!createdUser && !profile) {
      throw new InternalServerErrorException('Unable to register user');
    }

    // TO-DO: Enviar a senha por e-mail

    return {
      id: createdUser.id,
      email: createdUser.email,
      name: profile.name,
      username: profile.username,
      avatar: profile.avatar,
      role: createdUser.role,
    };
  }
}
