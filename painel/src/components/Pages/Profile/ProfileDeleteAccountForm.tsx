"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAccountSchema, DeleteAccountFormData } from "@/validations/profile/deleteAccountSchema";
import { useDeleteAccount } from "@/hooks/useProfile";
import { useToastStore } from "@/stores/toastStore";
import InputGroup from "@/components/FormElements/InputGroup";
import { TrashIcon } from "@heroicons/react/24/outline";

export const ProfileDeleteAccountForm = () => {

  const deleteAccountMutation = useDeleteAccount();
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<DeleteAccountFormData> = async (data) => {
    try {
      if (window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.")) {
        await deleteAccountMutation.mutateAsync(data);
      }
      addToast({
        type: 'success',
        title: 'Conta excluída com sucesso!',
        message: 'Todos os seus dados pessoais foram removidos da nossa base de dados permanentemente.',
      });
      reset();
    } catch (error: any) {
      console.error("Erro ao excluir a conta:", error);
      addToast({
        type: 'error',
        title: 'Ocorreu um erro ao excluir a conta.',
      });
      reset();
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-red dark:text-red-700">
            Apagar sua conta
          </h3>
        </div>
        <div className="p-7 space-y-6">
        <div className="space-y-3">
          <p className="text-justify">Ao apagar sua conta, todos os seus dados serão removidos da nossa base de dados permanentemente.</p>
          <p className="text-justify">Apenas os dados essenciais para o funcionamento do jogo, como as perguntas cadastradas por você, serão mantidas e transferidas para outro administrador.</p>
        </div>

        <InputGroup
                label='Para confirmar a exclusão, digite "EXCLUIR" abaixo:'
                type="text"
                id="confirm"
                placeholder='Digite "EXCLUIR" para confirmar'
                {...register("confirm")}
                required
                customClasses="w-full"
                icon={<TrashIcon className="size-5" />}
                error={errors.confirm?.message}
              />


        <div className="flex justify-end gap-3">
          <button
            className="flex items-center justify-center rounded-[7px] bg-red px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Excluindo..." : "Excluir minha Conta"}
          </button>
        </div>

      </div>
      </form>
    </div>
  );
}
