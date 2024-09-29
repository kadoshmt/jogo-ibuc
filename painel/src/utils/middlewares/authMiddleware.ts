import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '../jwt';

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('ibucgameadmin-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  const verifiedToken = await verifyJwt(token);


  if (!verifiedToken) {
    // Se o usuário não estiver autenticado, redireciona para a página de login
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Se estiver autenticado, permite continuar
  return NextResponse.next();
}
