import { IUsers } from 'src/users/interfaces/users.interface';
import { Genre } from '@prisma/client';

export enum IGenre {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  NAO_INFORMADO = 'NAO_INFORMADO',
}

export interface IProfile {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: IGenre | Genre;
  birthDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  phone?: string | null;
  user?: IUsers | null;
}
