import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | MEDIHOPE Physiotherapy</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-6xl text-primary-600" />
              </div>
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-ping"></div>
            </div>

            {/* Content */}
            <h1 className="text-6xl font-bold text-secondary-900 mb-4">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-secondary-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-secondary-600 mb-8">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search our website..."
                  className="w-full pl-12 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <FaHome className="mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                Go Back
              </Button>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-secondary-200">
              <h4 className="text-sm font-medium text-secondary-700 mb-4">
                Popular Pages
              </h4>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { path: '/services', label: 'Our Services' },
                  { path: '/appointment', label: 'Book Appointment' },
                  { path: '/about', label: 'About Us' },
                  { path: '/contact', label: 'Contact' }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600 mb-2">
                Need immediate help?
              </p>
              <a
                href="tel:+91-9876543210"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Call: +91-9876543210
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;