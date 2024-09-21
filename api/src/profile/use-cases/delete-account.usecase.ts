import { Inject, Injectable } from '@nestjs/common';

import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    // Se houver outras entidades relacionadas, remover aqui
    // Se o usuário adicionou perguntas ou outros dados que não devem ser perdidos,
    // estes devem ter o ID atualizado para outro ADMIM qualquer

    // Utiliza uma transação para garantir que a deleção do usuário e do perfil seja atômica
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.prisma.$transaction(async (prisma) => {
      // Deletar o perfil
      await this.profileRepository.delete(userId);

      // Deletar o usuário
      await this.userRepository.delete(userId);
    });
  }
}
