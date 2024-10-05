import { z } from "zod";
import { UserSchema } from "./usersSchema";

export const PaginatedUsersProfileSchema = z.object({
  data: z.array(UserSchema),
  meta: z.object({
    total: z.number(),
    lastPage: z.number(),
    currentPage: z.number(),
    perPage: z.number(),
    prev: z.number().nullable(),
    next: z.number().nullable(),
  }),
});

export type PaginatedUserProfile = z.infer<typeof PaginatedUsersProfileSchema>;
