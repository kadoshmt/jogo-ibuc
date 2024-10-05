import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  widthClass?: string;
  children: React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirm?: () => void;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideCancelButton?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  widthClass = 'max-w-md',
  children,
  cancelButtonText = 'Cancelar',
  confirmButtonText = 'Confirmar',
  onConfirm,
  hideHeader = false,
  hideFooter = false,
  hideCancelButton = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={handleOverlayClick}
        >
          <FocusTrap
            focusTrapOptions={{
              allowOutsideClick: true,
            }}
          >
          <motion.div
              className={`relative w-full ${widthClass} mx-auto my-6 bg-white rounded-lg shadow-lg`}
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.2 }}
            >
              {/* Botão de Fechar */}
              <button
                className={`absolute top-3 right-3 text-gray-400 hover:text-gray-600 ${
                  hideHeader ? '' : 'hidden'
                }`}
                onClick={onClose}
                aria-label="Fechar modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1  1 0 011.414 0L10 8.586l4.293-4.293a1  1 0 111.414 1.414L11.414 10l4.293 4.293a1  1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1  1 0 01-1.414-1.414L8.586 10 4.293 5.707a1  1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>

              {/* Header */}
              {!hideHeader && (
                <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
                  {title && (
                    <h3 className="text-xl font-semibold" id="modal-title">
                      {title}
                    </h3>
                  )}
                  <button
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    onClick={onClose}
                    aria-label="Fechar modal"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1  1 0 011.414 0L10 8.586l4.293-4.293a1  1 0 111.414 1.414L11.414 10l4.293 4.293a1  1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1  1 0 01-1.414-1.414L8.586 10 4.293 5.707a1  1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {!hideFooter && (
                <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
                  {!hideCancelButton && (
                    <button
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                      onClick={onClose}
                    >
                      {cancelButtonText}
                    </button>
                  )}
                  <button
                    className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary-light font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={onConfirm}
                  >
                    {confirmButtonText}
                  </button>
                </div>
              )}
            </motion.div>
          </FocusTrap>
        </div>
       )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
