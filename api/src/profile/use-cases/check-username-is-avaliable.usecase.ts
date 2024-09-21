import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile-repository.interface';

@Injectable()
export class CheckUsernameIsAvaliableUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(username: string): Promise<boolean> {
    const user = await this.profileRepository.findByUsername(username);
    return !user;
  }
}
