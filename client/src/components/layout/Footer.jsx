import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaWhatsapp,
  FaClock
} from 'react-icons/fa';
import { CLINIC_INFO } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/appointment', label: 'Book Appointment' },
    { path: '/contact', label: 'Contact' },
  ];

  const services = [
    'Musculoskeletal Physiotherapy',
    'Sports Injury Rehabilitation',
    'Neurological Rehabilitation',
    'Pediatric Physiotherapy',
    'Geriatric Care',
    'Post-Operative Rehabilitation',
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Clinic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">M</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">MEDIHOPE</h3>
                <p className="text-secondary-300 text-sm">Physiotherapy Centre</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-6">
              Professional physiotherapy care for a pain-free life. 
              Evidence-based treatments for pain relief, mobility & recovery.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-secondary-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-secondary-300 hover:text-white transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                <p className="text-secondary-300">{CLINIC_INFO.address}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-primary-400" />
                <a 
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  {CLINIC_INFO.phone}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400" />
                <a 
                  href={`mailto:${CLINIC_INFO.email}`}
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  {CLINIC_INFO.email}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaClock className="text-primary-400" />
                <div>
                  <p className="text-secondary-300">Mon-Fri: {CLINIC_INFO.workingHours.weekdays}</p>
                  <p className="text-secondary-300">Saturday: {CLINIC_INFO.workingHours.saturday}</p>
                  <p className="text-secondary-300">Sunday: {CLINIC_INFO.workingHours.sunday}</p>
                </div>
              </div>
              
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaWhatsapp />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-secondary-800">
        <div className="container-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              &copy; {currentYear} MEDIHOPE Physiotherapy Centre. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-secondary-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-secondary-400 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;