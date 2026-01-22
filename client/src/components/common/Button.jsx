import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-2.5 py-1.5',
    lg: 'px-4 py-3 text-lg',
  };
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <FaSpinner className="animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;