"use client";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleSigninButton from "@/components/Buttons/GoogleSigninButton";
import { useAuthStore } from '@/stores/useAuthStore';
import { SigninInput, signinSchema } from "@/validations/auth/signinSchema";
import { useSignin } from "@/hooks/useSign";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/stores/toastStore";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";




export default function SigninPageComponent() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [remember, setRemember] = useState<boolean>(false);

  const addToast = useToastStore((state) => state.addToast);
  const {mutate: signIn, isPending } = useSignin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SigninInput) => {
    signIn(data, {
      onSuccess: (result) => {
        const {id, email, username, name, avatarUrl:avatar, role } = result.user;
        const avatarUrl = avatar ?? '/images/default-avatar.png';
        setUser({ id,email,username, name, avatarUrl, role })
        router.push('/dashboard/');
      },
      onError: (err: Error) => {
        console.error(err);
        addToast({
          type: 'error',
          title: `Erro ao Realizar o Login`,
          message: `Houve um erro ao tentar realizar o login: ${err.message}`,
        });
      },
    });
  };

  const handleGoogleLogin = () => {
    // Redirecionar para a rota de login do Google na sua API NestJS
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };


  return (
    <>
      <GoogleSigninButton text="Entrar" onClick={handleGoogleLogin} />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Ou entrar com e-mail
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            disabled={isPending}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <EnvelopeIcon className="size-5" />
          </span>
        </div>
      </div>
      {errors && <p className="text-red-500 text-sm">{errors.email?.message}</p>}

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
            placeholder="Informe sua senha"
            autoComplete="password"
            {...register("password")}
            disabled={isPending}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            <KeyIcon className="size-5" />
          </span>
        </div>
      </div>
      {errors.password && <p className="text-red-500 text-sm">{errors.password?.message}</p>}

      <div className="mb-6 flex items-center justify-between gap-2 py-2">
        <label
          htmlFor="remember"
          className="flex cursor-pointer select-none items-center font-satoshi text-base font-medium text-dark dark:text-white"
        >
          <input
            type="checkbox"
            name="remember"
            id="remember"
            className="peer sr-only"
            onChange={() => setRemember(!remember)}
            checked={remember}
            disabled={isPending}
          />
          <span
            className={`mr-2.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md border border-stroke bg-white text-white text-opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-opacity-100 dark:border-stroke-dark dark:bg-white/5 ${
              remember ? "bg-primary" : ""
            }`}
          >
            <KeyIcon className="size-5" />
          </span>
          Lembrar-me
        </label>

        <Link
          href="/auth/forgot-password"
          className="select-none font-satoshi text-base font-medium text-dark underline duration-300 hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          disabled={isPending}
        >
         {isPending ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </form>
      </div>

      <div className="mt-6 text-center">
        <p>
          Não tem uma conta?{" "}
          <Link href="/auth/signup" className="text-primary">
           Cadastrar-se
          </Link>
        </p>
      </div>
    </>
  );
}
