/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { LoggedUserOutputDto } from '../dto/logged-user-output.dto';
import { IUsers } from 'src/users/interfaces/users.interface';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(user: IUsers): Promise<LoggedUserOutputDto> {
    const profile = await this.profileRepository.findByUserId(user.id);
    if (!profile) {
      throw new NotFoundException('Perfil do usuário não encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? '',
      role: user.role,
      createdAt: user.createdAt,
      genre: profile.genre,
    };
  }
}
