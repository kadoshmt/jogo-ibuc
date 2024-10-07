import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { PrismaGoogleAuthRepository } from './repositories/prisma-google-auth.repository';

@Module({
  providers: [
    GoogleAuthService,
    {
      provide: 'IGoogleAuthRepository',
      useClass: PrismaGoogleAuthRepository,
    },
  ],
  exports: [GoogleAuthService, 'IGoogleAuthRepository'],
})
export class GoogleAuthModule {}
