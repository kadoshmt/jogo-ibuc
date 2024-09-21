import { Module } from '@nestjs/common';
import { PrismaProfileRepository } from '../profile/repositories/prisma-profile.repository';
import { PrismaUserRepository } from '../users/repositories/prisma-user.repository';
import { CheckUsernameIsAvaliableUseCase } from 'src/profile/use-cases/check-username-is-avaliable.usecase';

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
    CheckUsernameIsAvaliableUseCase,
  ],
  exports: [
    'IProfileRepository',
    'IUserRepository',
    CheckUsernameIsAvaliableUseCase,
  ],
})
export class SharedModule {}
