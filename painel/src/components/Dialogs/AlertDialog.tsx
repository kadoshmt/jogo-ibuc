import React from 'react';
import Modal from '@/components/Modal';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';

type AlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  type: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  children: React.ReactNode;
  showIcon?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirm?: () => void;
  hideCancelButton?: boolean;
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  type,
  title,
  children,
  showIcon = true,
  cancelButtonText = 'Cancelar',
  confirmButtonText = 'Confirmar',
  onConfirm,
  hideCancelButton = false,
}) => {
  // Definir cores e ícones com base no tipo de alerta
  let icon;
  let colorClasses;

  switch (type) {
    case 'error':
      icon = <ExclamationCircleIcon className="w-8 h-8 text-red-600" />;
      colorClasses = 'bg-red-600 text-red-600';
      break;
    case 'warning':
      icon = <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />;
      colorClasses = 'bg-yellow-500 text-yellow-500';
      break;
    case 'success':
      icon = <CheckCircleIcon className="w-8 h-8 text-green-600" />;
      colorClasses = 'bg-green-600 text-green-600';
      break;
    case 'info':
      icon = <InformationCircleIcon className="w-8 h-8 text-primary" />;
      colorClasses = 'bg-blue-600 text-blue-600';
      break;
    default:
      icon = null;
      colorClasses = '';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} widthClass="max-w-[550px]" hideFooter hideHeader>
    <div className="w-full px-8 py-12 text-center">
      {showIcon && (
        <div
          className={`mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-opacity-10 ${colorClasses}`}
        >
          {icon}
        </div>
      )}
      {title && (
        <h3 className="mt-5.5 pb-2 text-xl font-bold text-dark dark:text-white sm:text-2xl">
          {title}
        </h3>
      )}
      <div className="mb-10 font-medium text-gray-600 dark:text-gray-300">
        {children}
      </div>
      <div className="-mx-2.5 flex flex-wrap gap-y-4">
        {!hideCancelButton && (
          <div className="w-full px-2.5 sm:w-1/2">
            <button
              className="block w-full rounded-[7px] border border-gray-300 bg-gray-100 p-3 text-center font-medium text-dark hover:bg-gray-200"
              onClick={onClose}
              aria-label={cancelButtonText}
            >
              {cancelButtonText}
            </button>
          </div>
        )}
        <div className="w-full px-2.5 sm:w-1/2">
          <button
            className={`block w-full rounded-[7px] p-3 text-center font-medium text-white ${
              type === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : type === 'warning'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : type === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={onConfirm}
            aria-label={confirmButtonText}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  </Modal>
  );
};

export default AlertDialog;
