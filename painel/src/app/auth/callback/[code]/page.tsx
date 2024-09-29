'use client';

import Loader from '@/components/common/Loader';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code;

  useEffect(() => {
    if (code) {
      // Trocar o código pelo JWT via API Route
      fetch(`/api/auth/exchange-code/${code}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
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

  return Loader;
}
