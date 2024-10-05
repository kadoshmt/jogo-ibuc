import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { IUsers } from '../interfaces/users.interface';
import { ListUsersInputDto } from '../dtos/list-users-input.dto';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { Role } from '@prisma/client';

@Injectable()
export class FindAllUsersPaginatedUserCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    listUsersInputDto: ListUsersInputDto,
    loggedUser: IUsers,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>> {
    // Verifica se o usuário que está tentando executar a ação é um ADMIN ou COLABORADOR
    if (
      loggedUser.role !== Role.ADMIN &&
      loggedUser.role !== Role.COLABORADOR
    ) {
      throw new UnauthorizedException(
        'Logged User is not an ADMIN or COLABORADOR user',
      );
    }

    // Busca os dados do perfil
    return await this.userRepository.findAllPaginated(listUsersInputDto);
  }
}
