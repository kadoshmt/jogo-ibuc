import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
//import { PaginationFilter } from 'src/common/dtos/pagination-filter.dto';
import { UserProfileOutputDto } from '../dto/user-profile-output.dto';
import { UserFilterInputDto } from '../dto/user-filter-input.dto';
import { IFindUsersFilters } from './find-users-filters.interface';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';

export interface IUserRepository {
  findOneById(id: string): Promise<User | null>;
  findOne(condition: Partial<User>): Promise<User | null>;
  //findAll(condition: UserFilter): Promise<User[]>;
  findAll(filterDto: UserFilterInputDto): Promise<UserProfileOutputDto[]>;
  //findAllPaginated(condition: PaginationFilter): Promise<User[]>;
  findAllPaginated(
    filters: IFindUsersFilters,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>>;
  findOneByEmail(email: string): Promise<User | null>;
  // findOneByUsername(username: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
