import { create } from 'zustand';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastOptions {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  messageList?: string[];
  position?: ToastPosition;
  duration?: number;
}

export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastState {
  toasts: ToastOptions[];
  addToast: (options: Omit<ToastOptions, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (options) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...options, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
