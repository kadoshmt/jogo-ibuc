import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ProfileOutputDto } from '../dto/profile-output.dto';
import { UpdateProfileInputDto } from '../dto/update-profile-input.dto';
import { IProfileRepository } from '../interfaces/profile-repository.interface';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(
    userId: string,
    updateProfileDto: UpdateProfileInputDto,
  ): Promise<ProfileOutputDto> {
    // Verificar se o username já está em uso
    if (updateProfileDto.username) {
      const existingProfile = await this.profileRepository.findByUsername(
        updateProfileDto.username,
      );
      if (existingProfile && existingProfile.userId !== userId) {
        throw new BadRequestException('Username já está em uso');
      }
    }

    const updatedProfile = await this.profileRepository.update(
      userId,
      updateProfileDto,
    );

    return {
      userId: updatedProfile.userId,
      username: updatedProfile.username,
      name: updatedProfile.name,
      avatar: updatedProfile.avatar,
    };
  }
}
