import { Role } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: Role;
}
