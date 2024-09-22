import { Genre } from '@prisma/client';

export class LoggedUserOutputDto {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  role: string;
  genre: Genre;
  country?: string;
  region?: string;
  city?: string;
  createdAt?: Date;
}
