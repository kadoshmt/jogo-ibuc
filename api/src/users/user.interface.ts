export enum Role {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR',
  PLAYER = 'PLAYER',
}

export interface User {
  id: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  microsoftId?: string;
  refreshToken?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
