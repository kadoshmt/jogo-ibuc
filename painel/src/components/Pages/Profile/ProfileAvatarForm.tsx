"use client";
import React from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";

export const ProfileAvatarForm = () => {

  const user = useAuthStore((state) => state.user);

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Sua Foto
              </h3>
            </div>
            <div className="p-7">
              <form>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    <>
                      <Image
                        src={user?.avatarUrl || '/images/user/user-03.png'}
                        width={55}
                        height={55}
                        alt="User"
                        className="overflow-hidden rounded-full"
                      />
                    </>
                  </div>
                  <div>
                    <span className="mb-1.5 font-medium text-dark dark:text-white">
                      Editar sua foto
                    </span>
                    <span className="flex gap-3">
                      <button className="text-body-sm hover:text-red">
                        Apagar
                      </button>
                      <button className="text-body-sm hover:text-primary">
                        Atualizar
                      </button>
                    </span>
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5"
                >
                  <input
                    type="file"
                    name="profilePhoto"
                    id="profilePhoto"
                    accept="image/png, image/jpg, image/jpeg"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                    <Image src={"/images/icon/icon-upload-file.svg"} width={20} height={20} alt="seta para baixo" />
                    </span>
                    <p className="mt-2.5 text-body-sm font-medium">
                      <span className="text-primary">Clique para selecionar</span> ou
                      arraste e solte aqui
                    </p>
                    <p className="mt-1 text-body-xs">
                      PNG, JPG or GIF (max. 800 X 800px)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    type="submit"
                  >
                    Cancelar
                  </button>
                  <button
                    className="flex items-center justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="submit"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
  );
}
