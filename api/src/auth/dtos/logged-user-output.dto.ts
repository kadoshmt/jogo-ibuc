import { Genre } from '@prisma/client';
import { IGenre } from 'src/profile/interfaces/profile.interface';

export class LoggedUserOutputDto {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  role: string;
  genre: Genre | IGenre;
  country?: string;
  region?: string;
  city?: string;
  createdAt?: Date;
}
