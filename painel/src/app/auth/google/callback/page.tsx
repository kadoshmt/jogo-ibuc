'use client';

import { Metadata } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: "Signin | IBUCGameAdmin",
  description: "Gerenciador de Contéudos do Jogo IBUC",
};


export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      // Trocar o código pelo JWT via API Route
      fetch('/api/auth/exchange-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }).then((res) => {
        if (res.ok) {
          router.push('/dashboard');
        } else {
          // Tratar erros
          router.push('/login');
        }
      });
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return <div>Processando login...</div>;
}
