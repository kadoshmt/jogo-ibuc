import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("ibucgameadmin-token")?.value;


    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Chamar a API NestJS para alterar a senha
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: "include",
    });

    //const data = await apiRes.json();

    if (apiRes.status === 204) {
      return NextResponse.json({ status: 200 });
    } else {
      const data = await apiRes.json();
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    console.error("Erro ao alterar a senha do usuário:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
