import { Request } from 'express';
import { IUsers } from 'src/users/interfaces/users.interface';

export interface AuthenticatedRequest extends Request {
  user: IUsers;
}
