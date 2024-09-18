import { Role } from 'src/users/interfaces/user.interface';

export interface IProfileProps {
  id: string;
  email: string;
  password?: string | null;
  name: string;
  googleId?: string | null;
  microsoftId?: string | null;
  facebookId?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
