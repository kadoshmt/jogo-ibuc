import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Chamada à API NestJS
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });


    if (apiRes.status === 201) {
      return NextResponse.json({ success: true });
    } else {
      const data = await apiRes.json();
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    //console.error('Erro interno do servidor:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
