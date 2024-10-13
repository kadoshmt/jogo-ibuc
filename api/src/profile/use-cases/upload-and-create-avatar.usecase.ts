import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../interfaces/profile-repository.interface';
import { Uploader } from 'src/shared/storage/interfaces/uploader.interface';
import { InvalidType } from 'src/common/exceptions/invalid-type.exception';

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
    private uploader: Uploader,
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

    const { url: avatarUrl } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    await this.profileRepository.update(userId, {
      avatarUrl,
    });

    return { avatarUrl };
  }
}
