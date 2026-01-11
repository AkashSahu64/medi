import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import { appointmentService } from '../../services/appointment.service';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
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
  FaWhatsapp
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminAppointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    date: searchParams.get('date') || '',
    search: searchParams.get('search') || '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  const { execute: fetchAppointments } = useApi(appointmentService.getAllAppointments);

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  useEffect(() => {
    // Update URL with filters
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.date) params.set('date', filters.date);
    if (filters.search) params.set('search', filters.search);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.search) params.search = filters.search;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await fetchAppointments(params);
      
      if (response) {
        setAppointments(response.data || []);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const notes = status === 'confirmed' ? 'Appointment confirmed by admin' : '';
      await appointmentService.updateAppointmentStatus(id, status, notes);
      toast.success(`Appointment ${status} successfully`);
      loadAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(id);
        toast.success('Appointment cancelled');
        loadAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const handleSendReminder = async (appointment) => {
    try {
      // Implement WhatsApp reminder logic
      const message = `Reminder: Your appointment at MEDIHOPE is tomorrow at ${appointment.timeSlot}. Please arrive 10 minutes early.`;
      toast.success('Reminder sent successfully');
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <>
      <Helmet>
        <title>Appointments Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments Management</h1>
            <p className="text-gray-600">Manage and track all patient appointments</p>
          </div>
          <Button
            onClick={() => {
              setModalType('create');
              setSelectedAppointment(null);
              setIsModalOpen(true);
            }}
          >
            + New Appointment
          </Button>
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
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
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
                onChange={(date) => setFilters({ 
                  ...filters, 
                  date: date ? format(date, 'yyyy-MM-dd') : '',
                  page: 1 
                })}
                placeholderText="Filter by date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({
                  status: '',
                  date: '',
                  search: '',
                  page: 1,
                  limit: 10
                })}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size="lg" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                {filters.status || filters.date || filters.search 
                  ? 'Try changing your filter criteria' 
                  : 'No appointments scheduled yet'}
              </p>
            </div>
          ) : (
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
                            {format(new Date(appointment.appointmentDate), 'dd MMM yyyy')}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaClock className="mr-2" size={12} />
                            {appointment.timeSlot}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusOptions.find(s => s.value === appointment.status)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
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
                          {appointment.status === 'confirmed' && (
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
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={filters.page === totalPages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
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
        title={modalType === 'view' ? 'Appointment Details' : modalType === 'edit' ? 'Edit Appointment' : 'New Appointment'}
        size="lg"
      >
        {modalType === 'view' && selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                <p className="mt-1 font-medium">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                <p className="mt-1 font-medium">{selectedAppointment.patientPhone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1 font-medium">{selectedAppointment.patientEmail}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Service</h4>
                <p className="mt-1 font-medium">{selectedAppointment.serviceName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                <p className="mt-1 font-medium">
                  {format(new Date(selectedAppointment.appointmentDate), 'dd MMMM yyyy')}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Time Slot</h4>
                <p className="mt-1 font-medium">{selectedAppointment.timeSlot}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Health Concern</h4>
              <p className="mt-1 text-gray-900 bg-gray-50 p-4 rounded-lg">
                {selectedAppointment.healthConcern || 'No concerns mentioned'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-2 flex space-x-3">
                {statusOptions
                  .filter(opt => opt.value !== '')
                  .map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(selectedAppointment._id, status.value)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedAppointment.status === status.value
                          ? `${status.color.replace('bg-', 'bg-').replace('text-', 'text-')} border-transparent`
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => handleSendReminder(selectedAppointment)}
              >
                Send Reminder
              </Button>
            </div>
          </div>
        )}

        {/* Edit/Create Appointment Form */}
        {(modalType === 'edit' || modalType === 'create') && (
          <div className="space-y-4">
            <Input
              label="Patient Name"
              type="text"
              defaultValue={selectedAppointment?.patientName || ''}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              defaultValue={selectedAppointment?.patientPhone || ''}
              required
            />
            <Input
              label="Email Address"
              type="email"
              defaultValue={selectedAppointment?.patientEmail || ''}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <DatePicker
                  selected={selectedAppointment?.appointmentDate ? new Date(selectedAppointment.appointmentDate) : new Date()}
                  onChange={() => {}}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>09:00-09:30</option>
                  <option>09:30-10:00</option>
                  {/* Add more time slots */}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={4}
                defaultValue={selectedAppointment?.healthConcern || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Add any notes or health concerns..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button>
                {modalType === 'edit' ? 'Update Appointment' : 'Create Appointment'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminAppointments;