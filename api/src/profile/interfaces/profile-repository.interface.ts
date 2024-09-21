import { Profile } from '@prisma/client';

export interface IProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  findByUsername(username: string): Promise<Profile | null>;
  create(profileData: Partial<Profile>): Promise<Profile>;
  update(userId: string, profileData: Partial<Profile>): Promise<Profile>;
  delete(userId: string): Promise<void>;
}
