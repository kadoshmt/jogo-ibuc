import { Module } from '@nestjs/common';
import { PrismaProfileRepository } from '../profile/repositories/prisma-profile.repository';
import { PrismaUserRepository } from '../users/repositories/prisma-user.repository';
import { CheckUsernameIsAvailableUseCase } from 'src/profile/use-cases/check-username-is-available.usecase';

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
    CheckUsernameIsAvailableUseCase,
  ],
  exports: [
    'IProfileRepository',
    'IUserRepository',
    CheckUsernameIsAvailableUseCase,
  ],
})
export class SharedModule {}
