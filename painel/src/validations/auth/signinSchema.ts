import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email({ message: 'Por favor informe um e-mail válido' }).trim(),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .trim(),
})


export type SigninInput = z.infer<typeof signinSchema>;
