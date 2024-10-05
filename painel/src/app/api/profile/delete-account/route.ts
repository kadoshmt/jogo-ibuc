// src/pages/api/user/delete-account.ts
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("ibucgameadmin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { confirm } = body;

    // Validar a confirmação no backend, se necessário
    if (confirm !== 'EXCLUIR'){
      return NextResponse.json({ message: "Você deve digitar 'EXCLUIR' para confirmar a exclusão." }, { status: 404 });
    }

    // Chamar a API NestJS para excluir a conta
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
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
