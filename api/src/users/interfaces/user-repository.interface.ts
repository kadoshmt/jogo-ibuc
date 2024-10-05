import { Users } from '@prisma/client';
import { UserProfileOutputDto } from '../dtos/user-profile-output.dto';
import { UsersFilterInputDto } from '../dtos/users-filter-input.dto';
import { IFindUsersFilters } from './find-users-filters.interface';
import { PaginatedOutputDto } from 'src/common/dtos/paginated-output.dto';
import { UserAdminOutputDto } from '../dtos/users-admin-output.dto';

export interface IUserRepository {
  findOneById(id: string): Promise<Users | null>;
  findOne(condition: Partial<Users>): Promise<Users | null>;
  //findAll(condition: UserFilter): Promise<User[]>;
  findAll(filterDto: UsersFilterInputDto): Promise<UserProfileOutputDto[]>;
  findAllAdmin(): Promise<UserAdminOutputDto[]>;
  //findAllPaginated(condition: PaginationFilter): Promise<User[]>;
  findAllPaginated(
    filters: IFindUsersFilters,
  ): Promise<PaginatedOutputDto<UserProfileOutputDto>>;
  findOneByEmail(email: string): Promise<Users | null>;
  create(data: Partial<Users>): Promise<Users>;
  update(id: string, data: Partial<Users>): Promise<Users>;
  delete(id: string): Promise<void>;
}
