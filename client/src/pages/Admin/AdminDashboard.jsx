import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { appointmentService } from '../../services/appointment.service';
import { serviceService } from '../../services/service.service';
import { useApi } from '../../hooks/useApi';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaUsers, 
  FaDollarSign,
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarCheck,
  FaHandsHelping,
  FaComments,
  FaImage,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChartLine,
  FaEnvelope
} from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    totalServices: 0,
    totalPatients: 0,
    revenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { execute: fetchStats } = useApi(async () => {
    // In a real app, you'd have a dedicated stats endpoint
    const [appointmentsRes, servicesRes] = await Promise.all([
      appointmentService.getAllAppointments(),
      serviceService.getAllServices()
    ]);

    const appointments = appointmentsRes?.data || [];
    const today = new Date().toISOString().split('T')[0];

    return {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      todayAppointments: appointments.filter(a => 
        new Date(a.appointmentDate).toISOString().split('T')[0] === today
      ).length,
      totalServices: servicesRes?.data?.length || 0,
      totalPatients: 0, // You'd need a separate endpoint for this
      revenue: appointments
        .filter(a => a.status === 'completed')
        .reduce((sum, apt) => sum + (apt.service?.price || 0), 0)
    };
  });

  const { execute: fetchRecentAppointments } = useApi(async () => {
    const response = await appointmentService.getAllAppointments({
      page: 1,
      limit: 5,
      sort: '-appointmentDate'
    });
    return response?.data || [];
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const stats = await fetchStats();
      const appointments = await fetchRecentAppointments();
      
      if (stats) setDashboardStats(stats);
      if (appointments) setRecentAppointments(appointments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
    { path: '/admin/services', label: 'Services', icon: <FaHandsHelping /> },
    { path: '/admin/testimonials', label: 'Testimonials', icon: <FaComments /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <FaImage /> },
    { path: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { path: '/admin/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statsCards = [
    {
      title: 'Total Appointments',
      value: dashboardStats.totalAppointments,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: 'bg-cyan-500',
      change: '+12%',
      link: '/admin/appointments'
    },
    {
      title: 'Pending Approvals',
      value: dashboardStats.pendingAppointments,
      icon: <FaBell className="text-2xl" />,
      color: 'bg-yellow-500',
      change: '+3',
      link: '/admin/appointments?status=pending'
    },
    {
      title: "Today's Appointments",
      value: dashboardStats.todayAppointments,
      icon: <FaCalendarCheck className="text-2xl" />,
      color: 'bg-green-500',
      change: '+2',
      link: '/admin/appointments?date=' + new Date().toISOString().split('T')[0]
    },
    {
      title: 'Active Services',
      value: dashboardStats.totalServices,
      icon: <FaUserMd className="text-2xl" />,
      color: 'bg-purple-500',
      change: 'All Active',
      link: '/admin/services'
    },
    {
      title: 'Total Patients',
      value: dashboardStats.totalPatients,
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-pink-500',
      change: '+8%',
      link: '/admin/users'
    },
    {
      title: 'Revenue',
      value: `₹${dashboardStats.revenue.toLocaleString()}`,
      icon: <FaDollarSign className="text-2xl" />,
      color: 'bg-green-500',
      change: '+18%',
      link: '/admin/appointments?status=completed'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | MEDIHOPE Physiotherapy</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar for Desktop */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MEDIHOPE</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FaTimes />
            </button>
          </div>

          {/* Admin Info */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="px-6 my-6">
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Link
                  to="/admin/appointments/create"
                  className="flex items-center px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                >
                  <FaCalendarCheck className="mr-2" />
                  New Appointment
                </Link>
                <Link
                  to="/admin/services/create"
                  className="flex items-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  <FaHandsHelping className="mr-2" />
                  Add Service
                </Link>
              </div>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 bg-white border-b">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <FaBars />
                </button>
                <h1 className="ml-4 text-xl font-semibold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <FaBell />
                  {dashboardStats.pendingAppointments > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Messages */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <FaEnvelope />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
                </button>

                {/* Admin Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-4 sm:p-6 lg:p-8">
            {location.pathname === '/admin' ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                  {statsCards.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link to={stat.link}>
                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                              {stat.icon}
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-cyan-600'}`}>
                              {stat.change}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {stat.value}
                          </h3>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Appointments */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2"
                  >
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Recent Appointments
                        </h2>
                        <Link
                          to="/admin/appointments"
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View all →
                        </Link>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              <th className="pb-3">Patient</th>
                              <th className="pb-3">Service</th>
                              <th className="pb-3">Date & Time</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {recentAppointments.map((appointment) => (
                              <tr key={appointment._id}>
                                <td className="py-4">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {appointment.patientName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {appointment.patientPhone}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-4">
                                  <p className="text-gray-900">{appointment.serviceName}</p>
                                </td>
                                <td className="py-4">
                                  <p className="text-gray-900">
                                    {formatDate(appointment.appointmentDate)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {appointment.timeSlot}
                                  </p>
                                </td>
                                <td className="py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-cyan-100 text-cyan-800'
                                  }`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-4">
                                  <div className="flex space-x-2">
                                    <button className="p-1 text-cyan-600 hover:text-cyan-700">
                                      View
                                    </button>
                                    <button className="p-1 text-green-600 hover:text-green-700">
                                      Approve
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Clinic Overview
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Clinic Status</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Open
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Today's Schedule</span>
                          <span className="font-medium">{dashboardStats.todayAppointments} appointments</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Pending Reviews</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Unread Messages</span>
                          <span className="font-medium">5</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Recent Activity
                      </h2>
                      <div className="space-y-4">
                        {[
                          { user: 'Dr. Arjun', action: 'added new service', time: '10 min ago' },
                          { user: 'Patient Rajesh', action: 'booked appointment', time: '1 hour ago' },
                          { user: 'System', action: 'sent appointment reminder', time: '2 hours ago' },
                          { user: 'Admin', action: 'updated clinic timing', time: '3 hours ago' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <FaChartLine className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">{activity.user}</span> {activity.action}
                              </p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </main>
        </div>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;