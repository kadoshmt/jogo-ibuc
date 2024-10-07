'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLogout = async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      logout();
      queryClient.invalidateQueries({ queryKey: ['userProfile', 'users'] });
      router.push('/auth/signin'); // Redireciona para a página de login
    };
    handleLogout();
  }, [logout, queryClient, router]);


}
