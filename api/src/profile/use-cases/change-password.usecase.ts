import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ChangePasswordInputDto } from '../dtos/change-password-input.dto';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { EncryptionUtil } from 'src/common/utils/encryption.util';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    changePasswordDto: ChangePasswordInputDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOneById(userId);
    if (!user || !user.password) {
      throw new BadRequestException(
        'Usuário não encontrado ou sem senha definida',
      );
    }

    const isMatch = await EncryptionUtil.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const hashedPassword = await EncryptionUtil.hashPassword(newPassword);

    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
