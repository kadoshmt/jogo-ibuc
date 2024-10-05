import { z } from 'zod';
import { Role } from '@/types/user';
import { Genre } from '@/types/profile';

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable().optional(),
  role: z.nativeEnum(Role),
  genre: z.nativeEnum(Genre),
  birthDate: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
