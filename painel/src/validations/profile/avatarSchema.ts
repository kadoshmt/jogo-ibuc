import { z } from "zod";

export const avatarSchema = z.object({
  profileAvatar: z
    .any()
    .refine((files) => files && files.length === 1, "Você deve selecionar um arquivo.")
    .refine(
      (files) => files && files[0] && files[0].size <= 5 * 1024 * 1024,
      "O arquivo deve ter no máximo 5MB."
    )
    .refine(
      (files) =>
        files &&
        files[0] &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0].type),
      "Formato de arquivo inválido."
    ),
});

export type AvatarFormData = z.infer<typeof avatarSchema>;
