"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/stores/toastStore";
import {  useCreatePassword } from "@/hooks/useProfile";
import PasswordInputGroup from "@/components/FormElements/PasswordInput";
import { KeyIcon } from "@heroicons/react/24/outline";
import { CreatePasswordInput, createPasswordSchema } from "@/validations/profile/createPasswordSchema";
import Button from "@/components/Buttons/Button";



export const ProfileCreatePasswordForm = () => {

  const addToast = useToastStore((state) => state.addToast);
  const createPassword = useCreatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePasswordInput>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      password: '',
      repeatPassword: ''
    },
  });

  // const onSubmit: SubmitHandler<CreatePasswordInput> = async (data) => {
    const onSubmit = async (data: CreatePasswordInput) => {
    try {

      // Chamada à API para criar a senha
      await createPassword.mutateAsync({
        password: data.password,
      });


      // Reseta o formulário após o sucesso
      reset();

      addToast({
        type: 'success',
        title: 'Senha criada com sucesso',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Ocorreu um erro ao criar a senha',
        // message: `Ocorreu um erro ao alterar a senha. Por favor, tente novamente.`,
        messageList: [`Erro: ${error.message}`]
      });
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          Criar uma Senha
        </h3>
      </div>
      <div className="p-7">
        <p className="mb-8">Você também pode definir uma senha caso queira entrar na plataforma usando seu e-mail e senha.</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4 flex items-center gap-3">

            <PasswordInputGroup
              label="Senha"
              id="password"
              placeholder="Digite sua nova senha"
              {...register("password")}
              required
              customClasses="w-full"
              icon={<KeyIcon className="size-5" />}
              error={errors.password?.message}
            />
          </div>
          <div className="mb-4 flex items-center gap-3">
            <PasswordInputGroup
              label="Repetir a Senha"
              id="repeatPassword"
              placeholder="Repita sua senha"
              {...register("repeatPassword")}
              required
              customClasses="w-full"
              icon={<KeyIcon className="size-5" />}
              error={errors.repeatPassword?.message}
            />
          </div>


          <div className="flex justify-end gap-3">
            <Button buttonText={isSubmitting ? "Criando..." : "Criar Senha"} isLoading={isSubmitting}  />
          </div>
        </form>
      </div>
    </div>
  );
}
