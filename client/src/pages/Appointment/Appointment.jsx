import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format, addDays, isBefore, isSunday, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import TimeSlot from '../../components/ui/TimeSlot';
import { appointmentService } from '../../services/appointment.service';
import { serviceService } from '../../services/service.service';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaStethoscope } from 'react-icons/fa';

const Appointment = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      service: '',
      healthConcern: ''
    }
  });

  const { execute: fetchServices, loading: servicesLoading } = useApi(serviceService.getAllServices);
  const { execute: fetchSlots } = useApi(appointmentService.getAvailableSlots);
  const { execute: createAppointment } = useApi(appointmentService.createAppointment);

  // Fetch services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user && isAuthenticated) {
      setValue('fullName', user.name || '');
      setValue('email', user.email || '');
      setValue('mobileNumber', user.phone || '');
    }
  }, [user, isAuthenticated, setValue]);

  const loadServices = async () => {
    const response = await fetchServices();
    if (response?.data) {
      setServices(response.data);
    }
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetchSlots(formattedDate);
      
      if (response?.data) {
        setAvailableSlots(response.data);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Date picker configuration
  const isDateEnabled = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Enable only future dates except Sunday
  return !isBefore(date, today) && !isSunday(date);
};

  // Highlight available dates
  const highlightDates = [
    {
      "react-datepicker__day--highlighted": {
        backgroundColor: '#0ea5e9',
        color: 'white'
      },
      dates: [addDays(new Date(), 1), addDays(new Date(), 2)]
    }
  ];

  // Handle form submission
  const onSubmit = async (data) => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!data.service) {
      toast.error('Please select a service');
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        patientName: data.fullName,
        patientEmail: data.email,
        patientPhone: data.mobileNumber,
        service: data.service,
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedSlot,
        healthConcern: data.healthConcern || ''
      };

      const response = await createAppointment(appointmentData);

      if (response?.success) {
        toast.success('Appointment booked successfully! Confirmation sent.');
        
        // Reset form
        reset();
        setSelectedDate(null);
        setSelectedSlot(null);
        setAvailableSlots([]);

        // Navigate to success page or show confirmation
        navigate('/appointment/success', { 
          state: { appointment: response.data } 
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected service details
  const selectedServiceId = watch('service');
  const selectedService = services.find(s => s._id === selectedServiceId);

  return (
    <>
      <Helmet>
        <title>Book Appointment | MEDIHOPE Physiotherapy - Schedule Your Visit</title>
        <meta name="description" content="Book your physiotherapy appointment online. Choose from available time slots and services for professional care." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-20">
        <div className="container-padding py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                Book Your <span className="text-primary-600">Appointment</span>
              </h1>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                Schedule your visit with our certified physiotherapists. 
                Choose a convenient date and time slot for your consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Appointment Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                    Appointment Details
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        leftIcon={<FaUser className="text-secondary-400" />}
                        error={errors.fullName?.message}
                        required
                        {...register('fullName', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                      />

                      <Input
                        label="Mobile Number"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        leftIcon={<FaPhone className="text-secondary-400" />}
                        error={errors.mobileNumber?.message}
                        required
                        {...register('mobileNumber', {
                          required: 'Mobile number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Enter a valid 10-digit mobile number'
                          }
                        })}
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        leftIcon={<FaEnvelope className="text-secondary-400" />}
                        error={errors.email?.message}
                        {...register('email', {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address'
                          }
                        })}
                      />

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Service Required <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                            <FaStethoscope />
                          </div>
                          <select
                            className="w-full pl-12 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
                            {...register('service', { required: 'Please select a service' })}
                          >
                            <option value="">Select a service</option>
                            {services.map((service) => (
                              <option key={service._id} value={service._id}>
                                {service.title} - ₹{service.price} ({service.duration} mins)
                              </option>
                            ))}
                          </select>
                          {errors.service && (
                            <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
                          <FaCalendarAlt />
                        </div>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          minDate={new Date()}
                          filterDate={isDateEnabled}
                          highlightDates={highlightDates}
                          placeholderText="Select appointment date"
                          className="w-full pl-12 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          dateFormat="dd MMMM yyyy"
                          showDisabledMonthNavigation
                          calendarClassName="border border-secondary-200 rounded-lg shadow-lg"
                        />
                      </div>
                      <p className="mt-2 text-sm text-secondary-500">
                        Clinic timings: Monday-Saturday (9:00 AM - 7:00 PM), Sunday Closed
                      </p>
                    </div>

                    {/* Time Slot Selection */}
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-4">
                          Available Time Slots <span className="text-red-500">*</span>
                          <span className="ml-2 text-sm font-normal text-secondary-500">
                            ({format(selectedDate, 'EEEE, dd MMMM yyyy')})
                          </span>
                        </label>

                        {loadingSlots ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader size="md" />
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="text-center py-8 bg-secondary-50 rounded-lg">
                            <FaClock className="text-4xl text-secondary-400 mx-auto mb-3" />
                            <p className="text-secondary-600">
                              No slots available for this date. Please select another date.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {availableSlots.map((slot, index) => (
                                <TimeSlot
                                  key={slot}
                                  slot={slot}
                                  isSelected={selectedSlot === slot}
                                  isBooked={false}
                                  onClick={() => setSelectedSlot(slot)}
                                  index={index}
                                />
                              ))}
                            </div>
                            {selectedSlot && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-sm text-green-600 font-medium"
                              >
                                Selected: {selectedSlot.replace('-', ' to ')}
                              </motion.p>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Health Concern */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Health Concern / Additional Notes
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Briefly describe your condition or any specific concerns..."
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        {...register('healthConcern')}
                      />
                      <p className="mt-2 text-sm text-secondary-500">
                        This helps us prepare better for your appointment.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        loading={isSubmitting}
                        disabled={isSubmitting || !selectedDate || !selectedSlot}
                      >
                        {isSubmitting ? 'Booking Appointment...' : 'Confirm Appointment'}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </div>

              {/* Right Column - Booking Summary & Info */}
              <div className="space-y-6">
                {/* Service Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card"
                >
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedService && (
                      <div className="border-b border-secondary-200 pb-4">
                        <h4 className="font-semibold text-secondary-700 mb-2">Selected Service</h4>
                        <div className="flex justify-between">
                          <span className="text-secondary-600">{selectedService.title}</span>
                          <span className="font-semibold">₹{selectedService.price}</span>
                        </div>
                        <p className="text-sm text-secondary-500 mt-1">
                          Duration: {selectedService.duration} minutes
                        </p>
                      </div>
                    )}

                    {selectedDate && (
                      <div className="border-b border-secondary-200 pb-4">
                        <h4 className="font-semibold text-secondary-700 mb-2">Appointment Date</h4>
                        <div className="flex items-center text-secondary-600">
                          <FaCalendarAlt className="mr-2" />
                          {format(selectedDate, 'EEEE, dd MMMM yyyy')}
                        </div>
                      </div>
                    )}

                    {selectedSlot && (
                      <div className="border-b border-secondary-200 pb-4">
                        <h4 className="font-semibold text-secondary-700 mb-2">Time Slot</h4>
                        <div className="flex items-center text-secondary-600">
                          <FaClock className="mr-2" />
                          {selectedSlot.replace('-', ' to ')}
                        </div>
                      </div>
                    )}

                    {selectedService && selectedDate && selectedSlot && (
                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Total</span>
                          <span className="text-xl font-bold text-primary-600">
                            ₹{selectedService.price}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-500">
                          Payment to be made at clinic after consultation
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Booking Instructions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card bg-primary-50 border-primary-200"
                >
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    📋 What to Expect
                  </h3>
                  <ul className="space-y-3 text-sm text-secondary-600">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-primary-600 text-xs">1</span>
                      </div>
                      <span>You'll receive confirmation via SMS & email</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-primary-600 text-xs">2</span>
                      </div>
                      <span>Arrive 10 minutes before your scheduled time</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-primary-600 text-xs">3</span>
                      </div>
                      <span>Bring any relevant medical reports or prescriptions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-primary-600 text-xs">4</span>
                      </div>
                      <span>Wear comfortable clothing for assessment</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Emergency Contact */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card bg-red-50 border-red-200"
                >
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    ⚠️ Need Immediate Help?
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    For emergencies or severe pain, call us directly:
                  </p>
                  <a
                    href="tel:+91-9876543210"
                    className="inline-flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <FaPhone className="mr-2" />
                    Emergency: +91-9876543210
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Appointment Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 p-6 bg-secondary-50 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Appointment Policy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-secondary-600">
                <div>
                  <h4 className="font-semibold mb-2">Cancellation</h4>
                  <p>Cancel or reschedule at least 6 hours before your appointment to avoid charges.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Late Arrival</h4>
                  <p>Arriving late may reduce your treatment time or require rescheduling.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">No-Show</h4>
                  <p>Multiple no-shows may result in booking restrictions.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Appointment;