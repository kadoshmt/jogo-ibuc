import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserPrismaRepository } from './repositories/user-prisma.repository';

@Module({
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UserPrismaRepository,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
