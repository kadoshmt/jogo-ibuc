'use client';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const UsersListTable = () => {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Package
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Invoice date
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5">
                <h5 className="text-dark dark:text-white">Free package</h5>
                <p className="mt-[3px] text-body-sm font-medium">$0</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="text-dark dark:text-white">Jan 13,2023</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="inline-flex rounded-full bg-[#219653]/[0.08] px-3.5 py-1 text-body-sm font-medium text-[#219653]">
                  Paid
                </p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                <div className="flex items-center justify-end space-x-3.5">
                  <button className="hover:text-primary">
                    <EyeIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <PencilIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <TrashIcon className='size-5' />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5">
                <h5 className="text-dark dark:text-white">Standard Package</h5>
                <p className="mt-[3px] text-body-sm font-medium">$59</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="text-dark dark:text-white">Jan 13,2023</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="inline-flex rounded-full bg-[#219653]/[0.08] px-3.5 py-1 text-body-sm font-medium text-[#219653]">
                  Paid
                </p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                <div className="flex items-center justify-end space-x-3.5">
                <button className="hover:text-primary">
                    <EyeIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <PencilIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <TrashIcon className='size-5' />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5">
                <h5 className="text-dark dark:text-white">Business Package</h5>
                <p className="mt-[3px] text-body-sm font-medium">$99</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="text-dark dark:text-white">Jan 13,2023</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="inline-flex rounded-full bg-[#D34053]/[0.08] px-3.5 py-1 text-body-sm font-medium text-[#D34053]">
                  Unpaid
                </p>
              </td>
              <td className="border-b border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                <div className="flex items-center justify-end space-x-3.5">
                <button className="hover:text-primary">
                    <EyeIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <PencilIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <TrashIcon className='size-5' />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border-b-0 border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5">
                <h5 className="text-dark dark:text-white">Standard Package</h5>
                <p className="mt-[3px] text-body-sm font-medium">$59</p>
              </td>
              <td className="border-b-0 border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="text-dark dark:text-white">Jan 13,2023</p>
              </td>
              <td className="border-b-0 border-[#eee] px-4 py-4 dark:border-dark-3">
                <p className="inline-flex rounded-full bg-[#FFA70B]/[0.08] px-3.5 py-1 text-body-sm font-medium text-[#FFA70B]">
                  Pending
                </p>
              </td>
              <td className="border-b-0 border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                <div className="flex items-center justify-end space-x-3.5">
                <button className="hover:text-primary">
                    <EyeIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <PencilIcon className='size-5' />
                  </button>
                  <button className="hover:text-primary">
                    <TrashIcon className='size-5' />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
