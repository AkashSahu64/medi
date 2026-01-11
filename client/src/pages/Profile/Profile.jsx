import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { appointmentService } from '../../services/appointment.service';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaEdit, 
  FaSave, 
  FaHistory,
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaFileMedical,
  FaCog,
  FaKey,
  FaBell
} from 'react-icons/fa';
import { formatDate, formatTime, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');

  const { execute: fetchAppointments } = useApi(appointmentService.getMyAppointments);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user && !editing) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, editing, reset]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await fetchAppointments();
      if (response?.data) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // In a real app, you'd call an API to update user
      updateUser(data);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(id);
        toast.success('Appointment cancelled successfully');
        loadUserData();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const tabs = [
    { id: 'appointments', label: 'My Appointments', icon: <FaCalendarAlt /> },
    { id: 'medical', label: 'Medical History', icon: <FaFileMedical /> },
    { id: 'settings', label: 'Profile Settings', icon: <FaCog /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> }
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Helmet>
        <title>My Profile | MEDIHOPE Physiotherapy</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-20">
        <div className="container-padding py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  My Profile
                </h1>
                <p className="text-secondary-600">
                  Manage your appointments and profile information
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  Member since {new Date().getFullYear() - 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  {/* User Info */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-100">
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                        <FaUser className="text-4xl text-primary-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900">
                      {user?.name}
                    </h3>
                    <p className="text-secondary-600">{user?.email}</p>
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Verified Patient
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-600">Total Appointments</span>
                      <span className="font-semibold text-secondary-900">
                        {appointments.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-600">Upcoming</span>
                      <span className="font-semibold text-secondary-900">
                        {appointments.filter(a => a.status === 'confirmed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-600">Completed</span>
                      <span className="font-semibold text-secondary-900">
                        {appointments.filter(a => a.status === 'completed').length}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                            : 'text-secondary-700 hover:bg-secondary-50'
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="font-semibold text-secondary-900 mb-4">
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => window.location.href = '/appointment'}
                    >
                      <FaCalendarAlt className="mr-2" />
                      Book New Appointment
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setActiveTab('settings')}
                    >
                      <FaKey className="mr-2" />
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => window.location.href = '/contact'}
                    >
                      <FaPhone className="mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-secondary-900">
                        My Appointments
                      </h2>
                      <Button
                        onClick={() => window.location.href = '/appointment'}
                      >
                        <FaCalendarAlt className="mr-2" />
                        Book New
                      </Button>
                    </div>

                    {appointments.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <div className="text-6xl mb-6">📅</div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                          No appointments yet
                        </h3>
                        <p className="text-secondary-600 mb-6">
                          Book your first appointment to get started with your treatment
                        </p>
                        <Button
                          onClick={() => window.location.href = '/appointment'}
                          size="lg"
                        >
                          Book Your First Appointment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div
                            key={appointment._id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div className="mb-4 md:mb-0">
                                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                                    {appointment.serviceName}
                                  </h4>
                                  <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                                    <div className="flex items-center">
                                      <FaCalendarAlt className="mr-2" />
                                      {formatDate(appointment.appointmentDate)}
                                    </div>
                                    <div className="flex items-center">
                                      <FaClock className="mr-2" />
                                      {formatTime(appointment.timeSlot)}
                                    </div>
                                    <div className="flex items-center">
                                      <FaStethoscope className="mr-2" />
                                      {appointment.service?.duration || 30} mins
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </span>
                                  {appointment.status === 'confirmed' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCancelAppointment(appointment._id)}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {appointment.healthConcern && (
                                <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                                  <p className="text-secondary-700">
                                    <strong>Health Concern:</strong> {appointment.healthConcern}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center text-secondary-600">
                                  <FaCheckCircle className="mr-2 text-green-500" />
                                  Ref ID: {appointment._id.slice(-8).toUpperCase()}
                                </div>
                                {appointment.notes && (
                                  <div className="text-secondary-600">
                                    <strong>Notes:</strong> {appointment.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upcoming vs Past */}
                    {appointments.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <h4 className="font-semibold text-secondary-900 mb-4">
                            Upcoming Appointments
                          </h4>
                          <div className="space-y-3">
                            {appointments
                              .filter(a => a.status === 'confirmed' || a.status === 'pending')
                              .slice(0, 3)
                              .map((appointment) => (
                                <div key={appointment._id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-secondary-900">
                                      {formatDate(appointment.appointmentDate)}
                                    </p>
                                    <p className="text-sm text-secondary-600">
                                      {formatTime(appointment.timeSlot)}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <h4 className="font-semibold text-secondary-900 mb-4">
                            Past Appointments
                          </h4>
                          <div className="space-y-3">
                            {appointments
                              .filter(a => a.status === 'completed' || a.status === 'cancelled')
                              .slice(0, 3)
                              .map((appointment) => (
                                <div key={appointment._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                                  <div>
                                    <p className="font-medium text-secondary-900">
                                      {formatDate(appointment.appointmentDate)}
                                    </p>
                                    <p className="text-sm text-secondary-600">
                                      {appointment.serviceName}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Profile Settings Tab */}
                {activeTab === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-secondary-900">
                        Profile Settings
                      </h2>
                      {!editing && (
                        <Button
                          variant="outline"
                          onClick={() => setEditing(true)}
                        >
                          <FaEdit className="mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          type="text"
                          leftIcon={<FaUser className="text-secondary-400" />}
                          error={errors.name?.message}
                          disabled={!editing}
                          required
                          {...register('name', {
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters'
                            }
                          })}
                        />

                        <Input
                          label="Email Address"
                          type="email"
                          leftIcon={<FaEnvelope className="text-secondary-400" />}
                          error={errors.email?.message}
                          disabled={!editing}
                          required
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Enter a valid email address'
                            }
                          })}
                        />

                        <Input
                          label="Phone Number"
                          type="tel"
                          leftIcon={<FaPhone className="text-secondary-400" />}
                          error={errors.phone?.message}
                          disabled={!editing}
                          {...register('phone', {
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Enter a valid 10-digit phone number'
                            }
                          })}
                        />

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Member Since
                          </label>
                          <div className="px-4 py-3 bg-secondary-50 rounded-lg text-secondary-600">
                            {new Date().getFullYear() - 1}
                          </div>
                        </div>
                      </div>

                      {editing && (
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                              setEditing(false);
                              reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            <FaSave className="mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>

                    {/* Change Password Section */}
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Current Password"
                          type="password"
                          placeholder="Enter current password"
                        />
                        <Input
                          label="New Password"
                          type="password"
                          placeholder="Enter new password"
                        />
                        <Input
                          label="Confirm Password"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Medical History Tab */}
                {activeTab === 'medical' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-secondary-900">
                      Medical History
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900">
                            Treatment History
                          </h3>
                          <p className="text-secondary-600">
                            Overview of your treatments and progress
                          </p>
                        </div>
                        <Button variant="outline">
                          <FaFileMedical className="mr-2" />
                          Download Records
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {[
                          {
                            date: '2024-01-15',
                            treatment: 'Lower Back Pain Therapy',
                            therapist: 'Dr. Arjun Mehta',
                            sessions: 6,
                            progress: 'Significant improvement in mobility'
                          },
                          {
                            date: '2023-11-20',
                            treatment: 'Neck Pain Rehabilitation',
                            therapist: 'Dr. Priya Sharma',
                            sessions: 4,
                            progress: 'Pain reduced by 80%'
                          },
                          {
                            date: '2023-09-10',
                            treatment: 'Sports Injury Recovery',
                            therapist: 'Dr. Rahul Verma',
                            sessions: 8,
                            progress: 'Full recovery achieved'
                          }
                        ].map((record, index) => (
                          <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-secondary-900">
                                  {record.treatment}
                                </h4>
                                <p className="text-sm text-secondary-600">
                                  {record.therapist} • {record.sessions} sessions
                                </p>
                                <p className="text-sm text-secondary-700 mt-2">
                                  {record.progress}
                                </p>
                              </div>
                              <span className="text-sm text-secondary-500">
                                {record.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Health Metrics */}
                      <div className="mt-8 pt-8 border-t">
                        <h4 className="text-lg font-semibold text-secondary-900 mb-4">
                          Health Metrics
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Pain Level', value: '2/10', trend: '↓', color: 'green' },
                            { label: 'Mobility', value: '85%', trend: '↑', color: 'green' },
                            { label: 'Flexibility', value: '70%', trend: '↑', color: 'green' },
                            { label: 'Sessions Completed', value: '18', trend: '', color: 'cyan' }
                          ].map((metric, index) => (
                            <div key={index} className="bg-secondary-50 rounded-lg p-4 text-center">
                              <p className="text-sm text-secondary-600 mb-1">
                                {metric.label}
                              </p>
                              <p className="text-2xl font-bold text-secondary-900">
                                {metric.value}
                              </p>
                              {metric.trend && (
                                <p className={`text-sm font-medium ${
                                  metric.color === 'green' ? 'text-green-600' : 'text-cyan-600'
                                }`}>
                                  {metric.trend} Improved
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-secondary-900">
                      Notification Preferences
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="space-y-6">
                        {[
                          {
                            title: 'Email Notifications',
                            description: 'Receive appointment confirmations and reminders via email',
                            type: 'email',
                            enabled: true
                          },
                          {
                            title: 'SMS Notifications',
                            description: 'Get text message alerts for appointment updates',
                            type: 'sms',
                            enabled: true
                          },
                          {
                            title: 'WhatsApp Notifications',
                            description: 'Receive appointment details on WhatsApp',
                            type: 'whatsapp',
                            enabled: false
                          },
                          {
                            title: 'Health Tips',
                            description: 'Weekly health and wellness tips from our therapists',
                            type: 'tips',
                            enabled: true
                          },
                          {
                            title: 'Promotional Offers',
                            description: 'Special offers and discounts from MEDIHOPE',
                            type: 'offers',
                            enabled: false
                          }
                        ].map((pref, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                            <div className="flex items-start">
                              <div className="mr-4 mt-1">
                                <FaBell className="text-secondary-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-secondary-900">
                                  {pref.title}
                                </h4>
                                <p className="text-sm text-secondary-600">
                                  {pref.description}
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked={pref.enabled}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t">
                        <h4 className="text-lg font-semibold text-secondary-900 mb-4">
                          Notification History
                        </h4>
                        <div className="space-y-3">
                          {[
                            { type: 'Appointment Reminder', time: '2 hours ago', read: true },
                            { type: 'Treatment Plan Updated', time: '1 day ago', read: true },
                            { type: 'New Health Tip', time: '2 days ago', read: false },
                            { type: 'Payment Receipt', time: '1 week ago', read: true }
                          ].map((notification, index) => (
                            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                              notification.read ? 'bg-white' : 'bg-primary-50'
                            }`}>
                              <div className="flex items-center">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                )}
                                <div>
                                  <p className="font-medium text-secondary-900">
                                    {notification.type}
                                  </p>
                                  <p className="text-sm text-secondary-500">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                              <button className="text-primary-600 hover:text-primary-700 text-sm">
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;