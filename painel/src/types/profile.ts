export type Profile = {
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  genre: Genre | string;
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
