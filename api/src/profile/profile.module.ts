import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserPrismaRepository,
    },
  ],
})
export class ProfileModule {}
