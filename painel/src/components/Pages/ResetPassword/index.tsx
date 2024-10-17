'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useResetPassword } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Buttons/Button';

import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@/validations/auth/resetPasswordSchema';

export default function ResetPasswordPageComponent() {
  const [success, setSuccess] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<boolean>(false);
  const { mutateAsync: resetPassword } = useResetPassword();

  const params = useParams();
  const token = params.token as string;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      repeatPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword(data);
      setSuccess(true);
    } catch (err: any) {
      setTokenError(true);
    }
  };

  return (
    <>
      {(!success && !tokenError) && (
        <>
          <div className="transition-opacity">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <input
                type="hidden"
                {...register('token')}
                disabled={isSubmitting}
                className="hidden"
                readOnly
              />
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="mb-2.5 block font-medium text-dark dark:text-white"
                >
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoComplete="password"
                    placeholder="Informe sua nova senha"
                    {...register('password')}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />

                  <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                    <KeyIcon className="size-5" />
                  </span>
                </div>
                {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              </div>


              <div className="mb-5">
                <label
                  htmlFor="repeatPassword"
                  className="mb-2.5 block font-medium text-dark dark:text-white"
                >
                  Repita sua nova senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Repita sua nova senha"
                    autoComplete="repeatPassword"
                    {...register('repeatPassword')}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />

                  <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                    <KeyIcon className="size-5" />
                  </span>
                </div>
                {errors.repeatPassword && (
                  <p className="text-sm text-red-500">
                    {errors.repeatPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-4.5">
                <Button
                  buttonText={
                    isSubmitting ? 'Redefinindo Senha' : 'Redefinir Senha'
                  }
                  isLoading={isSubmitting}
                  customClasses="w-full transition py-4"
                />
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p>
              <Link href="/auth/signin" className="text-primary">
                Clique aqui
              </Link>{' '}
              para entrar na sua conta
            </p>
          </div>
        </>
      )}
      {success && (
        <div className="text-dark transition-opacity">
          <h2 className="mb-4 flex items-center justify-start text-2xl font-bold text-green-500">
            <CheckCircleIcon className="mr-1 inline-block size-6" /> Senha redefinida com sucesso!
          </h2>
          <p className="py-2">
            Sua senha foi redefinida com sucesso. Agora você já pode fazer login em nosso site.
          </p>

          <div className="mt-8 text-center">
            <p>
              <Link href="/auth/signin" className="text-primary">
                Clique aqui
              </Link>{' '}
              para entrar na sua conta
            </p>
          </div>
        </div>
      )}

      {tokenError && (
        <div className="text-dark transition-opacity">
          <h2 className="mb-4 flex items-center justify-start text-2xl font-bold text-red-400">
            <ExclamationTriangleIcon className="mr-1 inline-block size-6" /> Código Inválido ou expirado!
          </h2>
          <p className="py-2">
            O código que você forneceu não é válido ou já expirou. Solicite um novo link de redefinição de senha {' '}
            <Link href="/auth/forget-password" className="text-primary">
              clicando aqui
            </Link>.
          </p>

          <div className="mt-8 text-center">
          <p>
              <Link href="/auth/signin" className="text-primary">
                Voltar para tela de login
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
