import { z } from "zod";


export const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Define o schema para um array de objetos AdminUser
export const AdminUserArraySchema = z.array(AdminUserSchema);

// Tipos
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminUserArray = z.infer<typeof AdminUserArraySchema>;
