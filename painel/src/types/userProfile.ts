export type UserProfile = {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  role: 'JOGADOR' | 'PROFESSOR' | 'COLABORADOR' | 'ADMIN';
  genre: 'MASCULINO' | 'FEMININO' | 'NAO_INFORMADO';
  birthDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  phone?: string | null;
  createdAt?: string;
}
