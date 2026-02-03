import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { dashboardService } from "../../services/dashboard.service";
import { appointmentService } from "../../services/appointment.service";
import { useApi } from "../../hooks/useApi";
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
  FaEnvelope,
  FaSpinner,
  FaSync,
  FaUser,
  FaCommentDots,
  FaFileAlt,
  FaEye,
  FaCheck,
  FaPhone,
  FaClock,
  FaCalendarDay,
} from "react-icons/fa";
import {
  formatDate,
  formatTimeAgo,
  formatCurrency,
  formatNumber,
} from "../../utils/helpers";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import NotificationDropdown from "../../components/NotificationDropdown";
import { FaAddressBook } from 'react-icons/fa';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    totalServices: 0,
    activeServices: 0,
    totalPatients: 0,
    totalUsers: 0,
    totalAdmins: 0,
    revenue: 0,
    newContacts: 0,
    pendingTestimonials: 0,
    completedAppointments: 0,
    averageRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [approvingAppointment, setApprovingAppointment] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { execute: fetchDashboardStats } = useApi(
    dashboardService.getDashboardStats,
  );
  const { execute: fetchRecentActivity } = useApi(
    dashboardService.getRecentActivity,
  );
  const { execute: fetchRecentAppointments } = useApi(async () => {
    const response = await appointmentService.getAllAppointments({
      page: 1,
      limit: 5,
      sort: "-appointmentDate",
    });
    return response?.data || [];
  });

  useEffect(() => {
    loadDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  // Listen for contact read events from other components
  const handleContactRead = () => {
    // Refresh dashboard stats when contact is read
    loadDashboardData(true); // silent refresh
  };
  
  window.addEventListener('contactRead', handleContactRead);
  
  return () => {
    window.removeEventListener('contactRead', handleContactRead);
  };
}, []);

useEffect(() => {
  const handleContactUpdated = (event) => {
    if (event.detail.action === 'read') {
      // Refresh dashboard stats silently
      loadDashboardData(true);
      console.log('✅ Dashboard updated for contact read');
    }
  };
  
  window.addEventListener('contactUpdated', handleContactUpdated);
  
  return () => {
    window.removeEventListener('contactUpdated', handleContactUpdated);
  };
}, []);

  const loadDashboardData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      console.log("🔄 Loading dashboard data...");

      const [statsResponse, activityResponse, appointmentsResponse] =
        await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivity(),
          fetchRecentAppointments(),
        ]);

      if (statsResponse?.success && statsResponse.data) {
        setDashboardStats(statsResponse.data);
        setRecentActivity(statsResponse.data.recentActivity || []);
      } else {
        console.error(
          "❌ Failed to load dashboard stats:",
          statsResponse?.message,
        );
        toast.error(statsResponse?.message || "Failed to load dashboard stats");
      }

      if (appointmentsResponse) {
        setRecentAppointments(appointmentsResponse);
      }

      if (!silent) {
        toast.success("Dashboard updated");
      }
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      if (!silent) {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData(true);
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleViewAppointment = (appointment) => {
    setViewingAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleApproveAppointment = async (appointment) => {
    if (approvingAppointment) return; // Prevent double click

    setApprovingAppointment(appointment._id);

    try {
      // Immediate UI update
      const updatedAppointments = recentAppointments.map((apt) =>
        apt._id === appointment._id ? { ...apt, status: "confirmed" } : apt,
      );
      setRecentAppointments(updatedAppointments);

      // Update dashboard stats immediately
      setDashboardStats((prev) => ({
        ...prev,
        pendingAppointments: Math.max(0, prev.pendingAppointments - 1),
      }));

      // Make API call
      const response = await appointmentService.updateAppointmentStatus(
        appointment._id,
        "confirmed",
      );

      if (response.success) {
        toast.success("Appointment confirmed successfully");

        // Refresh data silently to ensure consistency
        setTimeout(() => {
          loadDashboardData(true);
        }, 500);
      } else {
        // Revert on failure
        const revertedAppointments = recentAppointments.map((apt) =>
          apt._id === appointment._id ? { ...apt, status: "pending" } : apt,
        );
        setRecentAppointments(revertedAppointments);

        setDashboardStats((prev) => ({
          ...prev,
          pendingAppointments: prev.pendingAppointments + 1,
        }));

        toast.error(response.message || "Failed to confirm appointment");
      }
    } catch (error) {
      console.error("❌ Error approving appointment:", error);

      // Revert on error
      const revertedAppointments = recentAppointments.map((apt) =>
        apt._id === appointment._id ? { ...apt, status: "pending" } : apt,
      );
      setRecentAppointments(revertedAppointments);

      setDashboardStats((prev) => ({
        ...prev,
        pendingAppointments: prev.pendingAppointments + 1,
      }));

      toast.error("Failed to confirm appointment");
    } finally {
      setApprovingAppointment(null);
    }
  };

  const handleSendReminder = (appointment) => {
    toast.success("Reminder feature coming soon!");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FaHome /> },
    {
      path: "/admin/appointments",
      label: "Appointments",
      icon: <FaCalendarCheck />,
    },
    { path: "/admin/services", label: "Services", icon: <FaHandsHelping /> },
    {
      path: "/admin/testimonials",
      label: "Testimonials",
      icon: <FaComments />,
    },
    { path: "/admin/gallery", label: "Gallery", icon: <FaImage /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
    { path: "/admin/directory-management", label: "Directory", icon: <FaAddressBook /> },
  { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  const statsCards = [
    {
      title: "Total Appointments",
      value: formatNumber(dashboardStats.totalAppointments),
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "bg-cyan-500",
      change: dashboardStats.totalAppointments > 0 ? "+12%" : "0%",
      link: "/admin/appointments",
      description: "All-time appointments",
    },
    {
      title: "Pending Approvals",
      value: formatNumber(dashboardStats.pendingAppointments),
      icon: <FaBell className="text-2xl" />,
      color: "bg-yellow-500",
      change: dashboardStats.pendingAppointments > 0 ? "+3" : "0",
      link: "/admin/appointments?status=pending",
      description: "Need attention",
    },
    {
      title: "Today's Appointments",
      value: formatNumber(dashboardStats.todayAppointments),
      icon: <FaCalendarDay className="text-2xl" />,
      color: "bg-green-500",
      change: dashboardStats.todayAppointments > 0 ? "+2" : "0",
      link:
        "/admin/appointments?date=" + new Date().toISOString().split("T")[0],
      description: "Scheduled today",
    },
    {
      title: "Active Services",
      value: `${dashboardStats.activeServices}/${dashboardStats.totalServices}`,
      icon: <FaUserMd className="text-2xl" />,
      color: "bg-purple-500",
      change: `${Math.round((dashboardStats.activeServices / dashboardStats.totalServices) * 100) || 0}%`,
      link: "/admin/services",
      description: "Active services",
    },
    {
      title: "Total Patients",
      value: formatNumber(dashboardStats.totalPatients),
      icon: <FaUsers className="text-2xl" />,
      color: "bg-pink-500",
      change: dashboardStats.totalPatients > 0 ? "+8%" : "0%",
      link: "/admin/users",
      description: "Unique patients",
    },
    {
      title: "Revenue (30d)",
      value: formatCurrency(dashboardStats.revenue),
      icon: <FaDollarSign className="text-2xl" />,
      color: "bg-green-500",
      change: dashboardStats.revenue > 0 ? "+18%" : "0%",
      link: "/admin/appointments?status=completed",
      description: `Avg: ${formatCurrency(dashboardStats.averageRevenue || 0)}`,
    },
  ];

  // Icon mapping for activity
  const getActivityIcon = (iconName) => {
    const iconMap = {
      FaCalendarAlt: <FaCalendarAlt className="text-gray-600" />,
      FaUser: <FaUser className="text-gray-600" />,
      FaComments: <FaComments className="text-gray-600" />,
      FaEnvelope: <FaEnvelope className="text-gray-600" />,
      FaChartLine: <FaChartLine className="text-gray-600" />,
      FaFileAlt: <FaFileAlt className="text-gray-600" />,
      FaCommentDots: <FaCommentDots className="text-gray-600" />,
    };
    return iconMap[iconName] || <FaChartLine className="text-gray-600" />;
  };

  // Quick stats for right sidebar
  const quickStats = [
    {
      label: "New Contacts",
      value: formatNumber(dashboardStats.newContacts),
      link: "/admin/contacts",
      icon: FaEnvelope,
    },
    {
      label: "Pending Testimonials",
      value: formatNumber(dashboardStats.pendingTestimonials),
      link: "/admin/testimonials",
      icon: FaComments,
    },
    {
      label: "Completed (30d)",
      value: formatNumber(dashboardStats.completedAppointments),
      link: "/admin/appointments?status=completed",
      icon: FaCheck,
    },
    {
      label: "Total Users",
      value: formatNumber(dashboardStats.totalUsers),
      link: "/admin/users",
      icon: FaUsers,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | MEDIHOPE Physiotherapy</title>
      </Helmet>

      {/* Root layout: Column layout */}
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Topbar - Sticky at top */}
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                <FaBars />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {navItems.find((item) => item.path === location.pathname)
                  ?.label || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                title="Refresh dashboard"
                aria-label="Refresh dashboard"
              >
                {refreshing ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSync />
                )}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Messages */}
              <Link
                to="/admin/contacts"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Contact Messages"
              >
                <FaEnvelope />
                {dashboardStats.newContacts > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {dashboardStats.newContacts > 9
                      ? "9+"
                      : dashboardStats.newContacts}
                  </span>
                )}
              </Link>

              {/* Testimonials */}
              <Link
                to="/admin/testimonials"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Pending Testimonials"
              >
                <FaComments />
                {dashboardStats.pendingTestimonials > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                    {dashboardStats.pendingTestimonials > 9
                      ? "9+"
                      : dashboardStats.pendingTestimonials}
                  </span>
                )}
              </Link>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body - Row layout: Sidebar + Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Sticky positioned, starts below topbar */}
          <aside
  className={`
    fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
    lg:translate-x-0 lg:static lg:inset-auto lg:top-16 lg:h-screen lg:overflow-y-auto lg:border-r no-scrollbar
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <Link to="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">MEDIHOPE</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* Admin Info */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 truncate max-w-[140px]">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm lg:text-[16px] font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-600 border-l-4 border-primary-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:pl-5"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="px-6 my-4">
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
                    className="flex items-center px-3 py-2 text-sm bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-200 shadow-sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaCalendarCheck className="mr-2" />
                    New Appointment
                  </Link>
                  <Link
                    to="/admin/services/create"
                    className="flex items-center px-3 py-2 text-sm bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 shadow-sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaHandsHelping className="mr-2" />
                    Add Service
                  </Link>
                  <Link
                    to="/admin/contacts"
                    className="flex items-center justify-between px-3 py-2 text-sm bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 shadow-sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      View Messages
                    </div>
                    {dashboardStats.newContacts > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                        {dashboardStats.newContacts}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </nav>

            {/* Logout Button */}
            <div className="border-t p-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 bg-gradient-to-r from-red-50 to-red-100 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
              {location.pathname === "/admin" ? (
                <>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader size="lg" />
                      <span className="mt-3 text-gray-600">
                        Loading dashboard...
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Welcome Header */}
                      <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                          Welcome back, {user?.name?.split(" ")[0] || "Admin"}!
                        </h1>
                        <p className="text-gray-600 mt-1">
                          Here's what's happening with your clinic today.
                        </p>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                        {statsCards.map((stat, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                          >
                            <Link to={stat.link}>
                              <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300 h-full border border-gray-100 hover:border-primary-100">
                                <div className="flex items-center justify-between mb-4">
                                  <div
                                    className={`p-3 rounded-xl ${stat.color} text-white shadow-sm`}
                                  >
                                    {stat.icon}
                                  </div>
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      stat.change.includes("+")
                                        ? "bg-green-50 text-green-600 border border-green-100"
                                        : "bg-cyan-50 text-cyan-600 border border-cyan-100"
                                    }`}
                                  >
                                    {stat.change}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                  {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-gray-900">
                                  {stat.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {stat.description}
                                </p>
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
                          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                  <FaCalendarCheck className="mr-2 text-primary-600" />
                                  Recent Appointments
                                </h2>
                                <Link
                                  to="/admin/appointments"
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                >
                                  View all
                                  <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            </div>

                            {recentAppointments.length === 0 ? (
                              <div className="text-center py-12">
                                <div className="text-4xl mb-4">📅</div>
                                <p className="text-gray-500 font-medium">
                                  No recent appointments
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  New appointments will appear here
                                </p>
                              </div>
                            ) : (
                              <div className="overflow-hidden">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Service & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {recentAppointments.map((appointment) => (
                                        <tr
                                          key={appointment._id}
                                          className="hover:bg-gray-50 transition-colors"
                                        >
                                          <td className="px-6 py-4">
                                            <div>
                                              <p className="font-medium text-gray-900">
                                                {appointment.patientName}
                                              </p>
                                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                                <FaPhone
                                                  className="mr-1"
                                                  size={12}
                                                />
                                                {appointment.patientPhone}
                                              </p>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div>
                                              <p className="text-gray-900 font-medium">
                                                {appointment.serviceName}
                                              </p>
                                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <FaCalendarDay
                                                  className="mr-2"
                                                  size={12}
                                                />
                                                {formatDate(
                                                  appointment.appointmentDate,
                                                )}
                                              </div>
                                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <FaClock
                                                  className="mr-2"
                                                  size={12}
                                                />
                                                {appointment.timeSlot}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4">
                                            <span
                                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                appointment.status ===
                                                "confirmed"
                                                  ? "bg-green-100 text-green-800 border border-green-200"
                                                  : appointment.status ===
                                                      "pending"
                                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                    : appointment.status ===
                                                        "cancelled"
                                                      ? "bg-red-100 text-red-800 border border-red-200"
                                                      : "bg-cyan-100 text-cyan-800 border border-cyan-200"
                                              }`}
                                            >
                                              {appointment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                appointment.status.slice(1)}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={() =>
                                                  handleViewAppointment(
                                                    appointment,
                                                  )
                                                }
                                                className="px-3 py-1.5 text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors flex items-center"
                                              >
                                                <FaEye
                                                  className="mr-1.5"
                                                  size={12}
                                                />
                                                View
                                              </button>
                                              {appointment.status ===
                                                "pending" && (
                                                <button
                                                  onClick={() =>
                                                    handleApproveAppointment(
                                                      appointment,
                                                    )
                                                  }
                                                  disabled={
                                                    approvingAppointment ===
                                                    appointment._id
                                                  }
                                                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
                                                    approvingAppointment ===
                                                    appointment._id
                                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                      : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                                  }`}
                                                >
                                                  {approvingAppointment ===
                                                  appointment._id ? (
                                                    <>
                                                      <FaSpinner
                                                        className="mr-1.5 animate-spin"
                                                        size={12}
                                                      />
                                                      Confirming...
                                                    </>
                                                  ) : (
                                                    <>
                                                      <FaCheck
                                                        className="mr-1.5"
                                                        size={12}
                                                      />
                                                      Confirm
                                                    </>
                                                  )}
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Right Sidebar - Quick Stats & Recent Activity */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-8"
                        >
                          {/* Quick Stats */}
                          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                  <FaChartLine className="mr-2 text-primary-600" />
                                  Quick Stats
                                </h2>
                                <button
                                  onClick={handleRefresh}
                                  disabled={refreshing}
                                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Refresh stats"
                                >
                                  {refreshing ? (
                                    <FaSpinner
                                      className="animate-spin"
                                      size={14}
                                    />
                                  ) : (
                                    <FaSync size={14} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="space-y-3">
                                {quickStats.map((stat, index) => {
                                  const Icon = stat.icon;
                                  return (
                                    <Link
                                      key={index}
                                      to={stat.link}
                                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mr-3 group-hover:from-gray-100 group-hover:to-gray-200 transition-all">
                                          <Icon
                                            className="text-gray-600"
                                            size={14}
                                          />
                                        </div>
                                        <span className="text-gray-600 font-medium">
                                          {stat.label}
                                        </span>
                                      </div>
                                      <span
                                        className={`font-bold ${
                                          parseInt(stat.value) > 0
                                            ? "text-primary-600"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {stat.value}
                                      </span>
                                    </Link>
                                  );
                                })}
                                <div className="flex items-center justify-between p-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mr-3">
                                      <FaCheck
                                        className="text-green-600"
                                        size={14}
                                      />
                                    </div>
                                    <span className="text-gray-600 font-medium">
                                      Clinic Status
                                    </span>
                                  </div>
                                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">
                                    Open
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Activity */}
                          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                  <FaChartLine className="mr-2 text-primary-600" />
                                  Recent Activity
                                </h2>
                                <Link
                                  to="#"
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                >
                                  View all
                                  <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                                {recentActivity.length === 0 ? (
                                  <div className="text-center py-4">
                                    <div className="text-3xl mb-2">📊</div>
                                    <p className="text-gray-500 font-medium">
                                      No recent activity
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                      Activity will appear here
                                    </p>
                                  </div>
                                ) : (
                                  recentActivity.map((activity, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:from-gray-100 group-hover:to-gray-200 transition-all">
                                        {getActivityIcon(activity.icon)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 font-medium leading-tight">
                                          <span className="text-primary-600">
                                            {activity.user}
                                          </span>{" "}
                                          {activity.action}
                                        </p>
                                        {activity.details && (
                                          <p className="text-xs text-gray-500 truncate mt-1">
                                            {activity.details}
                                          </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">
                                          {formatTimeAgo(activity.time)}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Outlet />
              )}
            </div>
          </main>

          {/* Mobile Sidebar Backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Appointment View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingAppointment(null);
        }}
        title="Appointment Details"
        size="lg"
      >
        {viewingAppointment && (
          <div className="space-y-6 p-6">
            {/* Patient Info */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-primary-600" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium text-gray-900">
                    {viewingAppointment.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {viewingAppointment.patientPhone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">
                    {viewingAppointment.patientEmail || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appointment ID</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {viewingAppointment._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaCalendarCheck className="mr-2 text-primary-600" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium text-gray-900">
                    {viewingAppointment.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(
                      viewingAppointment.appointmentDate,
                      "EEEE, dd MMMM yyyy",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-medium text-gray-900">
                    {viewingAppointment.timeSlot}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1 ${
                      viewingAppointment.status === "confirmed"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : viewingAppointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : viewingAppointment.status === "cancelled"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-cyan-100 text-cyan-800 border border-cyan-200"
                    }`}
                  >
                    {viewingAppointment.status.charAt(0).toUpperCase() +
                      viewingAppointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Concern */}
            {viewingAppointment.healthConcern && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-primary-600" />
                  Health Concern
                </h3>
                <p className="text-gray-700 bg-white p-4 rounded-lg border border-green-200">
                  {viewingAppointment.healthConcern}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleSendReminder(viewingAppointment)}
                  icon={<FaBell />}
                >
                  Send Reminder
                </Button>
                {viewingAppointment.status === "pending" && (
                  <Button
                    onClick={() => handleApproveAppointment(viewingAppointment)}
                    loading={approvingAppointment === viewingAppointment._id}
                    icon={<FaCheck />}
                    variant="success"
                  >
                    Confirm Appointment
                  </Button>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewingAppointment(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/admin/appointments/${viewingAppointment._id}`);
                  }}
                >
                  View Full Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminDashboard;
