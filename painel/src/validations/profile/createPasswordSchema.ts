import { z } from "zod";

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
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
        message: "As senhas não coincidem",
      });
    }


  });

export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
