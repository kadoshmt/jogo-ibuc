// app/api/users/create-user/route.ts
import { CreateUserSchema } from '@/validations/users/createUserSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('ibucgameadmin-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();

    // Validar os dados recebidos com Zod
    const parsedData = CreateUserSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = parsedData.error.errors.map(err => err.message).join(', ');
      return NextResponse.json({ message: errors }, { status: 400 });
    }

    // Chamar a API NestJS para criar o usuário
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(parsedData.data),
    });

    const data = await apiRes.json();

    if (apiRes.ok) {
      return NextResponse.json(data, { status: 201 });
    } else {
      return NextResponse.json({ message: data.message || 'Erro ao criar usuário' }, { status: apiRes.status });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(err => err.message).join(', ');
      return NextResponse.json({ message: errors }, { status: 400 });
    }
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
