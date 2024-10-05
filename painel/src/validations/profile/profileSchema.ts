import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  genre: z.enum(['MASCULINO', 'FEMININO', 'NAO_INFORMADO'], {
    errorMap: () => ({ message: 'Selecione um gênero válido' }),
  }),
  username: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
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
  birthDate: z.string().optional(),
});
