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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { QueryStringPaginationDto } from 'src/profile/dto/query-string-pagination.dto';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { createPaginator } from 'prisma-pagination';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    const isAvailable = await this.usersService.isUsernameAvailable(username);
    return { username, isAvailable };
  }

  @Post()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.createUser(body);
    return { message: 'Usuário criado com sucesso', user };
  }

  @Put()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async editUser(@Param() id: string, @Body() body: CreateUserDto) {
    const user = await this.usersService.updateUser(id, body);
    return { message: 'Usuário criado com sucesso', user };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteUser(@Param() id: string) {
    await this.usersService.deleteUser(id);
  }

  @Get()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findUser(@Param() id: string) {
    const user = await this.usersService.findOneById(id);
    return { message: 'Usuário criado com sucesso', user };
  }

  // @Get('list')
  // @Roles('ADMIN')
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  // @ApiPaginatedResponse(UserResponseDto)
  // async listUsers(
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
