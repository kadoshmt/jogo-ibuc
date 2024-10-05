import { z } from 'zod';

export const DeleteUserSchema = z.object({
  userId: z.string()
    .uuid({ message: 'ID do usuário a ser apagado inválido' })
    .transform((val) => val.trim().toLowerCase()),

  transferUserId: z.string()
    .uuid({ message: 'ID do usuário administrador inválido' })
    .transform((val) => val.trim().toLowerCase()),
});

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
