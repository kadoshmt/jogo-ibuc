// src/validations/userSchema.ts
import { z } from "zod";
import { ProfileSchema } from "./profileSchema";
import { Role } from "@/types/user";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  createdAt: z.string(),
  profile: ProfileSchema,
});

export type User = z.infer<typeof UserSchema>;
