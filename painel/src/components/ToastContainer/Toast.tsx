'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ToastOptions, useToastStore } from '@/stores/toastStore';
import { XMarkIcon } from '@heroicons/react/24/solid';


interface ToastProps {
  toast: ToastOptions;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const [exiting, setExiting] = useState(false);
  const defaultDuration = 5000;
  const defaultPosition = 'bottom-right';

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 500);
  }, [removeToast, toast.id]);

  useEffect(() => {
    const duration = toast.duration || defaultDuration;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [handleClose, toast.duration]);

  // Determinar classes de animação com base na posição
  const getAnimationClasses = () => {
    const position = toast.position || defaultPosition;
    const enterClass = {
      'top-left': 'enter-left',
      'bottom-left': 'enter-left',
      'top-right': 'enter-right',
      'bottom-right': 'enter-right',
      'top-center': 'enter-top',
      'bottom-center': 'enter-bottom',
    }[position];

    const exitClass = {
      'top-left': 'exit-left',
      'bottom-left': 'exit-left',
      'top-right': 'exit-right',
      'bottom-right': 'exit-right',
      'top-center': 'exit-top',
      'bottom-center': 'exit-bottom',
    }[position];

    return `${enterClass} ${exiting ? exitClass : ''}`;
  };

  return (
    <div
      className={`toast ${toast.type} ${exiting ? 'exit' : 'enter'} ${getAnimationClasses()}`}
    >
      <div className="toast-header">
        <strong className="toast-title">{toast.title}</strong>
        <button className="toast-close" onClick={handleClose}>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="toast-body">
        {toast.message && <p>{toast.message}</p>}
        {toast.messageList && (
          <ul>
            {toast.messageList.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Toast;
