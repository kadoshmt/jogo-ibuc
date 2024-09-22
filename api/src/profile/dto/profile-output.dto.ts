import { Genre } from '@prisma/client';

export class ProfileOutputDto {
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: Genre;
  birthDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
}
