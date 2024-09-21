import { Genre } from '@prisma/client';

export class LoggedUserOutputDto {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  role: string;
  createdAt?: Date;
  genre: Genre;
}
