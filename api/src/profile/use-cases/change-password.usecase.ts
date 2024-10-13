import { Injectable, Inject } from '@nestjs/common';
import { ChangePasswordInputDto } from '../dtos/change-password-input.dto';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { UserProfileWrongPasswordException } from 'src/common/exceptions/user-profile-wrong-password.exception';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';

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

    if (!user) {
      throw new UserProfileNotFoundException('Usuário não encontrado.');
    }

    if (!user.password) {
      throw new UserProfileWrongPasswordException(
        'Usuário sem senha definida.',
      );
    }

    const isMatch = await EncryptionUtil.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new UserProfileWrongPasswordException(
        'A senha atual fornecida está incorreta.',
      );
    }

    const hashedPassword = await EncryptionUtil.hashPassword(newPassword);

    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
