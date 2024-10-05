'use client';
import Loader from '@/components/common/Loader';
import { useUsers } from '@/hooks/useUsers';
import loaderStore from '@/stores/loaderStore';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { User as IUser } from '@/types/user';
import { useModalStore } from '@/stores/modalStore';
import UserDetails from '../UserDetails';
import DeleteUserModal from '../DeleteUserModal';
import { useAuthStore } from '@/stores/useAuthStore';

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

type User = IUser & { id: string };


export const UsersListDataTable: React.FC = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(5);
  const { data, isLoading, isError, error } = useUsers({ page, perPage });

  const loggedUser = useAuthStore((state) => state.user);

  const { setLoader, isLoaderActive } = loaderStore();
  useEffect(() => { setLoader(false); }, [setLoader]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal, closeModal } = useModalStore();

//   const handleViewUser = (user: User) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };


  const handleViewUser = (user: User) => {

   openModal('custom', {
     title: 'Detalhes do Usuário',
     widthClass: 'max-w-lg',
     hideFooter: true,
     children: (<UserDetails user={user} /> ),
   });
 };

//  const handleDeleteUser = (userId: string) => {
//    openModal('alert', {
//      type: 'error',
//      title: 'Confirmar Exclusão',
//      children: (
//      <p>Tem certeza que deseja excluir este usuário {userId}?</p>
//      ),
//      confirmButtonText: 'Excluir',
//      onConfirm: () => {
//        // Lógica para excluir o usuário
//        closeModal();
//      },
//    });
//  };

const handleDeleteUser = (user: User) => {
   openModal('custom', {
     title: 'Apagar Usuário',
     widthClass: 'max-w-lg',
     hideFooter: true,
     children: (
       <DeleteUserModal
         userIdToDelete={user.id}
         userNameToDelete={user.profile?.name || user.email}
         onSuccess={() => {
           // Ações após deletar o usuário
           closeModal();
         }}
       />
     ),
   });
 };

//  const handleDeleteUser = (userId: string) => {
//    openModal('confirm', {
//      title: 'Confirmar Exclusão',
//      children: (
//      <p>Tem certeza que deseja excluir este usuário {userId}?</p>
//      ),
//      //confirmButtonText: 'Excluir',
//      onConfirm: () => {
//        // Lógica para excluir o usuário
//        closeModal();
//      },
//    });
//  };


  if (isLoading || isLoaderActive()) {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-center mt-10 text-red-500">Erro: {error.message}</div>;
  }

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    setPerPage(newPerPage);
    setPage(1);
  };


  const handlePrevPage = () => {
    if (data?.meta.prev) {
      setPage(data.meta.prev);
    }
  };

  const handleNextPage = () => {
    if (data?.meta.next) {
      setPage(data.meta.next);
    }
  };



  const handlePageNumbers = (meta: Meta | undefined) => {
    if (!meta) return null;

    let pages = [];
    for (let i = 1; i <= meta.lastPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`mx-1 flex cursor-pointer items-center justify-center rounded-[3px] p-1.5 px-[15px] font-medium ${
            meta.currentPage === i
              ? "bg-primary text-white"
              : "bg-white text-primary" // Classes para páginas não ativas
          } hover:bg-primary hover:text-white`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

   const handleEdit = (id: string) => {
      setLoader(true);
      router.push(`/dashboard/users/edit/${id}`);
   };

   const handleCreate = () => {
      setLoader(true);
      router.push(`/dashboard/users/create`);
   };

  const handleRole = (role: string) => {

    let color = '';
    switch (role) {
      case "JOGADOR":
        color = 'bg-sky-500/[0.08] text-sky-500';
        break;
      case "PROFESSOR":
        color = 'bg-[#FFA70B]/[0.08] text-[#FFA70B]';
          break;
      case "COLABORADOR":
        color = 'bg-[#219653]/[0.08] text-[#219653]';
        break;
      case "ADMIN":
        color = 'bg-indigo-500/[0.08] text-indigo-500';
        break;
      default:
        color = 'bg-indigo-500/[0.08] text-indigo-500';
        break;
    }

    return (
      <p className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium capitalize ${color}`}>
        {role.toLowerCase()}
      </p>
    );
  };


  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
   <section className="data-table-common rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-7.5 py-4.5 gap-2">
         <div className="relative z-20 w-full max-w-[414px]">
            <input className="w-full rounded-[7px] border border-stroke bg-transparent px-5 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary" placeholder="Pesquisar..." type="text" />
            <button className="absolute right-0 top-0 flex h-11.5 w-11.5 items-center justify-center rounded-r-md bg-primary text-white">
               <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z" fill=""></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.958 11.957C12.2508 11.6641 12.7257 11.6641 13.0186 11.957L16.2811 15.2195C16.574 15.5124 16.574 15.9872 16.2811 16.2801C15.9882 16.573 15.5133 16.573 15.2205 16.2801L11.958 13.0176C11.6651 12.7247 11.6651 12.2499 11.958 11.957Z" fill=""></path>
               </svg>
            </button>
         </div>
         <div className="flex items-center font-medium">
         <button
              className="flex justify-center rounded-[7px] bg-green-500 px-4 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="button"
              onClick={()=> handleCreate()}
            >
              <div className="flex justify-start font-medium gap-1.5"><PlusIcon className='size-6' /> Criar</div>
            </button>
         </div>
      </div>
      {/* <p className="flex justify-end font-medium my-3 pr-5">Mostrando página {data?.meta.currentPage} de {data?.meta.lastPage}</p> */}
      <table role="table" className="datatable-table datatable-one w-full table-auto !border-collapse overflow-hidden break-words px-4 md:table-fixed md:overflow-auto md:px-8">
         <thead className="border-separate px-4">
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer">
                  <div className="flex items-center">
                     <span> Nome</span>
                     <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                           </svg>
                        </span>
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill=""></path>
                           </svg>
                        </span>
                     </div>
                  </div>
               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer hidden md:table-cell">
                  <div className="flex items-center justify-center">
                     <span> Email</span>
                     <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                           </svg>
                        </span>
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill=""></path>
                           </svg>
                        </span>
                     </div>
                  </div>

               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer hidden sm:table-cell">
                  <div className="flex items-center justify-center">
                     <span> Perfil</span>
                     <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                           </svg>
                        </span>
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill=""></path>
                           </svg>
                        </span>
                     </div>
                  </div>

               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer hidden lg:table-cell">
                  <div className="flex items-center justify-center">
                     <span> Criado Em</span>
                     <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                           </svg>
                        </span>
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill=""></path>
                           </svg>
                        </span>
                     </div>
                  </div>

               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer ">
                  <div className="flex items-center justify-center">
                     <span> Ações</span>
                     <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                           </svg>
                        </span>
                        <span className="inline-block">
                           <svg className="fill-current" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill=""></path>
                           </svg>
                        </span>
                     </div>
                  </div>
               </th>
            </tr>
         </thead>
         <tbody role="rowgroup">
          {data?.data.map((user) => (
            <tr key={user.id} className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">
                  <div className="flex items-center justify-start space-x-2">
                  <span className="inline-block">
                     <Image alt={`Imagem de ${user.profile.name}`} loading="lazy" width={"36"} height={"36"} decoding="async"  className="overflow-hidden rounded-full border-2 border-primary" src={user?.profile.avatarUrl || "/images/default-avatar.png"} />
                  </span>
                  <span className="inline-block">{user.profile.name}</span>
                  </div>
               </td>
               <td role="cell" className='text-center hidden md:table-cell'>{user.email}</td>
               <td role="cell" className='text-center hidden sm:table-cell'>{handleRole(user.role)}</td>
               {/* <td role="cell">{user.genre}</td> */}
               <td role="cell" className='text-center hidden lg:table-cell'>{user.createdAt ? new Date(user.createdAt).toLocaleString("pt-BR",  { dateStyle: 'medium' }) : "N/A"}</td>
               <td role="cell" className='text-center'>
                <div className="flex items-center justify-center space-x-4">
                    <button className="hover:text-primary" onClick={() => handleViewUser(user)}>
                      <EyeIcon className='size-5' />
                    </button>
                    {loggedUser?.role === 'ADMIN' && (
                      <>
                        <button className="hover:text-primary" onClick={() => handleEdit(user.id)}>
                           <PencilIcon className='size-5' />
                        </button>
                        <button className="hover:text-primary" onClick={() => handleDeleteUser(user)}>
                           <TrashIcon className='size-5' />
                        </button>
                      </>
                    )}

                  </div>
               </td>
            </tr>
             ))}

         </tbody>
      </table>
      <div className="flex justify-between px-7.5 py-7">
         <div className="flex items-center">
          {data?.meta.prev && (
            <button onClick={handlePrevPage} className="flex cursor-pointer items-center justify-center rounded-[3px] p-[7px] px-[7px] hover:bg-primary hover:text-white text-">
               <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1777 16.1158C12.009 16.1158 11.8402 16.0596 11.7277 15.9189L5.37148 9.45019C5.11836 9.19707 5.11836 8.80332 5.37148 8.5502L11.7277 2.08145C11.9809 1.82832 12.3746 1.82832 12.6277 2.08145C12.8809 2.33457 12.8809 2.72832 12.6277 2.98145L6.72148 9.0002L12.6559 15.0189C12.909 15.2721 12.909 15.6658 12.6559 15.9189C12.4871 16.0314 12.3465 16.1158 12.1777 16.1158Z" fill=""></path>
               </svg>
            </button>
          )}
          {handlePageNumbers(data?.meta)}
          {data?.meta.next && (
            <button onClick={handleNextPage} className="flex cursor-pointer items-center justify-center rounded-[3px] p-[7px] px-[7px] hover:bg-primary hover:text-white">
               <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.82148 16.1158C5.65273 16.1158 5.51211 16.0596 5.37148 15.9471C5.11836 15.6939 5.11836 15.3002 5.37148 15.0471L11.2777 9.0002L5.37148 2.98145C5.11836 2.72832 5.11836 2.33457 5.37148 2.08145C5.62461 1.82832 6.01836 1.82832 6.27148 2.08145L12.6277 8.5502C12.8809 8.80332 12.8809 9.19707 12.6277 9.45019L6.27148 15.9189C6.15898 16.0314 5.99023 16.1158 5.82148 16.1158Z" fill=""></path>
               </svg>
            </button>
          )}
         </div>
         <div className="flex items-center font-medium">
            <p className="px-2 font-medium text-dark dark:text-white">Registros por Páginas: </p>
            <select
              className="bg-transparent pl-3.5 rounded-md border border-stroke px-3 py-1.5 outline-none focus:border-primary"
              value={perPage}
              onChange={handlePerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
         </div>

      </div>
   </section>
   {/* {selectedUser && (
        <UserDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )} */}
</div>


  );
};
