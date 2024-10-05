import { z } from "zod";

export const checkUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O username deve ter pelo menos 3 caracteres" })
    .max(20, { message: "O username não pode exceder 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username deve conter apenas letras, números e underscores ("_")',
    })
    .trim(),
});

export type CheckUsernameFormData = z.infer<typeof checkUsernameSchema>;
