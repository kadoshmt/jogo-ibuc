import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  genre: z.enum(["MASCULINO", "FEMININO", "NAO_INFORMADO"]), // Ajuste conforme seus tipos
  birthDate: z.string().nullable(), // Pode usar z.date() se estiver lidando com datas no lado do servidor
  country: z.string().nullable(),
  region: z.string().nullable(),
  city: z.string().nullable(),
  phone: z.string().nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;
