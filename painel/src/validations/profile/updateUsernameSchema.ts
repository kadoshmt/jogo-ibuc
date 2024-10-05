import { z } from "zod";

export const updateUsernameSchema = z.object({
  currentUsername: z
    .string()
    .min(3, { message: "O username atual deve ter pelo menos 3 caracteres" })
    .max(20, { message: "O username atual não pode exceder 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username atual deve conter apenas letras, números e underscores ("_")',
    })
    .trim(),
  newUsername: z
    .string()
    .min(3, { message: "O novo username deve ter pelo menos 3 caracteres" })
    .max(20, { message: "O novo username não pode exceder 20 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Novo username deve conter apenas letras, números e underscores ("_")',
    })
    .trim(),
});

export type UpdateUsernameFormData = z.infer<typeof updateUsernameSchema>;
