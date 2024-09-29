"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CakeIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { useProfile, useUpdateUserProfile } from "@/hooks/useProfile";
import { useAuthStore } from '@/stores/useAuthStore';
import InputGroup from "@/components/FormElements/InputGroup";
import { useToastStore } from "@/stores/toastStore";
import SelectGroup from "@/components/FormElements/SelectGroup";

const ProfilePageComponent = () => {
  const { data: userProfile, isLoading, isError } = useProfile();
  const user = useAuthStore((state) => state.user);
  const updateUserProfile = useUpdateUserProfile();
  const addToast = useToastStore((state) => state.addToast);
  interface Genre {
    value: string;
    name: string;
  }

  const genreOptions: Genre[] = [
    { value: "MASCULINO", name: "Masculino" },
    { value: "FEMININO", name: "Feminino" },
    { value: "NAO_INFORMADO", name: "Não Informado" },
  ];


  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    username: '',
    country: '',
    region: '',
    city: '',
    phone: '',
    birthDate: '',
  });

  // Atualizar o estado com os dados do perfil quando carregados
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        genre: userProfile.genre,
        username: userProfile.username || '',
        country: userProfile.country || '',
        region: userProfile.region || '',
        city: userProfile.city || '',
        phone: userProfile.phone || '',
        birthDate: userProfile.birthDate || '',
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserProfile.mutateAsync(formData);

      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        message: 'Suas informações pessoais foram atualizadas com sucesso.',
      });
    } catch (error) {
      // Tratar erros, se necessário
      addToast({
        type: 'error',
        title: 'Erro ao tentar atualizar o seu perfil',
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError) {
    addToast({
      type: 'error',
      title: 'Erro ao carregar os dados so seu perfil.',
    });
    return <div>Erro ao carregar seus dados</div>;
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-8">
        {/* Container Informações Pessoais */}
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
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<UserIcon className="size-5" />}
                  />

                <SelectGroup
                  label="Sexo"
                  options={genreOptions}
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.value}
                  icon={<UsersIcon className="size-5" />}
                />

                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                <InputGroup
                    label="E-mail"
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user?.email}
                    required
                    disabled
                    customClasses="w-full sm:w-1/2"
                    icon={<EnvelopeIcon className="size-5" />}
                  />


                  {/* <InputGroup
                    label="Username"
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={formData.username}
                    required
                    disabled
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<FingerPrintIcon className="size-5" />}
                  /> */}

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
                    label="Data de Nascimento"
                    type="text"
                    name="birthDate"
                    id="birthDate"
                    defaultValue={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    customClasses="w-full sm:w-1/2"
                    icon={<CakeIcon className="size-5" />}
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

        {/* Container sua foto */}
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
        </div>

      </div>
    </>
  );
};

export default ProfilePageComponent;
