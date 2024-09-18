import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationFilter } from 'src/common/dtos/pagination-filter.dto';

export interface IUserRepository {
  findOneById(id: string): Promise<User | null>;
  findOne(condition: Partial<User>): Promise<User | null>;
  findAll(condition: PaginationFilter): Promise<User[]>;
  findOneByEmail(email: string): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  // Add other methods as needed
}
