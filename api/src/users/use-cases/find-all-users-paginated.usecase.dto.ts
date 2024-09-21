import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { UserProfileOutputDto } from '../dto/user-profile-output.dto';
import { RoleUser } from '../interfaces/role-user.enum';
import { IUser } from '../interfaces/user.interface';
import { ListUsersInputDto } from '../dto/list-users-input.dto';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';

@Injectable()
export class FindAllUsersPaginatedUserCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute(
    listUsersInputDto: ListUsersInputDto,
    loggedUser: IUser,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>> {
    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (
      loggedUser.role !== RoleUser.ADMIN &&
      loggedUser.role !== RoleUser.COLLABORATOR
    ) {
      throw new UnauthorizedException(
        'Logged User is not an ADMIN or COLLABORATOR user',
      );
    }

    // Busca os dados do perfil
    return await this.userRepository.findAllPaginated(listUsersInputDto);
  }
}
