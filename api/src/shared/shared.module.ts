import { Module } from '@nestjs/common';
import { PrismaProfileRepository } from '../profile/repositories/prisma-profile.repository';
import { PrismaUserRepository } from '../users/repositories/prisma-user.repository';
import { CheckUsernameIsAvailableUseCase } from 'src/profile/use-cases/check-username-is-available.usecase';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { Uploader } from './storage/interfaces/uploader.interface';
import { R2Storage } from './storage/r2-storage';

@Module({
  providers: [
    {
      provide: 'IProfileRepository',
      useClass: PrismaProfileRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: Uploader,
      useClass: R2Storage,
    },
    CheckUsernameIsAvailableUseCase,
    EmailService,
    GoogleAuthService,
  ],
  exports: [
    'IProfileRepository',
    'IUserRepository',
    CheckUsernameIsAvailableUseCase,
    EmailService,
    GoogleAuthService,
    Uploader,
  ],
  imports: [EmailModule, GoogleAuthModule],
})
export class SharedModule {}
