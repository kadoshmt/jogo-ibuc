import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z.string().transform((val) => val.trim()),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .trim(),
  repeatPassword: z
    .string()
    .min(8, { message: "A repetição da senha deve ter pelo menos 8 caracteres" })
    .trim(),
})
.superRefine((data, ctx) => {
  if (data.password !== data.repeatPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["repeatPassword"],
      message: "As senhas informadas são diferentes",
    });
  }
});



export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
