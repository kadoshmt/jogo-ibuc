import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { GetProfileUseCase } from './use-cases/get-profile.usecase';
import { UpdateProfileUseCase } from './use-cases/update-profile.usecase';
import { ChangePasswordUseCase } from './use-cases/change-password.usecase';

import { SharedModule } from 'src/shared/shared.module';
import { DeleteAccountUseCase } from './use-cases/delete-account.usecase';
import { CheckUsernameIsAvaliableUseCase } from './use-cases/check-username-is-avaliable.usecase';

@Module({
  imports: [SharedModule],
  controllers: [ProfileController],
  providers: [
    GetProfileUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    DeleteAccountUseCase,
    CheckUsernameIsAvaliableUseCase,
  ],
})
export class ProfileModule {}
