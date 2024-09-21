import { RoleUser } from './role-user.enum';

export interface IUser {
  id: string;
  email: string;
  password?: string | null;
  name: string;
  googleId?: string | null;
  microsoftId?: string | null;
  facebookId?: string | null;
  role: RoleUser;
  createdAt?: Date;
  updatedAt?: Date;
}
