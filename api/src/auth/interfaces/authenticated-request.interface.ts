import { Request } from 'express';
import { User } from 'src/users/interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user: User;
}
