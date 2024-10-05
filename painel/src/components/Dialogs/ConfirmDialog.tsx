
import React from 'react';
import Modal from '@/components/Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  showIcon?: boolean;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title = 'Confirmar Ação',
  children,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  onConfirm,
  showIcon = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      widthClass="max-w-md"
      hideHeader // Ocultamos o header
      hideFooter
    >
      <div className="text-center p-6">
        {showIcon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
          </div>
        )}
        {title && (
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        <div className="mb-5 text-sm text-gray-500 dark:text-gray-300">
          {children}
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-600"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
