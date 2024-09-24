import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { RegisterProviderDto } from '../dto/register-provider.dto';
import { LoggedUserOutputDto } from '../dto/logged-user-output.dto';
import { ProviderConflictException } from 'src/common/exceptions/provider-conflict.exception';
import { PrismaService } from 'src/shared/database/prisma.service';
import { Genre } from '@prisma/client';
import { getAvatarUrl } from 'src/common/utils/avatar.utils';

@Injectable()
export class RegisterProviderUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(register: RegisterProviderDto): Promise<LoggedUserOutputDto> {
    const {
      email,
      name,
      username,
      provider,
      providerId,
      avatarUrl,
      newsletter,
    } = register;

    // Verifica se o e-mail já está registrado
    const existingUser = await this.userRepository.findOneByEmail(email);

    if (existingUser) {
      // Verifica se o usuário já está registrado com o mesmo provedor
      if (existingUser[`${provider}Id`] === providerId) {
        // Retorna o usuário existente (login)
        const profile = await this.profileRepository.findByUserId(
          existingUser.id,
        );
        return {
          id: existingUser.id,
          email: existingUser.email,
          name: profile?.name ?? name, // Usa o nome do perfil se existir
          username: profile?.username ?? username, // Usa o username do perfil se existir
          avatarUrl: profile?.avatarUrl ?? '',
          role: existingUser.role,
          createdAt: existingUser.createdAt,
          genre: profile?.genre ?? Genre.NAO_INFORMADO,
        };
      } else {
        // Se o e-mail já estiver registrado por outro provedor, lança exceção de conflito de provedor
        throw new ProviderConflictException();
      }
    }

    // Verifica se o username já está em uso
    let newUsername = null;
    const existingUsername =
      await this.profileRepository.findByUsername(username);
    if (existingUsername) {
      newUsername = `${username}_${Math.floor(Math.random() * 10000)}`;
    }

    // Utiliza uma transação para garantir que a criação do usuário e do perfil seja atômica
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, profile] = await this.prisma.$transaction(async (prisma) => {
      // Cria o novo usuário
      const createdUser = await this.userRepository.create({
        email,
        [`${provider}Id`]: providerId, // Atribui o ID do provedor ao campo correspondente dinamicamente
        newsletter,
      });

      // Cria o perfil associado ao usuário
      const createdProfile = await this.profileRepository.create({
        userId: createdUser.id,
        username: newUsername !== null ? newUsername : username,
        name,
        avatarUrl: avatarUrl || getAvatarUrl(null),
      });

      return [createdUser, createdProfile];
    });

    // Retorna o objeto transformado para o DTO de resposta
    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl!,
      role: user.role,
      genre: profile.genre,
      createdAt: user.createdAt,
    };
  }
}
