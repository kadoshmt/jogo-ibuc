import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { Uploader } from '@shared/storage/interfaces/uploader.interface';
import { getAvatarUrl } from '@src/common/utils/avatar.util';

interface DeleteAvatarResponse {
  avatarUrl: string;
}

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject(Uploader)
    private readonly uploaderService: Uploader,
  ) {}

  async execute(userId: string): Promise<DeleteAvatarResponse> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const avatarUrl = profile.avatarUrl || '';

    // Verifica se a URL antiga pertence ao armazenamento
    if (this.uploaderService.isOwnStorageUrl(avatarUrl)) {
      await this.uploaderService.delete(avatarUrl);
    }

    await this.profileRepository.update(userId, {
      avatarUrl: getAvatarUrl(null),
    });

    return { avatarUrl };
  }
}
