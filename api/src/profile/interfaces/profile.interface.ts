import { IUsers } from 'src/users/interfaces/users.interface';
import { Genre } from '@prisma/client';

export interface IProfile {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: Genre;
  birthDate?: string | null;
  user?: IUsers | null;
}
