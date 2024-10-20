import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '@src/users/interfaces/user-repository.interface';
import { EmailConflictException } from '@src/common/exceptions/email-conflict.exception';
import { IProfileRepository } from '@src/profile/interfaces/profile-repository.interface';
import { EncryptionUtil } from '@src/common/utils/encryption.util';
import { CreateUserInputDto } from '../dtos/create-user-input.dto';
import { IUsers } from '../interfaces/users.interface';
import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { PrismaService } from '@shared/database/prisma.service';
import { Role } from '@prisma/client';
import { getAvatarUrl } from '@src/common/utils/avatar.util';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userInput: CreateUserInputDto,
    loggedUser: IUsers,
  ): Promise<UserProfileOutputDto> {
    const {
      email,
      password,
      name,
      username,
      role,
      country,
      region,
      city,
      phone,
    } = userInput;

    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (loggedUser.role !== Role.ADMIN) {
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
          avatarUrl: getAvatarUrl(null),
          country,
          region,
          city,
          phone,
        });

        return [createdUser, createdProfile];
      },
    );

    // TO-DO: Enviar a senha por e-mail

    return {
      id: createdUser.id,
      email: createdUser.email,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      role: createdUser.role,
      genre: profile.genre,
      birthDate: profile.birthDate,
      country: profile.country,
      region: profile.region,
      city: profile.city,
      createdAt: createdUser.createdAt.toISOString(),
    };
  }
}
