import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { ProfileOutputDto } from '../dto/profile-output.dto';
import { getAvatarUrl } from 'src/common/utils/avatar.utils';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string): Promise<ProfileOutputDto> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }
    return {
      userId: profile.userId,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl ?? getAvatarUrl(null),
      genre: profile.genre,
      birthDate: profile.birthDate,
      country: profile.country,
      region: profile.region,
      city: profile.city,
    };
  }
}
