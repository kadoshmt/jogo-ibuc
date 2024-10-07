// src/validations/createUserSchema.ts
import { Genre } from '@/types/profile';
import { Role } from '@/types/user';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string()
    .email({ message: 'Por favor informe um e-mail válido' })
    .transform((val) => val.trim().toLowerCase()),

  password: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .transform((val) => val.trim()),

  name: z.string()
    .min(1, { message: 'O nome é obrigatório' })
    .transform((val) => val.trim()),

  username: z.string()
    .min(1, { message: 'O nome de usuário é obrigatório' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'O nome de usuário deve conter apenas letras, números e underscores ("_")',
    })
    .transform((val) => val.trim()),

  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'O cargo deve ser um dos seguintes: ADMIN, COLABORADOR, JOGADOR, PROFESSOR' }),
  }),

  googleId: z.string().optional().transform((val) => val?.trim()),

  genre: z.nativeEnum(Genre, {
    errorMap: () => ({ message: 'O gênero deve ser um dos seguintes: MASCULINO, FEMININO' }),
  }),

  country: z.string().optional().transform((val) => val?.trim()),

  region: z.string().optional().transform((val) => val?.trim()),

  city: z.string().optional().transform((val) => val?.trim()),

  phone: z
  .string()
  .transform((val) => val.trim())
  .optional()
  .refine(
    (val) => {
      if (!val) return true; // Se val é uma string vazia, consideramos válido
      return /^(?:\+\d{1,3}\s?)?\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val);
    },
    {
      message:
        'Número de telefone deve estar em um dos formatos: (99) 9999-9999, (99) 99999-9999, +999 (99) 9999-9999, +999 (99) 99999-9999',
    }
  ),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
