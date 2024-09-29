import { Profile } from '@/types/profile';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';



export function useProfile(): UseQueryResult<Profile, Error> {
  return useQuery<Profile, Error, Profile, [string]>({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<Profile> => {
      const res = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Erro ao obter o perfil do usuário');
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Erro ao atualizar o perfil do usuário');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Atualizar o cache do perfil do usuário
      queryClient.setQueryData(['userProfile'], data);
    },
  });
}
