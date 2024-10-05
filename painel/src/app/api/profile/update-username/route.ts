import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("ibucgameadmin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentUsername, newUsername } = body;

    // Chamar a API NestJS para atualizar o username
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update-username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ currentUsername, newUsername }),
    });

    const data = await apiRes.json();

    if (apiRes.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    console.error("Erro ao atualizar o username do usuário:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
