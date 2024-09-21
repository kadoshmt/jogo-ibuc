import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserProfileOutputDto } from '../dto/user-profile-output.dto';
import { IUsers } from '../interfaces/users.interface';
import { UsersFilterInputDto } from '../dto/users-filter-input.dto';
import { Role } from '@prisma/client';

@Injectable()
export class FindAllUsersUserCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    filterDto: UsersFilterInputDto,
    loggedUser: IUsers,
  ): Promise<UserProfileOutputDto[]> {
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
    return await this.userRepository.findAll(filterDto);
  }
}
