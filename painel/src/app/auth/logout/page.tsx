'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleLogout = async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      logout();
      router.push('/auth/signin'); // Redireciona para a página de login
    };
    handleLogout();
  }, [logout, router]);


}
