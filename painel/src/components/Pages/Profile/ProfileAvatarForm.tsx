"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { useForm, Controller, FieldError  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avatarSchema, AvatarFormData } from "@/validations/profile/avatarSchema";
import { useUpdateAvatar } from "@/hooks/useProfile";
import { useToastStore } from "@/stores/toastStore";
import Button from "@/components/Buttons/Button";

export const ProfileAvatarForm = () => {
  const user = useAuthStore((state) => state.user);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.avatarUrl || "/images/default-avatar.png"
  );
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AvatarFormData>({
    resolver: zodResolver(avatarSchema),
  });

  const updateAvatar = useUpdateAvatar();
  const { isPending } = useUpdateAvatar();

  const onSubmit = async (data: AvatarFormData) => {
    try {
      const formData = new FormData();
      formData.append("profileAvatar", data.profileAvatar[0]); // O backend espera o campo 'image'

      const response = await updateAvatar.mutateAsync(formData);

      // Atualiza a visualização com o novo avatarUrl retornado pelo backend
      setPreviewUrl(response.avatarUrl);

      // Reseta o formulário
      reset();

      addToast({
        type: "success",
        title: "Avatar atualizado com sucesso",
      });
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Erro ao atualizar o avatar",
        messageList: [error.message],
      });
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">Sua Foto</h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-14 w-14 rounded-full">
              <Image
                src={previewUrl}
                width={55}
                height={55}
                alt="User"
                className="overflow-hidden rounded-full"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div>
              <span className="mb-1.5 font-medium text-dark dark:text-white">
                Editar sua foto
              </span>
              {/* <span className="flex gap-3">
                <button
                  type="button"
                  className="text-body-sm hover:text-red"
                  onClick={() => {
                    // Lógica para apagar o avatar
                    setPreviewUrl("/images/user/user-03.png");
                  }}
                >
                  Apagar
                </button>
                <button
                  type="button"
                  className="text-body-sm hover:text-primary"
                  onClick={() => {
                    document.getElementById("profilePhoto")?.click();
                  }}
                >
                  Atualizar
                </button>
              </span> */}
            </div>
          </div>

          <div
            id="FileUpload"
            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5"
          >
            <Controller
              name="profileAvatar"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <input
                  type="file"
                  name="profileAvatar"
                  id="profileAvatar"
                  accept="image/png, image/jpg, image/jpeg, , image/webp"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              )}
            />
            <div className="flex flex-col items-center justify-center">
              <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                <Image
                  src={"/images/icon/icon-upload-file.svg"}
                  width={20}
                  height={20}
                  alt="seta para baixo"
                />
              </span>
              <p className="mt-2.5 text-body-sm font-medium">
                <span className="text-primary">Clique para selecionar</span> ou
                arraste e solte aqui
              </p>
              <p className="mt-1 text-body-xs">PNG, JPG ou GIF (máx. 800 x 800px)</p>
            </div>
          </div>
          {errors.profileAvatar && (
            <p className="text-red-500">
              {errors.profileAvatar.message && String(errors.profileAvatar.message)}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button buttonText="Cancelar"
              type="button"
              color="white"
              onClick={() => {
                reset();
                setPreviewUrl(user?.avatarUrl || "/images/default-avatar.png");
              }}
            />
            <Button buttonText={isSubmitting ? "Salvando..." : "Salvar"} isLoading={isSubmitting}  />
          </div>
        </form>
      </div>
    </div>
  );
};
