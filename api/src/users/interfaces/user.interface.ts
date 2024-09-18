export enum Role {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR',
  PLAYER = 'PLAYER',
}

export interface User {
  id: string;
  email: string;
  password?: string | null;
  name: string;
  googleId?: string | null;
  microsoftId?: string | null;
  facebookId?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
