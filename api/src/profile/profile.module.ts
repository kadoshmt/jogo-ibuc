import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { GetProfileUseCase } from './use-cases/get-profile.usecase';
import { UpdateProfileUseCase } from './use-cases/update-profile.usecase';
import { ChangePasswordUseCase } from './use-cases/change-password.usecase';
import { SharedModule } from '@shared/shared.module';
import { DeleteAccountUseCase } from './use-cases/delete-account.usecase';
import { CheckUsernameIsAvailableUseCase } from './use-cases/check-username-is-available.usecase';
import { CreatePasswordUseCase } from './use-cases/create-password.usecase';
import { CheckPasswordWasProvidedUseCase } from './use-cases/check-password-was-provided.usecase';
import { UploadAndCreateAvatarUseCase } from './use-cases/upload-and-create-avatar.usecase';
import { DeleteAvatarUseCase } from './use-cases/delete-avatar.usecase';

@Module({
  imports: [SharedModule],
  controllers: [ProfileController],
  providers: [
    GetProfileUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    DeleteAccountUseCase,
    CheckUsernameIsAvailableUseCase,
    CheckPasswordWasProvidedUseCase,
    CreatePasswordUseCase,
    UploadAndCreateAvatarUseCase,
    DeleteAvatarUseCase,
  ],
})
export class ProfileModule {}
