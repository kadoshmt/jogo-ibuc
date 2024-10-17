'use client';
import React, { useEffect } from 'react';
import { CakeIcon, FingerPrintIcon, KeyIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { MapIcon } from '@heroicons/react/24/outline';
import { GlobeAmericasIcon } from '@heroicons/react/24/outline';
import InputGroup from '@/components/FormElements/InputGroup';
import { useToastStore } from '@/stores/toastStore';
import SelectGroup from '@/components/FormElements/SelectGroup';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreateUserSchema,
  CreateUserInput,
} from '@/validations/users/createUserSchema';
import { useCreateUser } from '@/hooks/useUsers';
import { Role, roleOptions } from '@/types/user';
import { Genre, genreOptions } from '@/types/profile';
import { useRouter } from 'next/navigation';
import PasswordInputGroup from '@/components/FormElements/PasswordInput';
import loaderStore from '@/stores/loaderStore';
import Button from '@/components/Buttons/Button';

type CreateUserFormData = z.infer<typeof CreateUserSchema>;

export const CreateUserForm = () => {
  const router = useRouter();
  const { mutateAsync: createUser } = useCreateUser();
  const addToast = useToastStore((state) => state.addToast);

  const { setLoader, isLoaderActive } = loaderStore();
  useEffect(() => { setLoader(false); }, [setLoader]);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting  },
    setValue,
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      username: '',
      role: Role.JOGADOR, // Valor padrão
      genre: Genre.NAO_INFORMADO, // Valor padrão
      googleId: '',
      country: 'Brasil',
      region: '',
      city: '',
      phone: '',
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

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await createUser(data);
      addToast({
        type: 'success',
        title: `Usuário Cadastrado com Sucesso!`,
        message: `O usuário ${data.name} foi cadastrado com sucesso!`,
      });
      router.push('/dashboard/users'); // Redireciona para a lista de usuários
    } catch (err: any) {
      console.error(err);
      addToast({
        type: 'error',
        title: `Erro ao Cadastrar Usuário`,
        message: `Erro ao tentar cadastrar o usuário ${data.name}: ${err.message}`,
      });
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            Informações do usuário
          </h3>
        </div>
        <div className="p-7">
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              label="Nome Completo"
              type="text"
              id="name"
              placeholder="Informe seu nome completo"
              {...register('name')}
              required
              customClasses="w-full sm:w-1/2"
              icon={<UserIcon className="size-5" />}
              error={errors.name?.message}
              disabled={isSubmitting}
            />

            <SelectGroup
              label="Sexo"
              options={genreOptions}
              {...register('genre')}
              required
              getOptionLabel={(option) => option.text}
              getOptionValue={(option) => option.value}
              icon={<UsersIcon className="size-5" />}
              error={errors.genre?.message}
              customClasses="w-full sm:w-1/2"
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              label="E-mail"
              type="email"
              id="email"
              placeholder="Informe seu e-mail"
              {...register('email')}
              required
              customClasses="w-full sm:w-1/2"
              icon={<EnvelopeIcon className="size-5" />}
              error={errors.email?.message}
              disabled={isSubmitting}
            />


            <PasswordInputGroup
              label="Senha"
              id="password"
              placeholder="Digite a senha do usuário"
              {...register("password")}
              required
              customClasses="w-full sm:w-1/2"
              icon={<KeyIcon className="size-5" />}
              error={errors.password?.message}
              disabled={isSubmitting}
            />

          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

            <InputGroup
                label="Username"
                type="text"
                id="username"
                {...register('username')}
                required
                readOnly
                customClasses="w-full sm:w-1/2"
                icon={<FingerPrintIcon className="size-5" />}
                error={errors.username?.message}
                disabled={isSubmitting}
            />

            <SelectGroup
              label="Perfil"
              options={roleOptions}
              {...register('role')}
              required
              getOptionLabel={(option) => option.text}
              getOptionValue={(option) => option.value}
              icon={<UserGroupIcon className="size-5" />}
              error={errors.role?.message}
              customClasses="w-full sm:w-1/2"
              disabled={isSubmitting}
            />

          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

          <InputGroup
              label="Cidade"
              type="text"
              id="city"
              placeholder="Informe sua cidade"
              {...register('city')}
              customClasses="w-full sm:w-1/2"
              icon={<MapPinIcon className="size-5" />}
              error={errors.city?.message}
              disabled={isSubmitting}
            />

          <InputGroup
              label="Estado"
              type="text"
              id="region"
              placeholder="Informe seu estado"
              {...register('region')}
              customClasses="w-full sm:w-1/2"
              icon={<MapIcon className="size-5" />}
              error={errors.region?.message}
              disabled={isSubmitting}
            />

          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

          <InputGroup
              label="País"
              type="text"
              id="country"
              placeholder="Informe seu país"
              {...register('country')}
              customClasses="w-full sm:w-1/2"
              icon={<GlobeAmericasIcon className="size-5" />}
              error={errors.country?.message}
              disabled={isSubmitting}
            />

          <InputGroup
              label="WhastApp"
              type="text"
              id="phone"
              placeholder="Ex: (99) 99999-9999"
              {...register("phone")}
              customClasses="w-full sm:w-1/2"
              icon={<PhoneIcon className="size-5" />}
              error={errors.phone?.message}
              disabled={isSubmitting}
            />
          </div>


          <div className="mb-5.5"></div>

          <div className="flex justify-end gap-3">
            {/* <button
              className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </button>
            <button
              className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button> */}
            <Button buttonText="Cancelar" type="button" color="white" onClick={() => router.back()} />
            <Button buttonText={isSubmitting ? "Criando..." : "Criar"} isLoading={isSubmitting}  />
          </div>
        </div>
      </form>
    </div>
  );
};
