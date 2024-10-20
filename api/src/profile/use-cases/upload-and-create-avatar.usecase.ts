import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { Uploader } from '@shared/storage/interfaces/uploader.interface';
import { InvalidType } from '@src/common/exceptions/invalid-type.exception';

interface UploadAndCreateAvatarRequest {
  userId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

interface UploadAndCreateAvatarResponse {
  avatarUrl: string;
}

@Injectable()
export class UploadAndCreateAvatarUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject(Uploader)
    private readonly uploaderService: Uploader,
  ) {}

  async execute({
    userId,
    fileName,
    fileType,
    body,
  }: UploadAndCreateAvatarRequest): Promise<UploadAndCreateAvatarResponse> {
    if (!/^(image\/(jpeg|png|webp))$/.test(fileType)) {
      throw new InvalidType();
    }
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const oldAvatarUrl = profile.avatarUrl || '';

    const { url: avatarUrl } = await this.uploaderService.upload({
      fileName,
      fileType,
      body,
    });

    await this.profileRepository.update(userId, {
      avatarUrl,
    });

    // Verifica se a URL antiga pertence ao armazenamento
    if (this.uploaderService.isOwnStorageUrl(oldAvatarUrl)) {
      await this.uploaderService.delete(oldAvatarUrl);
    }

    return { avatarUrl };
  }
}
