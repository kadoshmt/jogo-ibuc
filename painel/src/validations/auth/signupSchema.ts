import { Genre } from '@/types/profile';
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string()
    .min(1, { message: 'O nome é obrigatório' })
    .transform((val) => val.trim()),
  email: z.string()
    .email({ message: 'Por favor informe um e-mail válido' })
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .trim(),
  repeatPassword: z
    .string()
    .min(8, { message: "A repetição dasenha deve ter pelo menos 8 caracteres" })
    .trim(),
  username: z.string()
    .min(1, { message: 'O nome de usuário é obrigatório' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'O nome de usuário deve conter apenas letras, números e underscores ("_")',
    })
    .transform((val) => val.trim()),
  genre: z.nativeEnum(Genre, {
      errorMap: () => ({ message: 'O gênero deve ser um dos seguintes: MASCULINO, FEMININO, NAO_INFORMADO' }),
    }),
})
.superRefine((data, ctx) => {
  if (data.password !== data.repeatPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["repeatPassword"],
      message: "As senhas não coincidem",
    });
  }
});

export type SignupInput = z.infer<typeof signupSchema>;
