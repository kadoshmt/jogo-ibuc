"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import GenreSelectGroup from "@/components/SelectGroup/GenreSelectGroup";
import { UserIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import InputGroup from "@/components/InputGroup";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { FingerPrintIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { useProfile, useUpdateUserProfile } from "@/hooks/useProfile";
import { useAuthStore } from '@/stores/useAuthStore';
import Loader from "@/components/common/Loader";
import { Genre } from "@/types/profile";

const ProfilePageComponent = () => {
  const { data: userProfile, isLoading, isError } = useProfile();
  const user = useAuthStore((state) => state.user);
  const updateUserProfile = useUpdateUserProfile();

  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    username: '',
    country: '',
    region: '',
    city: '',
    phone: '',
  });

  // Atualizar o estado com os dados do perfil quando carregados
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        genre: userProfile.genre || Genre.NAO_INFORMADO,
        username: userProfile.username || '',
        country: userProfile.country || '',
        region: userProfile.region || '',
        city: userProfile.city || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    try {
      await updateUserProfile.mutateAsync(formData);
      // Mostrar mensagem de sucesso, se necessário
    } catch (error) {
      // Tratar erros, se necessário
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar o perfil do usuário</div>;
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Informações Pessoais
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                <InputGroup
                    label="Nome Completo"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Informe seu nome completo"
                    defaultValue={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<UserIcon className="size-5" />}

                  />

                  <GenreSelectGroup
                    customClasses="w-full sm:w-1/2"
                    selectedOption={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                   />

                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                <InputGroup
                    label="E-mail"
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user?.email}
                    disabled={true}
                    customClasses="w-full sm:w-1/2"
                    icon={<EnvelopeIcon className="size-5" />}
                  />


                  <InputGroup
                    label="Username"
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={formData.username}
                    disabled={true}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<FingerPrintIcon className="size-5" />}
                  />

                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                <InputGroup
                    label="País"
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Informe seu país"
                    defaultValue={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<GlobeAmericasIcon className="size-5" />}
                  />

                <InputGroup
                    label="Estado"
                    type="text"
                    name="region"
                    id="region"
                    placeholder="Informe seu estado"
                    defaultValue={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<MapIcon className="size-5" />}
                  />
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                  <InputGroup
                      label="Cidade"
                      type="text"
                      name="city"
                      id="city"
                      placeholder="Informe sua cidade"
                      defaultValue={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      customClasses="w-full sm:w-1/2"
                      icon={<MapPinIcon className="size-5" />}
                    />

                  <InputGroup
                      label="WhastApp"
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Ex: (99) 99999-9999"
                      defaultValue={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      customClasses="w-full sm:w-1/2"
                      icon={<PhoneIcon className="size-5" />}
                    />
                  </div>






                <div className="mb-5.5">
                </div>

                <div className="flex justify-end gap-3">
                  {/* <button
                    className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                    type="submit"
                  >
                    Cancelar
                  </button> */}
                  <button
                    className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="submit"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                          fill="#5750F1"
                        />
                        <path
                          d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                          fill="#5750F1"
                        />
                      </svg>
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
        </div>
      </div>
    </>
  );
};

export default ProfilePageComponent;
