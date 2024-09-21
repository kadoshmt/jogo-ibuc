import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CreateUserUseCase } from './use-cases/create-user.usecase.dto';
import { UpdateUserUseCase } from './use-cases/update-user.usecase.dto';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindUserByIdUserCase } from './use-cases/find-user-by-id.usecase.dto';
import { FindAllUsersUserCase } from './use-cases/find-all-users.usecase.dto';
import { FindAllUsersPaginatedUserCase } from './use-cases/find-all-users-paginated.usecase.dto';

@Module({
  imports: [SharedModule],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUserCase,
    FindAllUsersUserCase,
    FindAllUsersPaginatedUserCase,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
