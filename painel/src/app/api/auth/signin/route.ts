import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Chamada à API NestJS
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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


// export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { email, password } = req.body;

//       // Chamada à API NestJS
//       const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await apiRes.json();

//       if (apiRes.ok) {
//         const { accessToken } = data;

//         // Armazenar o token JWT em um cookie HTTP-only
//         setCookie({ res }, 'token', accessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           maxAge: 60 * 60 * 24, // 1 dia
//           path: '/',
//         });

//         res.status(200).json({ success: true });
//       } else {
//         res.status(apiRes.status).json({ message: data.message });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Erro interno do servidor' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({ message: `Método ${req.method} não permitido` });
//   }
// }
