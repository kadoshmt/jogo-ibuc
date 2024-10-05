// src/pages/api/user/delete-account.ts
import { DeleteUserSchema } from "@/validations/users/deleteUserSchema";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("ibucgameadmin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();

    // Validar os dados recebidos com Zod
    const parsedData = DeleteUserSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = parsedData.error.errors.map(err => err.message).join(', ');
      return NextResponse.json({ message: errors }, { status: 400 });
    }

    // Chamar a API NestJS para excluir a conta
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(parsedData.data),
    });


    if (apiRes.status === 204) {
      return NextResponse.json({ status: 200 });
    } else {
      const data = await apiRes.json();
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    console.error("Erro ao excluir a conta do usuário:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
