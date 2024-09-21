import { Role } from '@prisma/client';

export interface IFindUsersFilters {
  email?: string;
  name?: string;
  username?: string;
  role?: Role;
  page?: number;
  perPage?: number;
}
