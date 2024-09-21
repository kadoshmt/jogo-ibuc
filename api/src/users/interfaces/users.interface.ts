import { IAddresses } from './addresses.interface';
import { RoleUser } from './role-user.enum';

export interface IUsers {
  id: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  microsoftId?: string | null;
  facebookId?: string | null;
  role: RoleUser;
  addresses?: IAddresses[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}
