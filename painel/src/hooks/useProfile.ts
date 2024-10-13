import { useAuthStore } from '@/stores/useAuthStore';
import { LoggedUser } from '@/types/loggedUser';
import { Profile } from '@/types/profile';
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult  } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface CreatePasswordInput {
  password: string;
}

interface CheckUsernameInput {
  username: string;
}

interface CheckUsernameOutput {
  isAvailable: boolean;
  message: string;
}

interface CheckPasswordOutput {
  wasProvided: boolean;
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
interface UpdateAvatarResponse {
  avatarUrl: string;
  message?: string;
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
    onSuccess: () => { },
  });
}

// export function useCheckUsername(): UseQueryResult<CheckUsernameOutput, Error> {
//   return useQuery<CheckUsernameOutput, Error, CheckUsernameOutput, [string]>({
//     queryKey: ['userCheckUsername'],
//     queryFn: async (data: CheckUsernameInput) => {
//       const res = await fetch("/api/profile/check-username", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(data),
//       });

//       const responseData = await res.json();

//       if (!res.ok) {
//         throw new Error(responseData.message || "Erro ao verificar o username");
//       }

//       return responseData;
//     },
//     staleTime: 1000 * 60 * 5, // 5 minutos
//     gcTime: 1000 * 60 * 10, // 10 minutos
//   });
// }

export function useCheckPassword(): UseQueryResult<CheckPasswordOutput, Error> {
  return useQuery<CheckPasswordOutput, Error, CheckPasswordOutput, [string]>({
    queryKey: ['userCheckPassword'],
    queryFn: async () => {
      const res = await fetch("/api/profile/check-password", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        //body: JSON.stringify(),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao verificar a senha");
      }

      return responseData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useCreatePassword(): UseMutationResult<ApiResponse, Error, CreatePasswordInput> {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, CreatePasswordInput>({
    mutationFn: async (data: CreatePasswordInput) => {
      const res = await fetch("/api/profile/create-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao criar a senha");
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCheckPassword'] });
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

export function useUpdateAvatar(): UseMutationResult<UpdateAvatarResponse, Error, FormData> {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore.getState().user;

  return useMutation<UpdateAvatarResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/profile/update-avatar", {
        method: "PATCH",
        credentials: "include",
        body: data, // Enviamos o FormData com o arquivo
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao atualizar o avatar");
      }
      return res.json(); // Supondo que retorna { avatarUrl: string }
    },
    onSuccess: (data: UpdateAvatarResponse) => {
      // Atualizar o usuário no estado global
      if(user) {
        const updatedUser = { ...user, avatarUrl: data.avatarUrl };
        setUser(updatedUser);
      }

      // Atualizar o cache do perfil do usuário
      queryClient.setQueryData(["profileAvatar"], (oldData: any) => ({
        ...oldData,
        avatarUrl: data.avatarUrl,
      }));
    },
  });
}
