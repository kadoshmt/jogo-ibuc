"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { changePasswordSchema } from "@/validations/profile/changePasswordSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastStore } from "@/stores/toastStore";
import { useChangePassword } from "@/hooks/useProfile";
import PasswordInputGroup from "@/components/FormElements/PasswordInput";
import { KeyIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Buttons/Button";

type ChangePasswordFormData  = z.infer<typeof changePasswordSchema>;

export const ProfileChangePasswordForm = () => {

  const addToast = useToastStore((state) => state.addToast);
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    try {

      // Chamada à API para alterar a senha
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });


      // Reseta o formulário após o sucesso
      reset();

      addToast({
        type: 'success',
        title: 'Senha alterada com sucesso',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Ocorreu um erro ao alterar a senha',
        // message: `Ocorreu um erro ao alterar a senha. Por favor, tente novamente.`,
        messageList: [`Erro: ${error.message}`]
      });
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          Alterar Senha
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4 flex items-center gap-3">
            <PasswordInputGroup
              label="Senha Atual"
              id="currentPassword"
              placeholder="Digite sua senha atual"
              {...register("currentPassword")}
              required
              customClasses="w-full"
              icon={<KeyIcon className="size-5" />}
              error={errors.currentPassword?.message}
            />
          </div>
          <div className="mb-4 flex items-center gap-3">

            <PasswordInputGroup
              label="Nova Senha"
              // type={showCurrentPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Digite sua nova senha"
              {...register("newPassword")}
              required
              customClasses="w-full"
              icon={<KeyIcon className="size-5" />}
              error={errors.newPassword?.message}
            />
          </div>
          <div className="mb-4 flex items-center gap-3">
            <PasswordInputGroup
              label="Repetir Nova Senha"
              id="repeatNewPassword"
              placeholder="Repita sua nova senha"
              {...register("repeatNewPassword")}
              required
              customClasses="w-full"
              icon={<KeyIcon className="size-5" />}
              error={errors.repeatNewPassword?.message}
            />
          </div>



          <div className="flex justify-end gap-3">
            <Button buttonText={isSubmitting ? "Alterando..." : "Alterar Senha"} isLoading={isSubmitting}  />
          </div>
        </form>
      </div>
    </div>
  );
}
