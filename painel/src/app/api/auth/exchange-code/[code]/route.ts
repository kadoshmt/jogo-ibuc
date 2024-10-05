import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const { code } = params;

  if (!code) {
    return NextResponse.json({ message: 'Código não informado' }, { status: 400 });
  }

  try {
    // Chamar a API NestJS para trocar o código pelo JWT
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/exchange-code/${code}`, {
      method: 'GET',
    });

    if (res.ok) {
      const data = await res.json();
      const { accessToken, user } = data;

      // Definir o cookie HTTP-only com o JWT
      const response = NextResponse.json({ success: true, user });
      response.cookies.set('ibucgameadmin-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        //sameSite: 'lax',
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
