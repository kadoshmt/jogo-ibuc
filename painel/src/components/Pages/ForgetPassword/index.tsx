'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useForgetPassword } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastStore } from '@/stores/toastStore';
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Buttons/Button';
import {
  ForgetPasswordInput,
  forgetPasswordSchema,
} from '@/validations/auth/forgetPasswordSchema';

export default function ForgetPasswordPageComponent() {
  const [send, setSend] = useState<boolean>(false);
  const { mutateAsync: forgotPassword } = useForgetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit'
  });

  const onSubmit = async (data: ForgetPasswordInput) => {
    try {
      await forgotPassword(data);
      setSend(true);
    } catch (err: any) {

    }
  };

  return (
    <>
      {!send && (
        <>
          <div className='transition-opacity'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-2.5 block font-medium text-dark dark:text-white"
                >
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Informe seu e-mail"
                    {...register('email')}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />

                  <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                    <EnvelopeIcon className="size-5" />
                  </span>
                </div>
                {errors.email && (
                <p className="text-sm text-red-500 mb-5">{errors.email.message}</p>
              )}
              </div>


              <div className="mb-4.5">
                <Button
                  buttonText={
                    isSubmitting ? 'Solicitando link' : 'Solicitar Link'
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
      {send && (
        <div className='text-dark transition-opacity'>
          <h2 className='text-green-500 text-2xl font-bold flex justify-start items-center mb-4'><CheckCircleIcon className='size-6 inline-block mr-1'/> Solicitação enviada com sucesso!</h2>
          <p className='py-2'>Por favor, verifique sua caixa de entrada para encontrar o e-mail com o link de redefinição de senha.</p>
          <p className='py-2'>Se não localizar a mensagem, veja na pasta de spam. Caso ainda não a encontre, tente outro e-mail que possa ter sido usado no cadastro.</p>

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
    </>
  );
}
