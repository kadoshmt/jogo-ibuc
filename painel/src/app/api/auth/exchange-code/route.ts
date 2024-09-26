import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code } = await request.json();

  try {
    // Chamar a API NestJS para trocar o código pelo JWT
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/exchange-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      const data = await res.json();
      const { accessToken } = data;

      // Definir o cookie HTTP-only com o JWT
      const response = NextResponse.json({ success: true });
      response.cookies.set('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 dia
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({ message: 'Código inválido ou expirado' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao trocar o código pelo token' }, { status: 500 });
  }
}
