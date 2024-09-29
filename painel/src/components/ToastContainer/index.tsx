'use client';

import React from 'react';
import { useToastStore, ToastPosition, ToastOptions } from '@/stores/toastStore';
import Toast from './Toast';
import "@/components/ToastContainer/styles.css";

const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  // Agrupar toasts por posição
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, ToastOptions[]>);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, toasts]) => (
        <div key={position} className={`toast-container ${position}`}>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      ))}
    </>
  );
};

export default ToastContainer;
