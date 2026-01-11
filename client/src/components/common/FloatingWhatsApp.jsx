import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes, FaPaperPlane, FaClock, FaPhone } from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsapp}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  const quickMessages = [
    'Hi, I want to book an appointment',
    'Can you tell me about your services?',
    'What are your working hours?',
    'Do you accept insurance?',
    'I need emergency consultation'
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp size={24} />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
          1
        </span>
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <FaWhatsapp size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">MEDIHOPE Support</h3>
                    <p className="text-sm text-green-100">Typically replies within 15 minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {/* Welcome Message */}
                <div className="mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 inline-block max-w-[80%]">
                    <p className="text-sm text-gray-800">
                      👋 Hello! Welcome to MEDIHOPE Physiotherapy. How can we help you today?
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">Just now</p>
                </div>

                {/* Quick Messages */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Quick messages:</p>
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(msg)}
                      className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      {msg}
                    </button>
                  ))}
                </div>

                {/* Clinic Info */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-cyan-900 text-sm mb-2">
                    📍 Clinic Information
                  </h4>
                  <div className="space-y-1 text-xs text-cyan-800">
                    <p className="flex items-center">
                      <FaClock className="mr-2" />
                      {CLINIC_INFO.workingHours.weekdays} (Mon-Fri)
                    </p>
                    <p className="flex items-center">
                      <FaClock className="mr-2" />
                      {CLINIC_INFO.workingHours.saturday} (Sat)
                    </p>
                    <p className="flex items-center">
                      <FaPhone className="mr-2" />
                      Emergency: {CLINIC_INFO.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`p-3 rounded-lg ${
                      message.trim()
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click send to open WhatsApp conversation
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingWhatsApp;