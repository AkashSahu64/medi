import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimes, 
  FaInfoCircle,
  FaTrash,
  FaExclamationCircle
} from 'react-icons/fa';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'success', 'info'
  loading = false,
  icon,
  confirmButtonProps = {},
  cancelButtonProps = {},
  children
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: <FaExclamationTriangle className="text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      buttonVariant: 'danger'
    },
    warning: {
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      buttonVariant: 'warning'
    },
    success: {
      icon: <FaCheckCircle className="text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      buttonVariant: 'success'
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      buttonVariant: 'primary'
    }
  };

  const config = variantConfig[variant] || variantConfig.danger;
  const customIcon = icon || config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className={`${config.bgColor} ${config.borderColor} border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {customIcon}
                    </div>
                    <h3 className={`text-lg font-semibold ${config.textColor}`}>
                      {title}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                <div className={`mb-6 ${config.textColor}`}>
                  {message && (
                    <p className="text-base">
                      {message}
                    </p>
                  )}
                  {children && (
                    <div className="mt-4">
                      {children}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    {...cancelButtonProps}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={config.buttonVariant}
                    onClick={onConfirm}
                    loading={loading}
                    {...confirmButtonProps}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;