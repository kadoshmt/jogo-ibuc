"use client";
import React, { useEffect } from "react";
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
import Loader from "@/components/common/Loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/validations/profile/profileSchema";
import { z } from "zod";
import { genreOptions } from "@/types/profile";
import Button from "@/components/Buttons/Button";

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileDataForm = () => {

  const { data: userProfile, isLoading, isError } = useProfile();
  const loggedUser = useAuthStore((state) => state.user);
  const updateUserProfile = useUpdateUserProfile();
  const addToast = useToastStore((state) => state.addToast);


  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      genre: 'NAO_INFORMADO',
      username: '',
      country: '',
      region: '',
      city: '',
      phone: '',
      birthDate: '',
    },
  });

  // Atualizar o estado com os dados do perfil quando carregados
  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name || '',
        genre: userProfile.genre || 'NAO_INFORMADO',
        username: userProfile.username || '',
        country: userProfile.country || '',
        region: userProfile.region || '',
        city: userProfile.city || '',
        phone: userProfile.phone || '',
        birthDate: userProfile.birthDate || '',
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUserProfile.mutateAsync(data);
      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        message: 'Suas informações pessoais foram atualizadas com sucesso.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erro ao tentar atualizar o seu perfil',
      });
    }
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (isError) {
    addToast({
      type: 'error',
      title: 'Erro ao carregar os dados so seu perfil.',
    });
    return <div>Erro ao carregar seus dados</div>;
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            Informações Pessoais
          </h3>
        </div>
        <div className="p-7">

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

            <InputGroup
                label="Nome Completo"
                type="text"
                id="name"
                placeholder="Informe seu nome completo"
                {...register("name")}
                required
                //onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                customClasses="w-full sm:w-1/2"
                icon={<UserIcon className="size-5" />}
                error={errors.name?.message}
              />

            <SelectGroup
              label="Sexo"
              options={genreOptions}
              {...register("genre")}
              //onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
              getOptionLabel={(option) => option.text}
              getOptionValue={(option) => option.value}
              icon={<UsersIcon className="size-5" />}
              error={errors.genre?.message}
            />

            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

            <InputGroup
                label="E-mail"
                type="email"
                name="email"
                id="email"
                defaultValue={loggedUser?.email}
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
                  id="phone"
                  placeholder="Ex: (99) 99999-9999"
                  {...register("phone")}
                  //onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  customClasses="w-full sm:w-1/2"
                  icon={<PhoneIcon className="size-5" />}
                  error={errors.phone?.message}
                />


            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

            <InputGroup
                label="País"
                type="text"
                id="country"
                placeholder="Informe seu país"
                {...register("country")}
                //onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                customClasses="w-full sm:w-1/2"
                icon={<GlobeAmericasIcon className="size-5" />}
                error={errors.country?.message}
              />

            <InputGroup
                label="Estado"
                type="text"
                id="region"
                placeholder="Informe seu estado"
                {...register("region")}
                //onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                customClasses="w-full sm:w-1/2"
                icon={<MapIcon className="size-5" />}
                error={errors.region?.message}
              />
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

              <InputGroup
                  label="Cidade"
                  type="text"
                  id="city"
                  placeholder="Informe sua cidade"
                  {...register("city")}
                  // onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  customClasses="w-full sm:w-1/2"
                  icon={<MapPinIcon className="size-5" />}
                  error={errors.city?.message}
                />


              <InputGroup
                label="Data de Nascimento"
                type="text"
                id="birthDate"
                {...register("birthDate")}
                // onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                customClasses="w-full sm:w-1/2"
                icon={<CakeIcon className="size-5" />}
                error={errors.birthDate?.message}
              />

              {/* <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Nascimento"
                      customClasses="w-full sm:w-1/2"
                      error={errors.birthDate?.message}
                      {...field}
                    />
                  )}
                /> */}

              </div>
            <div className="mb-5.5">
            </div>

            <div className="flex justify-end gap-3">
              <Button buttonText={isSubmitting ? "Salvando..." : "Salvar"} isLoading={isSubmitting}  />
            </div>
        </div>
      </form>
    </div>
  );
}
