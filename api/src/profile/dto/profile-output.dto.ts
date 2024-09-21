import { Genre } from '@prisma/client';
// import { GenreProfile } from '../interfaces/genre-profile.enum';

export class ProfileOutputDto {
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: Genre;
  birthDate?: string | null;
}
