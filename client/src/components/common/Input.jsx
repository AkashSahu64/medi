import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  labelClassName = '',
  required = false,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-2 ${containerClassName}`}
    >
      {label && (
        <label
          className={`block text-sm font-medium text-secondary-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 text-sm">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          className={`
            w-full
            h-[44px]
            text-sm
            rounded-lg
            border border-secondary-300
            bg-white
            px-3
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            focus:outline-none
            focus:ring-2
            focus:ring-primary-500
            focus:border-primary-500
            transition
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 text-sm">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-secondary-500">{helperText}</p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';
export default Input;
