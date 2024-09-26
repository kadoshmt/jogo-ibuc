// src/app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { loggingMiddleware } from './utils/middlewares/loggingMiddleware';
import { authMiddleware } from './utils/middlewares/authMiddleware';

export async function middleware(req: NextRequest) {

  // Executar o middleware de logging
  const loggingResponse = loggingMiddleware(req);

  // Executar o middleware de autenticação
  const authResponse = await authMiddleware(req);

  console.log("authResponse: ", authResponse);
  if (authResponse) return authResponse;

  // Se nenhum middleware retornar uma resposta, continuar para a rota solicitada
  return NextResponse.next();
}

// Configuração do matcher
export const config = {
  matcher: ['/dashboard/:path*'],
};
