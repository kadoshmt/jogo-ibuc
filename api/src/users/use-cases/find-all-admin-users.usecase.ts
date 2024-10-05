import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUsers } from '../interfaces/users.interface';
import { Role } from '@prisma/client';
import { UserAdminOutputDto } from '../dtos/users-admin-output.dto';

@Injectable()
export class FindAllAdminUsersUserCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(loggedUser: IUsers): Promise<UserAdminOutputDto[]> {
    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (loggedUser.role !== Role.ADMIN) {
      throw new UnauthorizedException('Logged User is not an ADMIN user');
    }

    // Busca os dados do perfil
    return await this.userRepository.findAllAdmin();
  }
}
