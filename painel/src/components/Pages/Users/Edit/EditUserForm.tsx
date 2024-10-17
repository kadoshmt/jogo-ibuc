'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateUserSchema, UpdateUserInput } from '@/validations/users/updateUserSchema';
import { useUpdateUser, useUserById } from '@/hooks/useUsers';
import { useToastStore } from '@/stores/toastStore';
import { useRouter  } from 'next/navigation';
import InputGroup from '@/components/FormElements/InputGroup';
import SelectGroup from '@/components/FormElements/SelectGroup';
import { Genre, genreOptions } from '@/types/profile';
import { Role, roleOptions } from '@/types/user';
import { ChatBubbleOvalLeftEllipsisIcon, FingerPrintIcon, GlobeAmericasIcon, MapIcon, MapPinIcon, PhoneIcon, UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Buttons/Button';
import Loader from '@/components/common/Loader';

type EditUserFormProps = {
  userId: string;
};

export const EditUserForm: React.FC<EditUserFormProps> = ({ userId }) => {
  const router = useRouter();
  const { mutateAsync: updateUser } = useUpdateUser();
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {},
  });

  // Usar o hook useUserById para obter os dados do usuário
  const { data: userData, isLoading: isUserLoading, isError: isUserError, error: userError } = useUserById(userId);

   // Preencher o formulário quando os dados do usuário estiverem disponíveis
   useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        username: userData.username || userData.email.split('@')[0] || '',
        genre: userData.genre as Genre|| Genre.NAO_INFORMADO,
        role: userData.role as Role|| Role.JOGADOR,
        country: userData.country || '',
        region: userData.region || '',
        city: userData.city || '',
        phone: userData.phone || '',
        birthDate: userData.birthDate || '',
        avatarUrl: userData.avatarUrl || '',
      });
    }
  }, [reset, userData]);

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser( { id: userId, data });
      addToast({
        type: 'success',
        title: `Usuário Atualizado com Sucesso!`,
        message: `O usuário ${data.name || userData?.name} foi atualizado com sucesso!`,
      });
      router.push('/dashboard/users'); // Redireciona para a lista de usuários
    } catch (err: any) {
      console.error(err);
      addToast({
        type: 'error',
        title: `Erro ao Atualizar Usuário`,
        message: `Erro ao tentar atualizar o usuário ${data.name || userData?.name}: ${err.message}`,
      });
    }
  };

  if (isUserError) {
    return <div className="text-red-500">Erro ao carregar usuário: {userError.message}</div>;
  }

  if (isUserLoading) {
    return <Loader />;
  }


  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">Dados do Usuário</h3>
        </div>
        <div className="p-7">
          {/* Campos do formulário */}
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

            {/* Campos ocultos */}
            <input type='hidden' id="email" {...register('email')} disabled />
            <input type='hidden' id="birthDate" {...register('birthDate')} disabled />
            {/* fim Campos ocultos */}

            <InputGroup
              label="Nome Completo"
              type="text"
              id="name"
              placeholder="Informe seu nome completo"
              {...register('name')}
              customClasses="w-full sm:w-1/2"
              error={errors.name?.message}
              icon={<UserIcon className="size-5" />}
            />

            <SelectGroup
              label="Sexo"
              options={genreOptions}
              {...register('genre')}
              getOptionLabel={(option) => option.text}
              getOptionValue={(option) => option.value}
              error={errors.genre?.message}
              customClasses="w-full sm:w-1/2"
              icon={<UsersIcon className="size-5" />}
            />


          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              label="Username"
              type="text"
              id="username"
              placeholder="Informe seu username"
              {...register('username')}
              customClasses="w-full sm:w-1/2"
              icon={<FingerPrintIcon className="size-5" />}
              error={errors.username?.message}
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
              error={errors.city?.message}
              icon={<MapPinIcon className="size-5" />}
            />

            <InputGroup
              label="Estado"
              type="text"
              id="region"
              placeholder="Informe seu estado"
              {...register('region')}
              customClasses="w-full sm:w-1/2"
              error={errors.region?.message}
              icon={<MapIcon className="size-5" />}
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
              error={errors.country?.message}
              icon={<GlobeAmericasIcon className="size-5" />}
            />

            <InputGroup
              label="Telefone"
              type="text"
              id="phone"
              placeholder="Ex: (99) 99999-9999"
              {...register('phone')}
              customClasses="w-full sm:w-1/2"
              error={errors.phone?.message}
              icon={<ChatBubbleOvalLeftEllipsisIcon className="size-5" />}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button buttonText="Cancelar" type="button" color="white" onClick={() => router.back()} />
            <Button buttonText={isSubmitting ? "Salvando..." : "Salvar"} isLoading={isSubmitting}  />
          </div>
        </div>
      </form>
    </div>
  );
};
