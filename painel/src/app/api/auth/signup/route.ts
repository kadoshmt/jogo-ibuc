import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name, username, genre } = await request.json();

    // Chamada à API NestJS
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password,  name, username, genre }),
    });

    const data = await apiRes.json();

    if (apiRes.ok) {
      const { accessToken, user } = data;

      // Criar a resposta e definir o cookie HTTP-only
      const response = NextResponse.json({ success: true, user });
      response.cookies.set('ibucgameadmin-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 dia
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
