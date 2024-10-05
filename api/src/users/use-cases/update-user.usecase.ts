import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { UpdateUserInputDto } from '../dtos/update-user-input.dto';
import { EmailConflictException } from 'src/common/exceptions/email-conflict.exception';
import { IUsers } from '../interfaces/users.interface';
import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { Role } from '@prisma/client';
import { getAvatarUrl } from 'src/common/utils/avatar.util';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userId: string,
    userInput: UpdateUserInputDto,
    loggedUser: IUsers,
  ): Promise<UserProfileOutputDto> {
    const { email, name, username, role, genre, country, region, city, phone } =
      userInput;

    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (loggedUser.role !== Role.ADMIN) {
      throw new UnauthorizedException('Logged User is not an ADMIN user');
    }

    const userDB = await this.userRepository.findOneById(userId);
    if (!userDB) {
      throw new NotFoundException('User not found');
    }

    const profileDB = await this.profileRepository.findByUserId(userId);
    if (!profileDB) {
      throw new NotFoundException('Profile not found');
    }

    // Verifica se o e-mail já está registrado
    if (email !== userDB?.email) {
      const existingEmail = await this.userRepository.findOneByEmail(email);
      if (existingEmail) {
        throw new EmailConflictException();
      }
    }

    // Verifica se o username já está em uso
    let newUsername = null;
    if (username && username !== profileDB.username) {
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
          genre,
          country,
          region,
          city,
          phone,
        });

        return [updatedUserDB, updatedProfileDB];
      },
    );

    // TO-DO: Enviar a senha por e-mail

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedProfile.name,
      username: updatedProfile.username,
      avatarUrl: updatedProfile.avatarUrl ?? getAvatarUrl(null),
      role: updatedUser.role,
      genre: updatedProfile.genre,
      birthDate: updatedProfile.birthDate,
      country: updatedProfile.country,
      region: updatedProfile.region,
      city: updatedProfile.city,
      createdAt: updatedUser.createdAt.toISOString(),
    };
  }
}
