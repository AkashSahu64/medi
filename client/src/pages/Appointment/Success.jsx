import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaWhatsapp, FaPrint, FaEnvelope, FaPhone } from 'react-icons/fa';
import { formatDate, formatTime } from '../../utils/helpers';

const AppointmentSuccess = () => {
  const location = useLocation();
  const { appointment } = location.state || {};

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (appointment) {
      const message = `My MEDIHOPE Appointment Details:\n\nService: ${appointment.serviceName}\nDate: ${formatDate(appointment.appointmentDate)}\nTime: ${formatTime(appointment.timeSlot)}\nReference ID: ${appointment._id}\n\nPlease find the confirmation attached.`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const handleEmail = () => {
    if (appointment) {
      const subject = `MEDIHOPE Appointment Confirmation - ${appointment._id}`;
      const body = `Appointment Details:\n\nPatient: ${appointment.patientName}\nService: ${appointment.serviceName}\nDate: ${formatDate(appointment.appointmentDate)}\nTime: ${formatTime(appointment.timeSlot)}\nReference ID: ${appointment._id}\n\nThank you for choosing MEDIHOPE Physiotherapy Centre.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">No Appointment Found</h1>
          <Link to="/appointment">
            <Button>Book New Appointment</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Appointment Confirmed | MEDIHOPE Physiotherapy</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-20">
        <div className="container-padding py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            {/* Success Card */}
            <div className="card text-center">
              {/* Success Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-5xl text-green-600" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                Appointment Confirmed! 🎉
              </h1>
              <p className="text-xl text-secondary-600 mb-8">
                Your appointment has been successfully booked. 
                Confirmation details have been sent to your email and phone.
              </p>

              {/* Appointment Details */}
              <div className="bg-secondary-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b border-secondary-200 pb-2">
                  Appointment Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Reference ID:</span>
                    <span className="font-mono font-semibold text-secondary-900">
                      #{appointment._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Patient Name:</span>
                    <span className="font-semibold text-secondary-900">
                      {appointment.patientName}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Service:</span>
                    <span className="font-semibold text-secondary-900">
                      {appointment.serviceName}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Date:</span>
                    <div className="flex items-center font-semibold text-secondary-900">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(appointment.appointmentDate)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Time:</span>
                    <div className="flex items-center font-semibold text-secondary-900">
                      <FaClock className="mr-2" />
                      {formatTime(appointment.timeSlot)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 mb-8 text-left">
                <h4 className="text-lg font-semibold text-cyan-900 mb-3">
                  📋 Before Your Visit
                </h4>
                <ul className="space-y-2 text-cyan-800 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Arrive 10 minutes before your scheduled time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Bring any relevant medical reports, X-rays, or prescriptions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Wear comfortable, loose-fitting clothing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Stay hydrated and avoid heavy meals 2 hours before appointment</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className="flex items-center justify-center"
                  >
                    <FaPrint className="mr-2" />
                    Print
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2" />
                    Share via WhatsApp
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleEmail}
                    className="flex items-center justify-center"
                  >
                    <FaEnvelope className="mr-2" />
                    Email Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Link to="/">
                    <Button variant="secondary" fullWidth>
                      Back to Home
                    </Button>
                  </Link>
                  
                  <Link to="/appointment">
                    <Button fullWidth>
                      Book Another Appointment
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8 pt-8 border-t border-secondary-200">
                <h4 className="text-lg font-semibold text-secondary-900 mb-4">
                  Need to Make Changes?
                </h4>
                <p className="text-secondary-600 mb-4">
                  To reschedule or cancel your appointment, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+91-6386065599"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <FaPhone className="mr-2" />
                    Call: +91-6386065599
                  </a>
                  <a
                    href={`https://wa.me/916386065599`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp className="mr-2" />
                    WhatsApp
                  </a>
                </div>
                <p className="text-sm text-secondary-500 mt-4">
                  Note: Please have your reference ID ready when contacting us.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AppointmentSuccess;