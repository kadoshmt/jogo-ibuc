import { Profile } from "./profile"

export type User = {
    id?: string;
    email: string;
    role: 'JOGADOR' | 'PROFESSOR' | 'COLABORADOR' | 'ADMIN';
    createdAt?: string;
    profile?: Profile;
}

export enum Role {
  JOGADOR = 'JOGADOR',
  PROFESSOR = 'PROFESSOR',
  COLABORADOR = 'COLABORADOR',
  ADMIN = 'ADMIN',
}

export const roleOptions: { value: string; text: string; }[] = [
  { value: 'JOGADOR', text: 'Jogador' },
  { value: 'PROFESSOR', text: 'Professor' },
  { value: 'COLABORADOR', text: 'Colaborador' },
  { value: 'ADMIN', text: 'Administrador' },
];
