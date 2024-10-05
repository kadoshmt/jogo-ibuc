export type Profile = {
  userId?: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: 'MASCULINO' | 'FEMININO' | 'NAO_INFORMADO';
  birthDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  phone?: string | null;
}

export enum Genre {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  NAO_INFORMADO = 'NAO_INFORMADO',
}

export const genreOptions: { value: string; text: string; }[] = [
  { value: 'MASCULINO', text: 'Masculino' },
  { value: 'FEMININO', text: 'Feminino' },
  { value: 'NAO_INFORMADO', text: 'Não Informado' },
];
