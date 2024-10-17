import { Genre, Profile } from '@/types/profile';
import { UserProfile } from '@/types/userProfile';
import { ForgetPasswordInput, forgetPasswordSchema } from '@/validations/auth/forgetPasswordSchema';
import { ResetPasswordInput, resetPasswordSchema } from '@/validations/auth/resetPasswordSchema';
import { SigninInput, signinSchema } from '@/validations/auth/signinSchema';
import { SignupInput } from '@/validations/auth/signupSchema';
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult  } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Register {
    email: string;
    password: string;
    name: string;
    username: string;
    genre: Genre;
}


interface ApiResponse {
  message: string;
}

export interface SigninResponse {
  accessToken: string;
  user: UserProfile;
}

export interface SignupResponse extends SigninResponse{};


export function useSignin(): UseMutationResult<SigninResponse, Error, SigninInput> {
  const queryClient = useQueryClient();

  return useMutation<SigninResponse, Error, SigninInput>({
    mutationFn: async (data: SigninInput) => {

       // Validar os dados com Zod antes de enviar
       const parsed = signinSchema.safeParse(data);
       if (!parsed.success) {
         throw new Error(parsed.error.errors.map(e => e.message).join(', '));
       }

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao tentar realizar o Login');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useSignUp(): UseMutationResult<SignupResponse, Error, Register> {
  const queryClient = useQueryClient();

  return useMutation<SignupResponse, Error, Register>({
    mutationFn: async (data: Register) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Erro ao tentar registrar-se.");
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useForgetPassword(): UseMutationResult<void, Error, ForgetPasswordInput> {

  return useMutation<void, Error, ForgetPasswordInput>({

    mutationFn: async (data: ForgetPasswordInput) => {

       // Validar os dados com Zod antes de enviar
       const parsed = forgetPasswordSchema.safeParse(data);
       if (!parsed.success) {
         throw new Error(parsed.error.errors.map(e => e.message).join(', '));
       }

      const res = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   throw new Error(errorData.message || 'Erro ao solicitar o link de redefinição de senha');
      // }
      // return res.json();
    },
    onSuccess: () => { },
  });
}

export function useResetPassword(): UseMutationResult<void, Error, ResetPasswordInput> {

  return useMutation<void, Error, ResetPasswordInput>({

    mutationFn: async (data: ResetPasswordInput) => {

       // Validar os dados com Zod antes de enviar
       const parsed = resetPasswordSchema.safeParse(data);
       if (!parsed.success) {
         throw new Error(parsed.error.errors.map(e => e.message).join(', '));
       }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao solicitar o link de redefinição de senha');
      }
      return res.json();
    },
    onSuccess: () => { },
  });
}
