import {
  Injectable,
  Inject,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { UpdateUserInputDto } from '../dto/update-user-input.dto';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { RoleUser } from '../interfaces/role-user.enum';
import { IUser } from '../interfaces/user.interface';
import { UserProfileOutputDto } from '../dto/user-profile-output.dto';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userId: string,
    userInput: UpdateUserInputDto,
    loggedUser: IUser,
  ): Promise<UserProfileOutputDto> {
    const { email, name, username, role } = userInput;

    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (loggedUser.role !== RoleUser.ADMIN) {
      throw new UnauthorizedException('Logged User is not an ADMIN user');
    }

    const userDB = await this.userRepository.findOneById(userId);

    // Verifica se o e-mail já está registrado
    if (email !== userDB?.email) {
      const existingEmail = await this.userRepository.findOneByEmail(email);
      if (existingEmail) {
        throw new EmailConflictException();
      }
    }

    // Verifica se o username já está em uso
    let newUsername = null;
    if (email !== userDB?.email) {
      const existingUsername =
        await this.profileRepository.findByUsername(username);
      if (existingUsername) {
        newUsername = `${username}_${Math.floor(Math.random() * 10000)}`;
      }
    }

    // Utiliza uma transação para garantir que a criação do usuário e do perfil seja atômica
    const [updatedUser, updatedProfile] = await this.prisma.$transaction(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (prisma) => {
        // Atualiza o usuário
        const updatedUserDB = await this.userRepository.update(userId, {
          ...userDB,
          email,
          role,
          updatedAt: new Date(),
        });

        const profileDB = await this.profileRepository.findByUserId(userId);

        // Atualiza o perfil
        const updatedProfileDB = await this.profileRepository.update(userId, {
          ...profileDB,
          username: newUsername !== null ? newUsername : username,
          name,
        });

        return [updatedUserDB, updatedProfileDB];
      },
    );

    if (!updatedUser && !updatedProfile) {
      throw new InternalServerErrorException('Unable to update user');
    }

    // TO-DO: Enviar a senha por e-mail

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedProfile.name,
      username: updatedProfile.username,
      avatar: updatedProfile.avatar,
      role: updatedUser.role,
    };
  }
}
