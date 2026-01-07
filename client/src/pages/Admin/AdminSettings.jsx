import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
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
  FaHistory
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    // Load initial settings
    const initialSettings = {
      clinicName: 'MEDIHOPE Physiotherapy Centre',
      clinicEmail: 'info@medihope.com',
      clinicPhone: '+91-9876543210',
      clinicAddress: '123 Health Street, Medical City, MC 12345',
      clinicHours: '9:00 AM - 7:00 PM',
      clinicDays: 'Monday - Saturday',
      whatsappNumber: '+91-9876543210',
      facebookUrl: 'https://facebook.com/medihope',
      twitterUrl: 'https://twitter.com/medihope',
      instagramUrl: 'https://instagram.com/medihope',
      linkedinUrl: 'https://linkedin.com/company/medihope',
      emailNotifications: true,
      whatsappNotifications: true,
      appointmentReminderHours: 24,
      slotBufferMinutes: 15,
      primaryColor: '#0ea5e9',
      secondaryColor: '#64748b',
      enableMaintenance: false,
      allowRegistration: true,
      requireEmailVerification: false,
      sessionTimeout: 30
    };

    reset(initialSettings);
  }, [reset]);

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
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', data);
      toast.success('Settings saved successfully');
      setSaving(false);
    }, 1000);
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    // Simulate backup process
    setTimeout(() => {
      toast.success('Backup completed successfully');
      setBackupLoading(false);
    }, 2000);
  };

  const handleRestore = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        toast.success('Backup file selected. Click "Restore Backup" to proceed.');
      }
    };
    fileInput.click();
  };

  return (
    <>
      <Helmet>
        <title>Settings | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your clinic management system</p>
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
                      ? 'border-primary-600 text-primary-600'
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
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
                    placeholder="+91-9876543210"
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
                    leftIcon={<FaTwitter className="text-blue-400" />}
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
                      <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}></div>
                      <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}></div>
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
                        Last backup: 2 days ago • Size: 15.4 MB
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
                        <Button
                          variant="outline"
                          onClick={handleRestore}
                          className="w-full"
                        >
                          Select Backup File
                        </Button>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Restore Backup
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Backup History */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Backup History</h3>
                    <div className="space-y-3">
                      {[
                        { date: '2024-01-28 14:30', size: '15.4 MB', type: 'Complete' },
                        { date: '2024-01-27 09:15', size: '14.8 MB', type: 'Complete' },
                        { date: '2024-01-26 18:45', size: '14.2 MB', type: 'Incremental' },
                        { date: '2024-01-25 23:10', size: '15.1 MB', type: 'Complete' }
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FaDatabase className="text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{backup.date}</p>
                              <p className="text-sm text-gray-600">{backup.type} Backup</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{backup.size}</p>
                            <div className="flex space-x-2">
                              <button className="text-sm text-blue-600 hover:text-blue-700">
                                Download
                              </button>
                              <button className="text-sm text-red-600 hover:text-red-700">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Time
                        </label>
                        <input
                          type="time"
                          defaultValue="02:00"
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
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                          <option value="7">7 days</option>
                          <option value="30" selected>30 days</option>
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
                  Changes will be applied immediately
                </div>
                <Button type="submit" loading={saving}>
                  <FaSave className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-900 mb-4">⚠️ Danger Zone</h2>
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
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all settings to default?')) {
                    toast.success('Settings reset to default');
                  }
                }}
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
                onClick={() => {
                  if (window.confirm('WARNING: This will delete ALL data. Are you absolutely sure?')) {
                    toast.error('Data deletion initiated');
                  }
                }}
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;