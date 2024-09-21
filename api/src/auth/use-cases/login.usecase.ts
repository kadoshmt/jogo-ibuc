import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from 'src/profile/interfaces/profile-repository.interface';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { LoggedUserOutputDto } from '../dto/logged-user-output.dto';
import { EncryptionUtil } from 'src/common/utils/encryption.util';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(
    email: string,
    pass: string,
  ): Promise<LoggedUserOutputDto | null> {
    const user = await this.userRepository.findOneByEmail(email);
    if (user && user.password) {
      const isMatch = await EncryptionUtil.comparePassword(pass, user.password);
      if (isMatch) {
        const profile = await this.profileRepository.findByUserId(user.id);
        if (profile) {
          return {
            id: user.id,
            email: user.email,
            name: profile.name,
            username: profile.username,
            avatarUrl: profile.avatar ?? '',
            role: user.role,
            createdAt: user.createdAt,
          };
        }
      }
    }
    return null;
  }
}
