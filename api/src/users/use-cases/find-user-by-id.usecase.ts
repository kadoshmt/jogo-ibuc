import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { IUsers } from '../interfaces/users.interface';
import { Role } from '@prisma/client';
import { getAvatarUrl } from 'src/common/utils/avatar.util';

@Injectable()
export class FindUserByIdUserCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    loggedUser: IUsers,
  ): Promise<UserProfileOutputDto> {
    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (
      loggedUser.role !== Role.ADMIN &&
      loggedUser.role !== Role.COLABORADOR
    ) {
      throw new UnauthorizedException(
        'Logged User is not an ADMIN or COLABORADOR user',
      );
    }

    // Busca os dados do perfil
    const user = await this.userRepository.findOneById(userId);
    const profile = await this.profileRepository.findByUserId(userId);

    if (!user || !profile) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? getAvatarUrl(null),
      role: user.role,
      genre: profile.genre,
      birthDate: profile.birthDate,
      country: profile.country,
      region: profile.region,
      city: profile.city,
      phone: profile.phone,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
