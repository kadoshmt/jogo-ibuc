import { NextRequest, NextResponse } from 'next/server';

export function loggingMiddleware(req: NextRequest) {
  console.log(`Requisição para ${req.nextUrl.pathname}`);
}
