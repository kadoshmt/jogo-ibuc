import { Genre, Role } from '@prisma/client';

export class UserProfileOutputDto {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  role: Role;
  genre: Genre;
  birthDate?: string | null;
  createdAt?: string;
}
