// app/api/profile/upload-avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import FormData from 'form-data';
import axios from 'axios';

export const runtime = 'nodejs'; // Garantir que a rota use o ambiente Node.js

export async function PATCH(request: NextRequest) {
  try {
    // Extrair o token dos cookies
    const token = request.cookies.get("ibucgameadmin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    // Obter os dados do formulário (incluindo o arquivo)
    const formData = await request.formData();

    // Obter o arquivo do formulário
    const file = formData.get('profileAvatar') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Converter o arquivo em um Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Criar um FormData para enviar à API NestJS
    const apiFormData = new FormData();
    apiFormData.append('profileAvatar', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    // Obter os headers apropriados do FormData
    const headers = {
      ...apiFormData.getHeaders(),
      Authorization: `Bearer ${token}`,
    };

    // Enviar a requisição para a API NestJS usando axios
    const apiRes = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/upload-avatar`,
      apiFormData,
      { headers }
    );

    // Retornar a resposta da API NestJS ao cliente
    return NextResponse.json(apiRes.data);
  } catch (error: any) {
    console.error("Erro ao fazer upload do avatar do usuário:", error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status || 500;
      const message = error.response.data?.message || "Erro ao fazer upload do avatar";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
