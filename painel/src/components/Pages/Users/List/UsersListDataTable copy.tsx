'use client';
import { useUsers } from '@/hooks/useUsers';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';


export const UsersListDataTable: React.FC = () => {
  const [page, setPage] = useState(2);
  const perPage = 3;

  const { data, isLoading, isError, error } = useUsers({ page, perPage });

  if (isLoading) {
    return <div className="text-center mt-10">Carregando usuários...</div>;
  }

  if (isError) {
    return <div className="text-center mt-10 text-red-500">Erro: {error.message}</div>;
  }

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

  const generatePageNumbers = (meta: any) => {
    let pages = [];
    for (let i = 0; i <= meta.lastpage; i++) {
      pages.push(<button  key={i} className={`${meta.currentPage === i ? "bg-primary text-white":"false"} mx-1 flex cursor-pointer items-center justify-center rounded-[3px] p-1.5 px-[15px] font-medium hover:bg-primary hover:text-white`}>{i}</button>);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
   <section className="data-table-common rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-7.5 py-4.5">
         <div className="relative z-20 w-full max-w-[414px]">
            <input className="w-full rounded-[7px] border border-stroke bg-transparent px-5 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary" placeholder="Pesquisar..." type="text" />
            <button className="absolute right-0 top-0 flex h-11.5 w-11.5 items-center justify-center rounded-r-md bg-primary text-white">
               <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z" fill=""></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.958 11.957C12.2508 11.6641 12.7257 11.6641 13.0186 11.957L16.2811 15.2195C16.574 15.5124 16.574 15.9872 16.2811 16.2801C15.9882 16.573 15.5133 16.573 15.2205 16.2801L11.958 13.0176C11.6651 12.7247 11.6651 12.2499 11.958 11.957Z" fill=""></path>
               </svg>
            </button>
         </div>
         <div className="flex items-center font-medium">
            <p className="pl-2 font-medium text-dark dark:text-white">Por Páginas:</p>
            <select className="bg-transparent pl-2.5">
               <option value="5">5</option>
               <option value="10">10</option>
               <option value="20">20</option>
               <option value="50">50</option>
            </select>
         </div>
      </div>
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
                  <div className="mt-2.5 w-full"><input className="w-full rounded-md border border-stroke px-3 py-1 outline-none focus:border-primary" type="text" value="" /></div>
               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer">
                  <div className="flex items-center">
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
                  <div className="mt-2.5 w-full"><input className="w-full rounded-md border border-stroke px-3 py-1 outline-none focus:border-primary" type="text" value="" /></div>
               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer">
                  <div className="flex items-center">
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
                  <div className="mt-2.5 w-full"><input className="w-full rounded-md border border-stroke px-3 py-1 outline-none focus:border-primary" type="text" value="" /></div>
               </th>
               {/* <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer">
                  <div className="flex items-center">
                     <span> Gênero</span>
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
                  <div className="mt-2.5 w-full"><input className="w-full rounded-md border border-stroke px-3 py-1 outline-none focus:border-primary" type="text" value="" /></div>
               </th> */}
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer">
                  <div className="flex items-center">
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
                  <div className="mt-2.5 w-full"><input className="w-full rounded-md border border-stroke px-3 py-1 outline-none focus:border-primary" type="text" value="" /></div>
               </th>
               <th colSpan={1} role="columnheader" title="Toggle SortBy" className="cursor-pointer">
                  <div className="flex items-center">
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
                  <div className="mt-2.5 w-full"><input className="w-full rounded-md border border-stroke px-3 py-1 outline-none focus:border-primary" type="text" value=""/></div>
               </th>
            </tr>
         </thead>
         <tbody role="rowgroup">
          {data?.data.map((user) => (
            <tr key={user.id} className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">{user.profile.name}</td>
               <td role="cell">{user.email}</td>
               <td role="cell">{user.role}</td>
               {/* <td role="cell">{user.genre}</td> */}
               <td role="cell">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</td>
               <td role="cell">
                  <button className="hover:text-primary">
                    <EyeIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <PencilIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <TrashIcon className='size-5' />
                  </button>
               </td>
            </tr>
             ))}
            {/* <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Barney Murray</td>
               <td role="cell">Developer</td>
               <td role="cell">25 Nov, 1966</td>
               <td role="cell">Barney@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Part-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Ressie Ruecker</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1955</td>
               <td role="cell">Ressie@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Full-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Teresa Mertz</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1979</td>
               <td role="cell">Teresa@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Part-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Chelsey Hackett</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1969</td>
               <td role="cell">Chelsey@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Full-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Tatyana Metz</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1989</td>
               <td role="cell">Tatyana@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Part-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Oleta Harvey</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1979</td>
               <td role="cell">Oleta@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Full-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Bette Haag</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1979</td>
               <td role="cell">Bette@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Part-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Meda Ebert</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 1945</td>
               <td role="cell">Meda@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Full-time</td>
            </tr>
            <tr className="border-t border-stroke dark:border-dark-3" role="row">
               <td role="cell">Elissa Stroman</td>
               <td role="cell">Designer</td>
               <td role="cell">25 Nov, 2000</td>
               <td role="cell">Elissa@gmail.com</td>
               <td role="cell">Block A, Demo Park</td>
               <td role="cell">Part-time</td>
            </tr> */}
         </tbody>
      </table>
      <div className="flex justify-between px-7.5 py-7">
         <div className="flex items-center">
          {data?.meta.prev && (
            <button className="flex cursor-pointer items-center justify-center rounded-[3px] p-[7px] px-[7px] hover:bg-primary hover:text-white" disabled>
               <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1777 16.1158C12.009 16.1158 11.8402 16.0596 11.7277 15.9189L5.37148 9.45019C5.11836 9.19707 5.11836 8.80332 5.37148 8.5502L11.7277 2.08145C11.9809 1.82832 12.3746 1.82832 12.6277 2.08145C12.8809 2.33457 12.8809 2.72832 12.6277 2.98145L6.72148 9.0002L12.6559 15.0189C12.909 15.2721 12.909 15.6658 12.6559 15.9189C12.4871 16.0314 12.3465 16.1158 12.1777 16.1158Z" fill=""></path>
               </svg>
            </button>
          )}
          {generatePageNumbers(data?.meta)}
            {/* <button className="bg-primary text-white mx-1 flex cursor-pointer items-center justify-center rounded-[3px] p-1.5 px-[15px] font-medium hover:bg-primary hover:text-white">1</button>
            <button className="false mx-1 flex cursor-pointer items-center justify-center rounded-[3px] p-1.5 px-[15px] font-medium hover:bg-primary hover:text-white">2</button>
            <button className="false mx-1 flex cursor-pointer items-center justify-center rounded-[3px] p-1.5 px-[15px] font-medium hover:bg-primary hover:text-white">3</button> */}
          {data?.meta.next && (
            <button className="flex cursor-pointer items-center justify-center rounded-[3px] p-[7px] px-[7px] hover:bg-primary hover:text-white">
               <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.82148 16.1158C5.65273 16.1158 5.51211 16.0596 5.37148 15.9471C5.11836 15.6939 5.11836 15.3002 5.37148 15.0471L11.2777 9.0002L5.37148 2.98145C5.11836 2.72832 5.11836 2.33457 5.37148 2.08145C5.62461 1.82832 6.01836 1.82832 6.27148 2.08145L12.6277 8.5502C12.8809 8.80332 12.8809 9.19707 12.6277 9.45019L6.27148 15.9189C6.15898 16.0314 5.99023 16.1158 5.82148 16.1158Z" fill=""></path>
               </svg>
            </button>
          )}
         </div>
         <p className="font-medium">Mostrando página {data?.meta.currentPage} de {data?.meta.lastPage}</p>
      </div>
   </section>

</div>

  );
};
