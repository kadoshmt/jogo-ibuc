// components/SelectAdminModal.tsx
import React, { useState, useEffect, Children } from 'react';
import Modal from '@/components/Modal';
import { useDeleteUser, useAllAdminUsers } from '@/hooks/useUsers'; // Supondo que você tenha esse hook
import { AdminUser } from '@/validations/users/adminUsersSchema';
import { useModalStore } from '@/stores/modalStore';
import SelectGroup from '@/components/FormElements/SelectGroup';
import { UsersIcon } from '@heroicons/react/24/outline';
import { string } from 'zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/toastStore';
import RadioGroup from '@/components/FormElements/RadioGroup';

type DeleteUserModalProps = {
  userIdToDelete: string;
  userNameToDelete: string;
  onSuccess: () => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  userIdToDelete,
  userNameToDelete,
  onSuccess,
}) => {
  const { closeModal } = useModalStore();
  const [selectedAdminId, setSelectedAdminId] = useState<string>();
  const [selectedRadio, setSelectedRadio] = useState<boolean>(false);
  const [confirmError, setconfirmError] = useState<string>("");
  const { mutate: deleteUser, isPending, isError, error  } = useDeleteUser();
  // const { data: admins, isLoading: isAdminsLoading } = useAllAdminUsers();
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);





  const handleConfirm = () => {
    if (!selectedRadio){
      setconfirmError("Você deve marcar a opção SIM. ");
      return null;
    }
    setconfirmError("");
    if (selectedRadio && user && user.role === "ADMIN") {

      deleteUser(
        { userId: userIdToDelete, transferUserId: user.id },
        {
          onSuccess: () => {
            // Sucesso ao deletar
            addToast({
              type: 'success',
              title: `Usuário ${userNameToDelete} apagado com Sucesso!`,
            });
            onSuccess();
          },
          onError: (error) => {
            // Tratar erro
            addToast({
              type: 'error',
              title: `Erro ao Cadastrar Usuário`,
              message: `Erro ao tentar apagar o usuário ${userNameToDelete}: ${error.message}`,
            });
            closeModal();
          },
        }
      );

    } else {
      setconfirmError("Essa ação só pode ser realizada por um Administrador.");
    }

  };

  // if (isAdminsLoading) {
  //   return <p>Carregando administradores...</p>;
  // }


  return (
    <div>
      <p className='mb-4'>Deseja realmente apagar o usuário <strong className='text-red'>{userNameToDelete}</strong>, e todas as suas informações permanentemente?
        As informações por ele cadastradas, como por exemplo as perguntas, serão transferidas para você.</p>
        <RadioGroup< { value: boolean; text: string; }, boolean>
              options={[
                { value: true,
                  text:"SIM, desejo excluir o usuário"
                }
                ]}
              value={selectedRadio}
              onChange={setSelectedRadio}
              name="confirmar"
              label=""
              getOptionLabel={(option) => option.text}
              getOptionValue={(option) => option.value}
              required
            />

            <p className={`text-red text-sm flex justify-start mt-4  ${confirmError !== "" ? "" : "hidden"}`}>*{confirmError}</p>

      {/* <ul className="my-4 max-h-60 overflow-auto">
        {admins?.map((admin: AdminUser) => (
          <li key={admin.id} className="flex items-center mb-2">
            <input
              type="radio"
              id={`admin-${admin.id}`}
              name="selectedAdmin"
              value={admin.id}
              checked={selectedAdminId === admin.id}
              onChange={() => setSelectedAdminId(admin.id)}
              className="mr-2"
            />
            <label htmlFor={`admin-${admin.id}`}>{admin.name}</label>
          </li>
        ))}
      </ul> */}
      {/* { admins && (
        <SelectGroup
          label=""
          options={admins}
          value={selectedAdminId}
          onChange={(e) => setSelectedAdminId(e.target.value)}
          required
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          icon={<UsersIcon className="size-5" />}
        />
      )} */}

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? 'Apagar...' : 'Apagar'}
        </button>
      </div>
    </div>
  );
};

export default DeleteUserModal;
