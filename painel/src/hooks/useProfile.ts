import { Profile } from '@/types/profile';
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult  } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface CheckUsernameInput {
  username: string;
}

interface CheckUsernameOutput {
  isAvailable: boolean;
  message: string;
}

interface UpdateUsernameInput {
  currentUsername: string;
  newUsername: string;
}
interface UpdateUsernameOutput {
  message: string;
}

interface DeleteAccountInput {
  confirm: string;
}

interface ApiResponse {
  message: string;
}




export function useProfile(): UseQueryResult<Profile, Error> {
  return useQuery<Profile, Error, Profile, [string]>({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<Profile> => {
      const res = await fetch('/api/profile/get-profile', {
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
      const res = await fetch('/api/profile/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao atualizar o perfil do usuário');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Atualizar o cache do perfil do usuário
      queryClient.setQueryData(['userProfile'], data);
    },
  });
}

export function useChangePassword(): UseMutationResult<ApiResponse, Error, ChangePasswordInput> {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, ChangePasswordInput>({
    mutationFn: async (data: ChangePasswordInput) => {
      const res = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao alterar a senha");
      }

      return responseData;
    },
    onSuccess: () => {
      // Opcional: Invalide ou atualize quaisquer queries relacionadas, se necessário
      // Por exemplo, se a alteração de senha afetar dados de autenticação
    },
  });
}

export function useCheckUsername(): UseMutationResult<CheckUsernameOutput, Error, CheckUsernameInput> {
  return useMutation<CheckUsernameOutput, Error, CheckUsernameInput>({
    mutationFn: async (data: CheckUsernameInput) => {
      const res = await fetch("/api/profile/check-username", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao verificar o username");
      }

      return responseData;
    },
  });
}

export function useUpdateUsername(): UseMutationResult<UpdateUsernameOutput, Error, UpdateUsernameInput> {
  const queryClient = useQueryClient();

  return useMutation<UpdateUsernameOutput, Error, UpdateUsernameInput>({
    mutationFn: async (data: UpdateUsernameInput) => {
      const res = await fetch("/api/profile/update-username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao atualizar o username");
      }

      return responseData;
    },
    onSuccess: () => {
      // Atualize o cache do perfil do usuário após a atualização
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useDeleteAccount(): UseMutationResult<ApiResponse, Error, DeleteAccountInput> {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse, Error, DeleteAccountInput>({
    mutationFn: async (data: DeleteAccountInput) => {
      const res = await fetch("/api/profile/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao excluir a conta");
      }

      return responseData;
    },
    onSuccess: () => {
      // Opcional: Limpar o cache ou redirecionar o usuário após a exclusão
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Por exemplo, redirecionar para a página de login
      //window.location.href = "/auth/signin";
      router.push('/auth/signin'); // Redireciona para a página de login
    },
  });
}
