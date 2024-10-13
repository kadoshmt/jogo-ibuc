import { Injectable, Inject } from '@nestjs/common';
import { UserProfileNotFoundException } from 'src/common/exceptions/user-profile-not-found.exception';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';

@Injectable()
export class CheckPasswordWasProvidedUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserProfileNotFoundException();
    }
    return user.password !== null ? true : false;
  }
}
