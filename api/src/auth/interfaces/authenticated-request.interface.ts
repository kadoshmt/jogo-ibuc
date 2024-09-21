import { Request } from 'express';
import { IUser } from 'src/users/interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
