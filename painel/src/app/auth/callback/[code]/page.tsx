'use client';

import LoaderFullPage from '@/components/common/LoaderFullPage';
import { useAuthStore } from '@/stores/useAuthStore';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code;
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (code) {
      // Trocar o código pelo JWT via API Route
      fetch(`/api/auth/exchange-code/${code}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Atualizar o estado de autenticação
            // setAuthenticated(true);
            setUser(data.user)

            // Refetch dos dados do usuário
            //queryClient.invalidateQueries(['Profile']);

            // Redirecionar para o dashboard
            router.push('/dashboard'); // Redireciona para o dashboard
          } else {
            router.push('/auth/signin'); // Redireciona para a página de login
          }
        })
        .catch(() => {
          router.push('/auth/signin'); // Redireciona para a página de login
        });
    } else {
      router.push('/auth/signin'); // Redireciona se não houver código
    }
  }, [code, router]);

  return <LoaderFullPage />;
}
