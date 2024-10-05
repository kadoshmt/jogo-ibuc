import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "A senha atual deve ter pelo menos 6 caracteres" })
      .trim(),
    newPassword: z
      .string()
      .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" })
      .trim(),
    repeatNewPassword: z
      .string()
      .min(6, { message: "A repetição da nova senha deve ter pelo menos 6 caracteres" })
      .trim(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.repeatNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatNewPassword"],
        message: "As senhas não coincidem",
      });
    }

    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "A nova senha deve ser diferente da senha atual",
      });
    }
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
