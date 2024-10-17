import { z } from 'zod';

export const forgetPasswordSchema = z.object({
  email: z.string()
    .email({ message: 'Por favor informe um e-mail válido' })
    .transform((val) => val.trim().toLowerCase()),
})


export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
