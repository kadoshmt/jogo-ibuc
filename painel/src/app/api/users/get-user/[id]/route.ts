import { NextRequest, NextResponse } from 'next/server';
import { UpdateUserSchema } from '@/validations/users/updateUserSchema';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obter o token do cookie
    const token = request.cookies.get('ibucgameadmin-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const userId = params.id;

    // Chamar a API NestJS para obter os dados do usuário
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
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
      return NextResponse.json({ message: data.message || 'Erro ao obter o Usuário' }, { status: apiRes.status });
    }
  } catch (error: any) {
    console.error('Erro ao obter o usuário:', error);
    return NextResponse.json({ message: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('ibucgameadmin-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const userId = params.id;
    const body = await request.json();

    // Validar os dados recebidos com Zod
    const parsedData = UpdateUserSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = parsedData.error.errors.map(err => err.message).join(', ');
      return NextResponse.json({ message: errors }, { status: 400 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: data.message }, { status: res.status });
    }
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
