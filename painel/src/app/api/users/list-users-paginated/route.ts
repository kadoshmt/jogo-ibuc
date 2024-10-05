import { NextRequest, NextResponse } from 'next/server';
import { PaginatedUsersProfileSchema } from '@/validations/users/paginatedUsersProfileSchema';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('ibucgameadmin-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '10', 10);

    // Chamar a API NestJS para obter a lista de usuários paginados
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/paginated?page=${page}&perPage=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await apiRes.json();

    if (apiRes.ok) {
      // Validar a resposta usando o schema Zod
      const parsedData = PaginatedUsersProfileSchema.safeParse(data);
      if (!parsedData.success) {
        console.error(parsedData.error); // Opcional: Log detalhado do erro de validação
        return NextResponse.json({ message: 'Dados inválidos recebidos da API' }, { status: 500 });
      }

      return NextResponse.json(parsedData.data, { status: 200 });
    } else {
      return NextResponse.json({ message: data.message }, { status: apiRes.status });
    }
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
