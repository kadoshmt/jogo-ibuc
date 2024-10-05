import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Obter o token do cookie
    const token = request.cookies.get('ibucgameadmin-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    // Chamar a API NestJS para obter os dados do usuário
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await apiRes.json();

    if (apiRes.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    console.error('Erro ao obter o perfil do usuário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
