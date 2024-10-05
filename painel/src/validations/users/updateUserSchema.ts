import { z } from 'zod';
import { Genre } from '@/types/profile';
import { Role } from '@/types/user';

export const UpdateUserSchema = z.object({
  name: z.string().optional().transform((val) => val?.trim()),
  email: z.string()
    .email({ message: 'E-mail inválido' })
    .transform((val) => val.trim().toLowerCase()),
  username: z.string()
    .min(1, { message: 'O username é obrigatório' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'O username deve conter apenas letras, números e underscores ("_")',
    })
    .transform((val) => val.trim()),
  avatarUrl: z.string().optional().transform((val) => val?.trim()),
  birthDate: z.string().optional().transform((val) => val?.trim()),
  genre: z.nativeEnum(Genre, {
    errorMap: () => ({ message: 'O gênero deve ser um dos seguintes: MASCULINO, FEMININO, NAO_INFORMADO' }),
  }),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'O cargo deve ser um dos seguintes: ADMIN, COLABORADOR, JOGADOR, PROFESSOR' }),
  }),
  country: z.string().optional().transform((val) => val?.trim()),
  region: z.string().optional().transform((val) => val?.trim()),
  city: z.string().optional().transform((val) => val?.trim()),
  phone: z
    .string()
    .optional()
    .transform((val) => val?.trim())
    .refine(
      (val) => {
        if (!val) return true; // Se val é vazio ou undefined, consideramos válido
        return /^(?:\+\d{1,3}\s?)?\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val);
      },
      {
        message:
          'Número de telefone deve estar em um dos formatos: (99) 9999-9999, (99) 99999-9999, +999 (99) 9999-9999, +999 (99) 99999-9999',
      }
    ),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
