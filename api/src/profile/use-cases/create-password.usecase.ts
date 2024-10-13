import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { EncryptionUtil } from 'src/common/utils/encryption.util';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';
import { UserProfileWrongPasswordException } from 'src/common/exceptions/user-profile-wrong-password.exception';

@Injectable()
export class CreatePasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, password: string): Promise<void> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new UserProfileNotFoundException('Usuário não encontrado.');
    }

    if (user.password) {
      throw new UserProfileWrongPasswordException(
        'Usuário com senha já definida',
      );
    }

    const hashedPassword = await EncryptionUtil.hashPassword(password);

    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
