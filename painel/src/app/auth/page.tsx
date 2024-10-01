'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth/signin'); // Redireciona para a página de login
  }, [router]);


}
