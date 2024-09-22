import { Role } from '@prisma/client';
import { IProfile } from 'src/profile/interfaces/profile.interface';

export enum IRole {
  ADMIN = 'ADMIN',
  COLABORADOR = 'COLABORADOR',
  PROFESSOR = 'PROFESSOR',
  JOGADOR = 'JOGADOR',
}

export interface IUsers {
  id: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  microsoftId?: string | null;
  facebookId?: string | null;
  role: IRole | Role;
  createdAt?: Date;
  updatedAt?: Date;
  newsletter?: string;
  profile?: IProfile;
}
