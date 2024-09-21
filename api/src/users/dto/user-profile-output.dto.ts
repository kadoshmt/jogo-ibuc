import { Role } from '@prisma/client';

export class UserProfileOutputDto {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string | null;
  role: Role;
}
