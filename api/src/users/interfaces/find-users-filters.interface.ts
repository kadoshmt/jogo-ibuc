import { Role } from '@prisma/client';
import { IRole } from './users.interface';

export interface IFindUsersFilters {
  email?: string;
  name?: string;
  username?: string;
  role?: Role | IRole;
  page?: number;
  perPage?: number;
}
