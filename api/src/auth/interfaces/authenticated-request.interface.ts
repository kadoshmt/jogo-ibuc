import { Request } from 'express';
import { IUsers } from 'src/users/interfaces/users.interface';

export interface IAuthenticatedRequest extends Request {
  user: IUsers;
}
