/* eslint-disable react/display-name */
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/toastStore';

const withRoleProtection = (Component: React.ComponentType, allowedRoles: string[]) => {
  return (props: any) => {
    const router = useRouter();
    const loggedUser = useAuthStore((state) => state.user);
    const addToast = useToastStore((state) => state.addToast);

    useEffect(() => {
      // Se o usuário não estiver logado ou não tiver a role adequada, redirecionar
      if (!loggedUser || !allowedRoles.includes(loggedUser.role)) {
        addToast({
          type: 'error',
          title: 'Você não tem permissão para acessar esta página.',
        });
        router.push('/dashboard'); // Redirecionar para outra página
      }
    }, [addToast, loggedUser, router]);

    // Mostrar nada enquanto verifica a role e redireciona
    if (!loggedUser || !allowedRoles.includes(loggedUser.role)) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withRoleProtection;
