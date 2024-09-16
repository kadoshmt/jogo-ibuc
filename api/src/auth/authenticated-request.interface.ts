// import { User } from '@prisma/client';

import { Request } from 'express';
import { User } from 'src/users/user.interface';

export interface AuthenticatedRequest extends Request {
  user: User;
}
