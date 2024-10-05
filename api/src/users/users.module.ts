import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindUserByIdUserCase } from './use-cases/find-user-by-id.usecase';
import { FindAllUsersUserCase } from './use-cases/find-all-users.usecase';
import { FindAllUsersPaginatedUserCase } from './use-cases/find-all-users-paginated.usecase';
import { FindAllAdminUsersUserCase } from './use-cases/find-all-admin-users.usecase';

@Module({
  imports: [SharedModule],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUserCase,
    FindAllUsersUserCase,
    FindAllUsersPaginatedUserCase,
    FindAllAdminUsersUserCase,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
