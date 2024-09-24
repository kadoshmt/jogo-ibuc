import { Genre } from '@prisma/client';
import { IGenre } from '../interfaces/profile.interface';

export class ProfileOutputDto {
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: Genre | IGenre;
  birthDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
}
