// src/profile/profile.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';
import { UserProfileWrongPasswordException } from 'src/common/exceptions/user-profile-wrong-password.exception';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    // Retorna o objeto transformado para o DTO de resposta
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    // Atualizar os dados do usuário
    const updatedUser = await this.usersService.updateUser(
      userId,
      updateProfileDto,
    );
    // Retornar os dados atualizados sem informações sensíveis
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.password) {
      throw new UserProfileNotFoundException();
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UserProfileWrongPasswordException();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updateUser(userId, { password: hashedPassword });

    return { message: 'Senha alterada com sucesso' };
  }

  async deleteAccount(userId: string) {
    // TO-DO: implementar a lógica para deletar o usuário e dados relacionados, como rankings, etc.
    // Se houver outras entidades relacionadas, certifique-se de removê-las também
    // TO-DO: Adicionar token JWT na blacklist
    await this.usersService.deleteUser(userId);
  }
}
