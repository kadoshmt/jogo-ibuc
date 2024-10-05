import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { CreateUserInputDto } from './dtos/create-user-input.dto';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { UpdateUserInputDto } from './dtos/update-user-input.dto';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { DeleteUserInputDto } from './dtos/delete-user-input.dto';
import { IAuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { UserProfileOutputDto } from './dtos/user-profile-output.dto';
import { FindUserByIdUserCase } from './use-cases/find-user-by-id.usecase';
import { UsersFilterInputDto } from './dtos/users-filter-input.dto';
import { FindAllUsersUserCase } from './use-cases/find-all-users.usecase';
import { ListUsersInputDto } from './dtos/list-users-input.dto';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { FindAllUsersPaginatedUserCase } from './use-cases/find-all-users-paginated.usecase';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindAllAdminUsersUserCase } from './use-cases/find-all-admin-users.usecase';
import { UserAdminOutputDto } from './dtos/users-admin-output.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUserCase: FindUserByIdUserCase,
    private readonly findAllUsersUserCase: FindAllUsersUserCase,
    private readonly findAllAdminUsersUserCase: FindAllAdminUsersUserCase,
    private readonly findAllUsersPaginatedUserCase: FindAllUsersPaginatedUserCase,
  ) {}

  @Post()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(
    @Body() body: CreateUserInputDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    const user = await this.createUserUseCase.execute(body, req.user);
    return { message: 'Usuário criado com sucesso', user };
  }

  @Put(':id')
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserInputDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    const user = await this.updateUserUseCase.execute(id, body, req.user);
    return { message: 'Usuário atualizado com sucesso', user };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteUser(
    @Request() req: IAuthenticatedRequest,
    @Body() body: DeleteUserInputDto,
  ) {
    await this.deleteUserUseCase.execute(
      body.userId,
      body.transferUserId,
      req.user,
    );
  }

  @Get()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAllUsers(
    @Query() filterDto: UsersFilterInputDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.findAllUsersUserCase.execute(filterDto, req.user);
  }

  @Get('paginated')
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiPaginatedResponse(UserProfileOutputDto)
  async findAllUsersPaginated(
    @Query() listUsersInputDto: ListUsersInputDto,
    @Request() req: IAuthenticatedRequest,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>> {
    return await this.findAllUsersPaginatedUserCase.execute(
      listUsersInputDto,
      req.user,
    );
  }

  @Get('admin')
  @Roles('ADMIN')
  async findAllAdminUsers(
    @Request() req: IAuthenticatedRequest,
  ): Promise<UserAdminOutputDto[]> {
    return await this.findAllAdminUsersUserCase.execute(req.user);
  }

  @Get(':id')
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findUserById(
    @Param('id') id: string,
    @Request() req: IAuthenticatedRequest,
  ): Promise<UserProfileOutputDto> {
    return await this.findUserByIdUserCase.execute(id, req.user);
  }

  // @Get('paginated')
  // @Roles('ADMIN')
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // @ApiPaginatedResponse(UserResponseDto)
  // async findAllUsersPaginated(
  //   //@Query() query: QueryStringPaginationDto,
  //   @Query('page') page: number = 1,
  //   @Query('perPage') perPage: number = 10,
  //   @Query('sort') sort: string = 'desc',
  //   @Query('q') q: string,
  // ): Promise<User[]]> {
  //   const users = await this.usersService.findAll({ page, perPage, sort, q
  //     // page: query.page ?? 1,
  //     // perPage: query.perPage ?? 10,
  //     // sort: query.sort ?? 'desc',
  //     // q: query.q,
  //   });
  //   //const result = await this.usersService.findAll({ page, perPage, sort, q });
  //   // return { users };
  // }
}
