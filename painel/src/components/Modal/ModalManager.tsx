
import React from 'react';
import { useModalStore } from '@/stores/modalStore';
import AlertDialog from '@/components/Dialogs/AlertDialog';
import Modal from '@/components/Modal';
import ConfirmDialog from '../Dialogs/ConfirmDialog';

const ModalManager: React.FC = () => {
  const { isOpen, modalType, modalProps, closeModal } = useModalStore();

  if (!isOpen || !modalType) return null;

  const commonProps = {
    isOpen,
    onClose: closeModal,
    ...modalProps,
  };

  switch (modalType) {
    case 'alert':
      return <AlertDialog {...commonProps} />;
    case 'confirm':
      return <ConfirmDialog {...commonProps} />;
    case 'custom':
      return (
        <Modal {...commonProps}>
          {modalProps.children}
        </Modal>
      );
    default:
      return null;
  }
};

export default ModalManager;
