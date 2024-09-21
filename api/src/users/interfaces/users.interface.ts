import { Role } from '@prisma/client';
import { IAddresses } from './addresses.interface';

export interface IUsers {
  id: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  microsoftId?: string | null;
  facebookId?: string | null;
  role: Role;
  addresses?: IAddresses[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}
