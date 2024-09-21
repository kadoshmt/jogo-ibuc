import { RoleUser } from './role-user.enum';

export interface IFindUsersFilters {
  email?: string;
  name?: string;
  username?: string;
  role?: RoleUser;
  page?: number;
  perPage?: number;
}
