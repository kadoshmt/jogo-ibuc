import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { RoleUser } from '../interfaces/role-user.enum';
import { IUsers } from '../interfaces/users.interface';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userID: string, transferibleID: string, loggedUser: IUsers) {
    // Se o usuário adicionou perguntas ou outros dados que não devem ser perdidos,
    // estes devem ter o ID atualizado para o transferibleID

    // Verifica se o usuário a der deletado pe o mesmo que receberá os registros
    if (userID === transferibleID) {
      throw new UnauthorizedException(
        'Transferible User is the same Deleted User.',
      );
    }

    // Verifica se o usuário que está tentando executar a ação é um ADMIN
    if (loggedUser.role !== RoleUser.ADMIN) {
      throw new UnauthorizedException('Logged User is not an ADMIN user.');
    }

    // Verifica se o usuário a ser deletado existe existe
    const userToBeErased = await this.userRepository.findOneById(userID);
    if (!userToBeErased) {
      throw new NotFoundException('User to be deleted not found.');
    }

    // Verifica se o transferibleID existe
    const transferibleUser =
      await this.userRepository.findOneById(transferibleID);
    if (!transferibleUser) {
      throw new UserProfileNotFoundException('Transferible user not fount.');
    }

    // verifica se o usuário que receberá os regitros é do tipo ADMIN
    if (transferibleUser.role !== RoleUser.ADMIN) {
      throw new UnauthorizedException(
        'Transferible User is not an ADMIN user.',
      );
    }

    // Se houver outras entidades relacionadas, remover aqui
    // Utiliza uma transação para garantir que a deleção do usuário e do perfil seja atômica
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.prisma.$transaction(async (prisma) => {
      // Deletar o perfil
      await this.profileRepository.delete(userID);

      // Deletar o usuário
      await this.userRepository.delete(userID);
    });
  }
}
