import { Genre, Role } from '@prisma/client';
import { IGenre } from 'src/profile/interfaces/profile.interface';

export class UserProfileOutputDto {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  role: Role;
  genre: Genre | IGenre;
  birthDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  createdAt?: string;
}
