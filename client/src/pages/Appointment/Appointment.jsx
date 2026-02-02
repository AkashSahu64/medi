import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { format, addDays, isBefore, isSunday, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import TimeSlot from "../../components/ui/TimeSlot";
import { appointmentService } from "../../services/appointment.service";
import { serviceService } from "../../services/service.service";
import { useApi } from "../../hooks/useApi";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
} from "react-icons/fa";

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
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      service: "",
      healthConcern: "",
    },
  });

  const { execute: fetchServices, loading: servicesLoading } = useApi(
    serviceService.getAllServices,
  );
  const { execute: fetchSlots } = useApi(appointmentService.getAvailableSlots);
  const { execute: createAppointment } = useApi(
    appointmentService.createAppointment,
  );

  // Fetch services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user && isAuthenticated) {
      setValue("fullName", user.name || "");
      setValue("email", user.email || "");
      setValue("mobileNumber", user.phone || "");
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
      const formattedDate = format(date, "yyyy-MM-dd");
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
        backgroundColor: "#0ea5e9",
        color: "white",
      },
      dates: [addDays(new Date(), 1), addDays(new Date(), 2)],
    },
  ];

  // Handle form submission
  const onSubmit = async (data) => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (!data.service) {
      toast.error("Please select a service");
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
        healthConcern: data.healthConcern || "",
      };

      const response = await createAppointment(appointmentData);

      if (response?.success) {
        toast.success("Appointment booked successfully! Confirmation sent.");

        // Reset form
        reset();
        setSelectedDate(null);
        setSelectedSlot(null);
        setAvailableSlots([]);

        // Navigate to success page or show confirmation
        navigate("/appointment/success", {
          state: { appointment: response.data },
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected service details
  const selectedServiceId = watch("service");
  const selectedService = services.find((s) => s._id === selectedServiceId);

  return (
    <>
      <Helmet>
        <title>
          Book Appointment | MEDIHOPE Physiotherapy - Schedule Your Visit
        </title>
        <meta
          name="description"
          content="Book your physiotherapy appointment online. Choose from available time slots and services for professional care."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-8">
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
                Schedule your visit with our certified physiotherapists. Choose
                a convenient date and time slot for your consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN – FORM */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-secondary-200 rounded-xl shadow-sm p-5 md:p-6"
                >
                  <h2 className="text-xl font-bold text-secondary-900 mb-4">
                    Appointment Details
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <Input
                        label="Full Name"
                        placeholder="Full name"
                        leftIcon={<FaUser />}
                        error={errors.fullName?.message}
                        {...register("fullName", { required: "Required" })}
                      />

                      {/* Mobile */}
                      <Input
                        label="Mobile Number"
                        placeholder="10-digit number"
                        leftIcon={<FaPhone />}
                        error={errors.mobileNumber?.message}
                        {...register("mobileNumber", { required: "Required" })}
                      />

                      {/* Email */}
                      <Input
                        label="Email Address"
                        placeholder="Email address"
                        leftIcon={<FaEnvelope />}
                        error={errors.email?.message}
                        {...register("email")}
                      />

                      {/* Service */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Service Required{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaStethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                          <select
                            className="w-full pl-10 pr-3 py-2.5 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            {...register("service", { required: true })}
                          >
                            <option value="">Select service</option>
                            {services.map((service) => (
                              <option key={service._id} value={service._id}>
                                {service.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Appointment Date <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 text-sm" />

                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          filterDate={isDateEnabled}
                          highlightDates={highlightDates}
                          placeholderText="Select date"
                          dateFormat="dd MMM yyyy"
                          className="
                              w-full
                              h-[44px]
                              text-sm
                              rounded-lg
                              border border-secondary-300
                              bg-white
                              pl-10 pr-3
                              focus:outline-none
                              focus:ring-2
                              focus:ring-primary-500
                              focus:border-primary-500
                            "
                        />
                      </div>

                      <p className="text-xs text-secondary-500 mt-1">
                        Mon–Sat (9:00 AM – 7:00 PM), Sunday Closed
                      </p>
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Time Slots ({format(selectedDate, "dd MMM yyyy")})
                        </label>

                        {loadingSlots ? (
                          <div className="py-6 flex justify-center">
                            <Loader size="sm" />
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="py-6 text-center text-sm text-secondary-500 bg-secondary-50 rounded-lg">
                            No slots available for this date
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 text-xs gap-2">
                            {availableSlots.map((slot, index) => (
                              <TimeSlot
                                key={slot}
                                slot={slot}
                                index={index}
                                isSelected={selectedSlot === slot}
                                onClick={() => setSelectedSlot(slot)}
                              />
                            ))}
                          </div>
                        )}

                        {selectedSlot && (
                          <p className="text-xs text-green-600 mt-2">
                            Selected: {selectedSlot.replace("-", " to ")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Health Concern */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Health Concern (optional)
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        placeholder="Brief description..."
                        {...register("healthConcern")}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="md"
                      fullWidth
                      loading={isSubmitting}
                      disabled={isSubmitting || !selectedDate || !selectedSlot}
                    >
                      {isSubmitting
                        ? "Booking Appointment…"
                        : "Confirm Appointment"}
                    </Button>
                  </form>
                </motion.div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* Booking Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-secondary-200 rounded-xl p-5 shadow-sm"
                >
                  <h3 className="text-lg font-bold mb-3">Booking Summary</h3>

                  <div className="space-y-3 text-sm">
                    {selectedService && (
                      <div className="pb-3 border-b border-secondary-100">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {selectedService.title}
                          </span>
                          <span className="font-semibold">
                            ₹{selectedService.price}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-500">
                          Duration: {selectedService.duration} minutes
                        </p>
                      </div>
                    )}

                    {selectedDate && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <FaCalendarAlt className="text-secondary-400" />
                        {format(selectedDate, "EEEE, dd MMMM yyyy")}
                      </div>
                    )}

                    {selectedSlot && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <FaClock className="text-secondary-400" />
                        {selectedSlot.replace("-", " to ")}
                      </div>
                    )}

                    {selectedService && selectedDate && selectedSlot && (
                      <div className="pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-primary-600">
                            ₹{selectedService.price}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">
                          Payment at clinic after consultation
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Instructions */}
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm">
                  <h3 className="font-semibold mb-2">📋 What to Expect</h3>
                  <ul className="space-y-1.5 text-secondary-600">
                    <li>• SMS & Email confirmation</li>
                    <li>• Arrive 10 minutes early</li>
                    <li>• Bring medical reports</li>
                    <li>• Wear comfortable clothing</li>
                  </ul>
                </div>

                {/* Emergency */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    ⚠️ Need Immediate Help?
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    For emergencies or severe pain, call us directly:
                  </p>
                  <a
                    href="tel:+91-6386065599"
                    className="inline-flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <FaPhone className="mr-2" />
                    Emergency: +91-6386065599
                  </a>
                </div>
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
                  <p>
                    Cancel or reschedule at least 6 hours before your
                    appointment to avoid charges.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Late Arrival</h4>
                  <p>
                    Arriving late may reduce your treatment time or require
                    rescheduling.
                  </p>
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
