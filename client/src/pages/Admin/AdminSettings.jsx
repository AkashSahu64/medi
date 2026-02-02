import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaSave, 
  FaCog, 
  FaBell, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPalette,
  FaShieldAlt,
  FaKey,
  FaDatabase,
  FaCloudUploadAlt,
  FaHistory,
  FaDownload,
  FaTrash,
  FaExclamationTriangle,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
  FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// ========== EMBEDDED COMPONENTS ==========

// Button Component
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-transparent',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 bg-transparent'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

// Input Component
const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  labelClassName = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.div
        whileTap={{ scale: disabled ? 1 : 0.995 }}
        className={`relative rounded-lg transition-all duration-200 ${error ? 'ring-2 ring-red-500 ring-opacity-50' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:border-primary-500 focus:ring-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{rightIcon}</span>
          </div>
        )}
      </motion.div>
      
      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  padding = true,
  className = '',
  preventScroll = true
}) => {
  useEffect(() => {
    if (isOpen && preventScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeOnOverlayClick ? onClose : undefined}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || showCloseButton) && (
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    {title && (
                      <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                      </h3>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-auto"
                        aria-label="Close"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className={`${padding ? 'p-6' : ''} overflow-y-auto`} style={{ maxHeight: 'calc(90vh - 120px)' }}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ConfirmModal Component
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  icon,
  confirmButtonProps = {},
  cancelButtonProps = {},
  children
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: <FaExclamationTriangle className="text-red-500 text-xl" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      buttonVariant: 'danger'
    },
    warning: {
      icon: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      buttonVariant: 'warning'
    },
    success: {
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      buttonVariant: 'success'
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500 text-xl" />,
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className={`${config.bgColor} ${config.borderColor} border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
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
      )}
    </AnimatePresence>
  );
};

// ========== MAIN ADMIN SETTINGS COMPONENT ==========

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [backupHistory, setBackupHistory] = useState([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm();

  // Watch form changes
  const formValues = watch();
  
  // Load settings
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call - Replace with real API
      setTimeout(() => {
        const initialSettings = {
          clinicName: 'MEDIHOPE Physiotherapy Centre',
          clinicEmail: 'info@medihope.com',
          clinicPhone: '+91-6386065599',
          clinicAddress: '123 Health Street, Medical City, MC 12345',
          clinicHours: '9:00 AM - 7:00 PM',
          clinicDays: 'Monday - Saturday',
          whatsappNumber: '+91-6386065599',
          facebookUrl: 'https://facebook.com/medihope',
          twitterUrl: 'https://twitter.com/medihope',
          instagramUrl: 'https://instagram.com/medihope',
          linkedinUrl: 'https://linkedin.com/company/medihope',
          emailNotifications: true,
          whatsappNotifications: true,
          appointmentReminderHours: 24,
          slotBufferMinutes: 15,
          primaryColor: '#0077B6',
          secondaryColor: '#6B7280',
          enableMaintenance: false,
          allowRegistration: true,
          requireEmailVerification: false,
          sessionTimeout: 30,
          autoBackupEnabled: true,
          autoBackupTime: '02:00',
          backupRetentionDays: 30,
          lastUpdated: new Date().toISOString()
        };
        
        setSettings(initialSettings);
        reset(initialSettings);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to load settings');
      setLoading(false);
    }
  }, [reset]);

  // Load backup history
  const loadBackupHistory = useCallback(async () => {
    try {
      // Simulate API call - Replace with real API
      setTimeout(() => {
        setBackupHistory([
          { 
            id: '1', 
            name: 'backup-2024-01-28', 
            type: 'complete', 
            size: '15.4 MB', 
            collections: 6,
            createdAt: new Date('2024-01-28T14:30:00Z').toISOString()
          },
          { 
            id: '2', 
            name: 'backup-2024-01-27', 
            type: 'complete', 
            size: '14.8 MB', 
            collections: 6,
            createdAt: new Date('2024-01-27T09:15:00Z').toISOString()
          }
        ]);
      }, 500);
    } catch (error) {
      console.error('Error loading backup history:', error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    loadBackupHistory();
  }, [loadSettings, loadBackupHistory]);

  // Check for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'social', label: 'Social Media', icon: <FaFacebook /> },
    { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'backup', label: 'Backup', icon: <FaDatabase /> }
  ];

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Simulate API call - Replace with real API
      setTimeout(() => {
        console.log('Settings saved:', data);
        setSettings({ ...data, lastUpdated: new Date().toISOString() });
        reset(data);
        setHasUnsavedChanges(false);
        toast.success('Settings saved successfully');
        setSaving(false);
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to save settings');
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    setTimeout(() => {
      toast.success('Backup created successfully');
      setBackupLoading(false);
      // Add new backup to history
      const newBackup = {
        id: Date.now().toString(),
        name: `backup-${new Date().toISOString().split('T')[0]}`,
        type: 'manual',
        size: '16.2 MB',
        collections: 6,
        createdAt: new Date().toISOString()
      };
      setBackupHistory([newBackup, ...backupHistory]);
    }, 2000);
  };

  const handleDownloadBackup = async (backupId) => {
    toast.success('Backup download started');
    // In real implementation, this would trigger file download
  };

  const handleDeleteBackup = async (backupId) => {
    if (window.confirm('Are you sure you want to delete this backup?')) {
      setBackupHistory(backupHistory.filter(backup => backup.id !== backupId));
      toast.success('Backup deleted successfully');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast.error('Please select a JSON file');
        return;
      }
      setRestoreFile(file);
      setShowRestoreModal(true);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      toast.error('Please select a backup file first');
      return;
    }

    setBackupLoading(true);
    setTimeout(() => {
      toast.success('Backup restored successfully');
      setRestoreFile(null);
      setShowRestoreModal(false);
      setBackupLoading(false);
      // Reload settings after restore
      loadSettings();
    }, 2000);
  };

  const handleResetSettings = async () => {
    setBackupLoading(true);
    setTimeout(() => {
      const defaultSettings = {
        clinicName: 'MEDIHOPE Physiotherapy Centre',
        clinicEmail: 'info@medihope.com',
        clinicPhone: '+91-6386065599',
        clinicAddress: '123 Health Street, Medical City, MC 12345',
        clinicHours: '9:00 AM - 7:00 PM',
        clinicDays: 'Monday - Saturday',
        whatsappNumber: '+91-6386065599',
        facebookUrl: 'https://facebook.com/medihope',
        twitterUrl: 'https://twitter.com/medihope',
        instagramUrl: 'https://instagram.com/medihope',
        linkedinUrl: 'https://linkedin.com/company/medihope',
        emailNotifications: true,
        whatsappNotifications: true,
        appointmentReminderHours: 24,
        slotBufferMinutes: 15,
        primaryColor: '#0077B6',
        secondaryColor: '#6B7280',
        enableMaintenance: false,
        allowRegistration: true,
        requireEmailVerification: false,
        sessionTimeout: 30,
        autoBackupEnabled: true,
        autoBackupTime: '02:00',
        backupRetentionDays: 30,
        lastUpdated: new Date().toISOString()
      };
      
      setSettings(defaultSettings);
      reset(defaultSettings);
      setShowResetModal(false);
      toast.success('Settings reset to default values');
      setBackupLoading(false);
    }, 1500);
  };

  const handleDeleteAllData = async () => {
    const confirmation = prompt(
      'Type "DELETE_ALL_DATA_CONFIRM" to delete all data. This action cannot be undone!'
    );
    
    if (confirmation === 'DELETE_ALL_DATA_CONFIRM') {
      setBackupLoading(true);
      setTimeout(() => {
        toast.success('All data deleted successfully');
        setShowDeleteModal(false);
        setBackupLoading(false);
      }, 2000);
    } else {
      toast.error('Confirmation text does not match');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Configure your clinic management system</p>
              {settings?.lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {formatDate(settings.lastUpdated)}
                </p>
              )}
            </div>
            {hasUnsavedChanges && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                ⚠️ You have unsaved changes
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Clinic Information
                  </h2>

                  <Input
                    label="Clinic Name"
                    type="text"
                    leftIcon={<FaCog className="text-gray-400" />}
                    required
                    {...register('clinicName')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Clinic Email"
                      type="email"
                      leftIcon={<FaEnvelope className="text-gray-400" />}
                      required
                      {...register('clinicEmail')}
                    />

                    <Input
                      label="Clinic Phone"
                      type="tel"
                      leftIcon={<FaPhone className="text-gray-400" />}
                      required
                      {...register('clinicPhone')}
                    />
                  </div>

                  <Input
                    label="Clinic Address"
                    type="text"
                    leftIcon={<FaMapMarkerAlt className="text-gray-400" />}
                    required
                    {...register('clinicAddress')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Working Hours"
                      type="text"
                      leftIcon={<FaClock className="text-gray-400" />}
                      required
                      {...register('clinicHours')}
                    />

                    <Input
                      label="Working Days"
                      type="text"
                      leftIcon={<FaClock className="text-gray-400" />}
                      required
                      {...register('clinicDays')}
                    />
                  </div>
                </motion.div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Send email notifications for appointments</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register('emailNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FaWhatsapp className="text-green-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">WhatsApp Notifications</h4>
                          <p className="text-sm text-gray-600">Send WhatsApp notifications for appointments</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register('whatsappNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <Input
                      label="Appointment Reminder (hours before)"
                      type="number"
                      min="1"
                      max="72"
                      {...register('appointmentReminderHours')}
                    />

                    <Input
                      label="Slot Buffer Time (minutes)"
                      type="number"
                      min="0"
                      max="60"
                      helperText="Time between consecutive appointments"
                      {...register('slotBufferMinutes')}
                    />
                  </div>
                </motion.div>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Social Media Links
                  </h2>

                  <Input
                    label="WhatsApp Number"
                    type="tel"
                    leftIcon={<FaWhatsapp className="text-green-500" />}
                    placeholder="+91-6386065599"
                    {...register('whatsappNumber')}
                  />

                  <Input
                    label="Facebook URL"
                    type="url"
                    leftIcon={<FaFacebook className="text-blue-600" />}
                    placeholder="https://facebook.com/yourclinic"
                    {...register('facebookUrl')}
                  />

                  <Input
                    label="Twitter URL"
                    type="url"
                    leftIcon={<FaTwitter className="text-sky-400" />}
                    placeholder="https://twitter.com/yourclinic"
                    {...register('twitterUrl')}
                  />

                  <Input
                    label="Instagram URL"
                    type="url"
                    leftIcon={<FaInstagram className="text-pink-600" />}
                    placeholder="https://instagram.com/yourclinic"
                    {...register('instagramUrl')}
                  />

                  <Input
                    label="LinkedIn URL"
                    type="url"
                    leftIcon={<FaLinkedin className="text-blue-700" />}
                    placeholder="https://linkedin.com/company/yourclinic"
                    {...register('linkedinUrl')}
                  />
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Appearance Settings
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          className="w-12 h-12 rounded-lg cursor-pointer"
                          {...register('primaryColor')}
                        />
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          {...register('primaryColor')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          className="w-12 h-12 rounded-lg cursor-pointer"
                          {...register('secondaryColor')}
                        />
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          {...register('secondaryColor')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: formValues.primaryColor || '#0077B6' }}></div>
                      <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: formValues.secondaryColor || '#6B7280' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FaKey className="text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                          <p className="text-sm text-gray-600">Temporarily disable public access</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register('enableMaintenance')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FaShieldAlt className="text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">Allow User Registration</h4>
                          <p className="text-sm text-gray-600">Allow new users to register accounts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register('allowRegistration')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">Require Email Verification</h4>
                          <p className="text-sm text-gray-600">Require email verification for new users</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register('requireEmailVerification')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <Input
                      label="Session Timeout (minutes)"
                      type="number"
                      min="5"
                      max="240"
                      helperText="Automatically logout inactive users after specified minutes"
                      {...register('sessionTimeout')}
                    />
                  </div>
                </motion.div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Backup & Restore
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Backup Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <FaCloudUploadAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Create Backup</h3>
                          <p className="text-sm text-gray-600">Backup all clinic data</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        Create a complete backup of your clinic data including appointments, 
                        patients, services, and settings. This backup can be restored later if needed.
                      </p>
                      <Button
                        onClick={handleBackup}
                        loading={backupLoading}
                        className="w-full"
                      >
                        {backupLoading ? 'Creating Backup...' : 'Create Backup Now'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-3">
                        Last backup: {backupHistory[0]?.createdAt ? formatDate(backupHistory[0].createdAt) : 'Never'} • 
                        Size: {backupHistory[0]?.size || '0 MB'}
                      </p>
                    </div>

                    {/* Restore Card */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <FaHistory className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Restore Backup</h3>
                          <p className="text-sm text-gray-600">Restore from backup file</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        Restore your clinic data from a previous backup. This will overwrite 
                        current data, so make sure you have a recent backup.
                      </p>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="backup-file-input"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('backup-file-input').click()}
                          className="w-full"
                        >
                          Select Backup File
                        </Button>
                        {restoreFile && (
                          <p className="text-sm text-green-700">
                            Selected: {restoreFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Backup History */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Backup History</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadBackupHistory}
                      >
                        Refresh
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {backupHistory.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          No backups found. Create your first backup above.
                        </p>
                      ) : (
                        backupHistory.map((backup) => (
                          <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <FaDatabase className="text-gray-400 mr-3" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {formatDate(backup.createdAt)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)} Backup • {backup.collections} collections
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{backup.size}</p>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleDownloadBackup(backup.id)}
                                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                  <FaDownload className="mr-1" /> Download
                                </button>
                                <button 
                                  onClick={() => handleDeleteBackup(backup.id)}
                                  className="text-sm text-red-600 hover:text-red-700 flex items-center"
                                >
                                  <FaTrash className="mr-1" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Auto Backup Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Auto Backup Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Enable Auto Backup</h4>
                          <p className="text-sm text-gray-600">Automatically backup data daily</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            {...register('autoBackupEnabled')}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Time
                        </label>
                        <input
                          type="time"
                          {...register('autoBackupTime')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          System will create backup at specified time daily
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Keep Backups For
                        </label>
                        <select 
                          {...register('backupRetentionDays')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="7">7 days</option>
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="365">1 year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Save Button */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {hasUnsavedChanges ? 'You have unsaved changes' : 'All changes saved'}
                </div>
                <Button 
                  type="submit" 
                  loading={saving}
                  disabled={!hasUnsavedChanges || saving}
                >
                  <FaSave className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">⚠️ Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Reset All Settings</h4>
                <p className="text-sm text-red-700">
                  Reset all settings to default values. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowResetModal(true)}
              >
                Reset Settings
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Delete All Data</h4>
                <p className="text-sm text-red-700">
                  Permanently delete all appointments, patients, and clinic data.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        title="Restore Backup"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            You are about to restore from: <strong>{restoreFile?.name}</strong>
          </p>
          <p className="text-sm text-red-600">
            ⚠️ WARNING: This will overwrite all current data. Make sure you have a recent backup.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowRestoreModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRestore}
              loading={backupLoading}
            >
              Restore Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Settings Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetSettings}
        title="Reset Settings to Default?"
        message="This will reset all settings to their default values. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        loading={backupLoading}
      />

      {/* Delete All Data Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAllData}
        title="Delete All Data?"
        message="This will permanently delete ALL appointments, patients, and clinic data. This action is irreversible and will delete everything except admin users and settings."
        confirmText="Delete All Data"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};

export default AdminSettings;