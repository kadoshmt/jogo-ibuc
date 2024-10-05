import { z } from "zod";

export const deleteAccountSchema = z.object({
  confirm: z
    .string()
    .min(7, { message: "Por favor, confirme a exclusão da conta." })
    .refine((val) => val === "EXCLUIR", {
      message: 'Digite "EXCLUIR" para confirmar',
      path: ["confirm"],
    }),
});

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
