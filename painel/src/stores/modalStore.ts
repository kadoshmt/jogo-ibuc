import { create } from 'zustand';

type ModalType = 'alert' | 'confirm' | 'custom';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalProps: any; // Props que serão passadas para o modal
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  modalProps: {},
  openModal: (type, props = {}) =>
    set({
      isOpen: true,
      modalType: type,
      modalProps: props,
    }),
  closeModal: () => set({ isOpen: false, modalType: null, modalProps: {} }),
}));
