import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { format, parseISO, addDays, isSunday, isPast } from "date-fns";
import { appointmentService } from "../../services/appointment.service";
import { serviceService } from "../../services/service.service";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaWhatsapp,
  FaSync,
  FaSpinner,
  FaCalendarPlus
} from "react-icons/fa";
import toast from "react-hot-toast";

const AdminAppointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("view");
  const [submitting, setSubmitting] = useState(false);
  
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    date: searchParams.get("date") || "",
    search: searchParams.get("search") || "",
    page: 1,
    limit: 20,
  });
  
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    service: "",
    appointmentDate: getNextAvailableDate(),
    timeSlot: "",
    healthConcern: "",
    status: "pending",
    notes: ""
  });

  // Helper function to get next available date (skip Sundays and past dates)
  function getNextAvailableDate() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    
    // Skip Sundays
    while (date.getDay() === 0) { // 0 = Sunday
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  }

  // Load appointments on component mount and when filters change
  useEffect(() => {
    loadAppointments();
    loadServices();
  }, [filters.page, filters.status, filters.date, filters.search]);

  // Load services for dropdown
  const loadServices = async () => {
  try {
    console.log('🔄 Loading services for appointments...');
    
    // For appointments, we want ALL services (including inactive)
    // because admin might want to create appointment for any service
    const response = await serviceService.getAllServicesForAdmin({
      isActive: 'all' // Get all services, active and inactive
    });
    
    console.log('✅ Services loaded:', {
      success: response.success,
      count: response.count,
      dataLength: response.data?.length
    });
    
    if (response.success && response.data) {
      setServices(response.data);
      console.log(`✅ Set ${response.data.length} services in state`);
    } else {
      console.error('❌ Failed to load services:', response);
      toast.error('Failed to load services. Please try again.');
    }
  } catch (error) {
    console.error("❌ Error loading services:", error);
    toast.error("Failed to load services");
  }
};

  // Load available slots when date changes
  useEffect(() => {
    if (formData.appointmentDate) {
      loadAvailableSlots();
    }
  }, [formData.appointmentDate]);

  const loadAvailableSlots = async () => {
    if (!formData.appointmentDate) return;
    
    setLoadingSlots(true);
    try {
      const dateStr = format(formData.appointmentDate, 'yyyy-MM-dd');
      console.log('🔄 Loading slots for:', dateStr);
      
      const response = await appointmentService.getAvailableSlots(dateStr);
      console.log('📋 Slots response:', response);
      
      if (response.success) {
        setAvailableSlots(response.data);
        // Auto-select first available slot if none selected and slots exist
        if (!formData.timeSlot && response.data.length > 0) {
          setFormData(prev => ({ ...prev, timeSlot: response.data[0] }));
        }
      } else {
        setAvailableSlots([]);
        if (response.message) {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("❌ Error loading available slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      console.log("🔄 Loading appointments with filters:", filters);
      
      const params = {};
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.search) params.search = filters.search;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await appointmentService.getAllAppointments(params);
      console.log("✅ Appointments response:", response);

      if (response.success) {
        setAppointments(response.data || []);
        setTotalPages(response.pages || 1);
      } else {
        toast.error(response.message || "Failed to load appointments");
        setAppointments([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ Error loading appointments:", error);
      toast.error("Failed to load appointments");
      setAppointments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
    toast.success("Appointments refreshed");
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await appointmentService.updateAppointmentStatus(id, status);
      
      if (response.success) {
        // Update local state
        const updated = appointments.map(apt =>
          apt._id === id ? { ...apt, status } : apt
        );
        setAppointments(updated);
        
        toast.success(`Appointment ${status} successfully`);
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("view");
    setIsModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("edit");
    
    // Set form data for editing
    setFormData({
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      service: appointment.service?._id || "",
      appointmentDate: new Date(appointment.appointmentDate),
      timeSlot: appointment.timeSlot,
      healthConcern: appointment.healthConcern || "",
      status: appointment.status,
      notes: appointment.notes || ""
    });
    
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setModalType("create");
    
    // Reset form data for new appointment with next available date
    setFormData({
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      service: "",
      appointmentDate: getNextAvailableDate(),
      timeSlot: "",
      healthConcern: "",
      status: "pending",
      notes: ""
    });
    
    setIsModalOpen(true);
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const response = await appointmentService.cancelAppointment(id);
        
        if (response.success) {
          // Update local state
          const updated = appointments.map(apt =>
            apt._id === id ? { ...apt, status: 'cancelled' } : apt
          );
          setAppointments(updated);
          
          toast.success("Appointment cancelled");
        } else {
          toast.error(response.message || "Failed to cancel appointment");
        }
      } catch (error) {
        console.error("❌ Error cancelling appointment:", error);
        toast.error("Failed to cancel appointment");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment permanently?")) {
      try {
        const response = await appointmentService.deleteAppointment(id);
        
        if (response.success) {
          // Remove from local state
          const updated = appointments.filter(apt => apt._id !== id);
          setAppointments(updated);
          
          toast.success("Appointment deleted permanently");
        } else {
          toast.error(response.message || "Failed to delete appointment");
        }
      } catch (error) {
        console.error("❌ Error deleting appointment:", error);
        toast.error("Failed to delete appointment");
      }
    }
  };

  const handleSendReminder = async (appointment) => {
    try {
      toast.success("Reminder feature coming soon!");
    } catch (error) {
      toast.error("Failed to send reminder");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.patientName || !formData.patientPhone || !formData.service || !formData.appointmentDate || !formData.timeSlot) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare appointment data
      const appointmentData = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        service: formData.service,
        appointmentDate: format(formData.appointmentDate, 'yyyy-MM-dd'),
        timeSlot: formData.timeSlot,
        healthConcern: formData.healthConcern,
        status: formData.status,
        notes: formData.notes
      };
      
      console.log('📤 Submitting appointment:', appointmentData);
      
      let response;
      
      if (modalType === "create") {
        response = await appointmentService.createAppointment(appointmentData);
      } else {
        response = await appointmentService.updateAppointment(selectedAppointment._id, appointmentData);
      }
      
      if (response.success) {
        toast.success(response.message || "Appointment saved successfully");
        setIsModalOpen(false);
        
        // Reload appointments
        loadAppointments();
      } else {
        toast.error(response.message || "Failed to save appointment");
      }
    } catch (error) {
      console.error("❌ Error saving appointment:", error);
      toast.error(error.message || "Failed to save appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ 
      ...prev, 
      appointmentDate: date,
      timeSlot: "" // Reset time slot when date changes
    }));
  };

  // Filter out Sundays from date picker
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0; // 0 is Sunday
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-cyan-100 text-cyan-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  // Clear URL params when filters are cleared
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.date) params.set("date", filters.date);
    if (filters.search) params.set("search", filters.search);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>Appointments Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointments Management
            </h1>
            <p className="text-gray-600">
              Manage and track all patient appointments
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              {refreshing || loading ? (
                <FaSpinner className="mr-2 animate-spin" />
              ) : (
                <FaSync className="mr-2" />
              )}
              Refresh
            </Button>
            <Button onClick={handleCreate}>
              <FaCalendarPlus className="mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value, page: 1 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <DatePicker
                selected={filters.date ? new Date(filters.date) : null}
                onChange={(date) =>
                  setFilters({
                    ...filters,
                    date: date ? format(date, "yyyy-MM-dd") : "",
                    page: 1,
                  })
                }
                placeholderText="Filter by date"
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-end space-x-2 my-1.5">
              <Button
                variant="secondary"
                onClick={() =>
                  setFilters({
                    status: "",
                    date: "",
                    search: "",
                    page: 1,
                    limit: 20,
                  })
                }
                className="flex-1"
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
              <Button
                onClick={loadAppointments}
                disabled={loading}
                className="flex-1"
              >
                {loading ? <FaSpinner className="mr-2 animate-spin" /> : 'Apply'}
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size="lg" />
              <span className="ml-3 text-gray-600">Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                {filters.status || filters.date || filters.search
                  ? "Try changing your filter criteria"
                  : "No appointments scheduled yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center p-6 border-b">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{appointments.length}</span> appointments
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                >
                  <FaSync className={`mr-2 ${refreshing || loading ? 'animate-spin' : ''}`} />
                  Refresh List
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <motion.tr
                        key={appointment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                              <FaUser className="text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {appointment.patientName}
                              </div>
                              <div className="text-sm text-gray-500">
                                <FaPhone className="inline mr-1" size={12} />
                                {appointment.patientPhone}
                              </div>
                              <div className="text-sm text-gray-500">
                                <FaEnvelope className="inline mr-1" size={12} />
                                {appointment.patientEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {appointment.serviceName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaCalendarAlt className="mr-2" size={12} />
                              {format(
                                new Date(appointment.appointmentDate),
                                "dd MMM yyyy",
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaClock className="mr-2" size={12} />
                              {appointment.timeSlot}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusOptions.find(
                                (s) => s.value === appointment.status,
                              )?.color || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(appointment)}
                              className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {appointment.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      appointment._id,
                                      "confirmed",
                                    )
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Confirm"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => handleCancel(appointment._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Cancel"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                            {appointment.status === "confirmed" && (
                              <button
                                onClick={() => handleSendReminder(appointment)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Send Reminder"
                              >
                                <FaWhatsapp />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(appointment)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Permanently"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {filters.page} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={filters.page === totalPages}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === "view"
            ? "Appointment Details"
            : modalType === "edit"
              ? "Edit Appointment"
              : "New Appointment"
        }
        size="lg"
      >
        {modalType === "view" && selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Patient Name
                </h4>
                <p className="mt-1 font-medium">
                  {selectedAppointment.patientName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Phone Number
                </h4>
                <p className="mt-1 font-medium">
                  {selectedAppointment.patientPhone}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1 font-medium">
                  {selectedAppointment.patientEmail}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Service</h4>
                <p className="mt-1 font-medium">
                  {selectedAppointment.serviceName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                <p className="mt-1 font-medium">
                  {format(
                    new Date(selectedAppointment.appointmentDate),
                    "dd MMMM yyyy",
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Time Slot</h4>
                <p className="mt-1 font-medium">
                  {selectedAppointment.timeSlot}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Health Concern
              </h4>
              <p className="mt-1 text-gray-900 bg-gray-50 p-4 rounded-lg">
                {selectedAppointment.healthConcern || "No concerns mentioned"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-2 flex space-x-3">
                {statusOptions
                  .filter((opt) => opt.value !== "")
                  .map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        handleStatusUpdate(
                          selectedAppointment._id,
                          status.value,
                        )
                      }
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedAppointment.status === status.value
                          ? `${status.color.replace("bg-", "bg-").replace("text-", "text-")} border-transparent`
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => handleSendReminder(selectedAppointment)}>
                Send Reminder
              </Button>
            </div>
          </div>
        )}

        {/* Create/Edit Appointment Form */}
        {(modalType === "edit" || modalType === "create") && (
          <form onSubmit={handleFormSubmit} className="space-y-6 px-4 md:px-6 mb-4">
            <Input
              label="Patient Name"
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleFormChange}
              placeholder="Enter patient name"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleFormChange}
              placeholder="Enter phone number"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleFormChange}
              placeholder="Enter email address"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.title} - ₹{service.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <DatePicker
                  selected={formData.appointmentDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  filterDate={isWeekday}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholderText="Select date"
                  disabled={loadingSlots}
                />
                {loadingSlots && (
                  <p className="mt-1 text-sm text-gray-500">Loading available slots...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                  disabled={loadingSlots || availableSlots.length === 0}
                >
                  <option value="">Select time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {!formData.appointmentDate ? (
                  <p className="mt-1 text-sm text-gray-500">Please select a date first</p>
                ) : availableSlots.length === 0 && !loadingSlots ? (
                  <p className="mt-1 text-sm text-yellow-500">No slots available for this date</p>
                ) : loadingSlots ? (
                  <p className="mt-1 text-sm text-gray-500">Loading slots...</p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">{availableSlots.length} slots available</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Concern / Notes
              </label>
              <textarea
                name="healthConcern"
                value={formData.healthConcern}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                placeholder="Enter health concerns or notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {modalType === "edit" ? "Update Appointment" : "Create Appointment"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default AdminAppointments;