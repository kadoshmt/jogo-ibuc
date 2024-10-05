
import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { PaginatedUserProfile, PaginatedUsersProfileSchema } from '@/validations/users/paginatedUsersProfileSchema';
import { UserProfile } from '@/types/userProfile';
import { CreateUserInput, CreateUserSchema } from '@/validations/users/createUserSchema';
import { UpdateUserInput, UpdateUserSchema } from '@/validations/users/updateUserSchema';
import { AdminUser, AdminUserSchema } from '@/validations/users/adminUsersSchema';

interface UseUsersParams {
  page?: number;
  perPage?: number;
}

interface CreateUpdateUserResponse {
  message: string;
  user: UserProfile;
}

type UpdateUserVariables = {
  id: string;
  data: UpdateUserInput;
};

type DeleteUserVariables = {
  userId: string;
  transferUserId: string;
};


export function useUserById(id: string): UseQueryResult<UserProfile, Error> {
  return useQuery<UserProfile, Error, UserProfile, [string, string]>({
    queryKey: ['user', id],
    queryFn: async (): Promise<UserProfile> => {
      const res = await fetch(`/api/users/get-user/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Erro ao obter o perfil do usuário');
      }
      return await res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useUsers(
  params: UseUsersParams = {},
  options?: UseQueryOptions<PaginatedUserProfile, Error>
): UseQueryResult<PaginatedUserProfile, Error> {
  const { page = 1, perPage = 10 } = params;

  return useQuery<PaginatedUserProfile, Error>({
    queryKey: ['users', page, perPage],
    queryFn: async (): Promise<PaginatedUserProfile> => {
      const res = await fetch(`/api/users/list-users-paginated?page=${page}&perPage=${perPage}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários');
      }

      const data = await res.json();

      const parsedData = PaginatedUsersProfileSchema.safeParse(data);

      if (!parsedData.success) {
        console.error(parsedData.error); // Opcional: Log detalhado do erro de validação
        throw new Error('Dados inválidos recebidos da API');
      }

      return parsedData.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    ...options,
  });
}

export function useAllAdminUsers(): UseQueryResult<AdminUser[], Error> {

  return useQuery<AdminUser[], Error>({
    queryKey: ['adminUsers'],
    queryFn: async (): Promise<AdminUser[]> => {
      const res = await fetch(`/api/users/list-all-admin-users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários Administradores');
      }

      const data = await res.json();

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<CreateUpdateUserResponse, Error, CreateUserInput>({
    mutationFn: async (newUser: CreateUserInput) => {
      // Validar os dados com Zod antes de enviar
      const parsed = CreateUserSchema.safeParse(newUser);
      if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join(', '));
      }

      const response = await fetch('/api/users/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar usuário');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalida e refetch os dados de usuários após a criação
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateUpdateUserResponse, Error, UpdateUserVariables>({
    mutationFn: async ({ id, data }) => {

      // Validar os dados com Zod antes de enviar
      const parsed = UpdateUserSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join(', '));
      }

      const res = await fetch(`/api/users/update-user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao atualizar o usuário');
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      // Invalida e refetch os dados de usuários após a atualização
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id], });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteUserVariables>({
    mutationFn: async ({ userId, transferUserId }) => {
      const res = await fetch(`/api/users/delete-user`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ userId, transferUserId: transferUserId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao deletar o usuário');
      }
    },
    onSuccess: () => {
      // Invalida a lista de usuários após a exclusão
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
