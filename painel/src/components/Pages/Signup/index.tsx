"use client";
import Link from "next/link";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleSigninButton from "@/components/Buttons/GoogleSigninButton";
import { useAuthStore } from '@/stores/useAuthStore';
import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { useToastStore } from "@/stores/toastStore";
import { SignupInput, signupSchema } from "@/validations/auth/signupSchema";
import { useSignUp } from "@/hooks/useAuth";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Genre } from "@/types/profile";
import Button from "@/components/Buttons/Button";



export default function SignupPageComponent() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const {mutateAsync: signUp } = useSignUp();
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      username: '',
      genre: 'NAO_INFORMADO' as Genre,
    },
  });

  // Observa o valor do campo email
  const emailValue = useWatch({
    control,
    name: 'email',
    defaultValue: '',
  });

  // Atualiza o campo username quando o email muda
  useEffect(() => {
    if (emailValue) {
      const usernameFromEmail = emailValue.split('@')[0];
      // Sanitiza o username para conter apenas letras, números e underscores
      const sanitizedUsername = usernameFromEmail
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .toLowerCase();
      setValue('username', sanitizedUsername);
    } else {
      setValue('username', '');
    }
  }, [emailValue, setValue]);

  const onSubmit = async (data: SignupInput) => {
    try {
      const result = await signUp(data);
      addToast({
        type: 'success',
        title: `Registro Realizado com Sucesso!`,
        message: `Seus dados foram registrado com sucesso. Seja bem-vindo ibucano!.`,
      });
      const {id, email, username, name, avatarUrl:avatar, role } = result.user;
      const avatarUrl = avatar ?? '/images/default-avatar.png';
      setUser({ id,email,username, name, avatarUrl, role })
      router.push('/dashboard/profile'); // Redireciona para a página do perfil
    } catch (err: any) {
      addToast({
        type: 'error',
        title: `Erro ao tentar Registrar-se`,
        message: `${err.message}`,
      });
      console.log(err);
    }
  };

  const handleGoogleLogin = () => {
    // Redirecionar para a rota de login do Google na sua API NestJS
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };


  return (
    <>
      <GoogleSigninButton text="Registre-se" onClick={handleGoogleLogin} />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Ou registre-se com e-mail
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

      <input type="hidden" {...register("username")} disabled={isSubmitting} className="hidden" readOnly />
      <input type="hidden" {...register("genre")} disabled={isSubmitting} className="hidden" readOnly />

      <div className="mb-4">
        <label
          htmlFor="name"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Nome Completo
        </label>
        <div className="relative">
          <input
            type="name"
            placeholder="Informe seu nome completo"
            {...register("name")}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
          <UserIcon className="size-5" />
          </span>
        </div>
      </div>
      {errors.name && <p className="text-red-500 text-sm">{errors.name?.message}</p>}


      <div className="mb-4">
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
            {...register("email")}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <EnvelopeIcon className="size-5" />
          </span>
        </div>
      </div>
      {errors.email && <p className="text-red-500 text-sm">{errors.email?.message}</p>}

      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Senha
        </label>
        <div className="relative">
          <input
            type="password"
            autoComplete="password"
            placeholder="Informe sua senha"
            {...register("password")}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
          <KeyIcon className="size-5" />
          </span>
        </div>
      </div>
      {errors.password && <p className="text-red-500 text-sm">{errors.password?.message}</p>}

      <div className="mb-5">
        <label
          htmlFor="repeatPassword"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Repita sua Senha
        </label>
        <div className="relative">
          <input
            type="password"
            placeholder="Repita sua senha"
            autoComplete="repeatPassword"
            {...register("repeatPassword")}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
          <KeyIcon className="size-5" />
          </span>
        </div>
      </div>
      {errors.repeatPassword && <p className="text-red-500 text-sm">{errors.repeatPassword?.message}</p>}

      <div className="mb-4.5">
        <Button buttonText={ isSubmitting ? "Criando..." : "Criar minha conta" } isLoading={isSubmitting} customClasses="w-full transition py-4" />
      </div>
    </form>
      </div>

      <div className="mt-6 text-center">
        <p>
          Já possui uma conta?{" "}
          <Link href="/auth/signin" className="text-primary">
           Faça o login
          </Link>
        </p>
      </div>
    </>
  );
}
