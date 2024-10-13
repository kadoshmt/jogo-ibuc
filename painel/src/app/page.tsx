"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import LoaderFullPage from '@/components/common/LoaderFullPage';

export default function Home() {
  const router = useRouter();
  const loggedUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!loggedUser) {
      router.push('/auth/signin');
    } else {
      router.push('/dashboard');
    }
  }, [loggedUser, router]);

  return <LoaderFullPage/>
}
