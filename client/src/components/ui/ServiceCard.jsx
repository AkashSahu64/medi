import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaRupeeSign, FaStar } from 'react-icons/fa';
import { SERVICE_CATEGORY_LABELS } from '../../utils/constants';

const ServiceCard = ({ service, index }) => {
  const {
    _id,
    title,
    description,
    duration,
    price,
    category,
    image,
    benefits = [],
    featured = false,
  } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group overflow-hidden"
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}
      
      {/* Service Image */}
      <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={image || '/api/placeholder/400/300'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Service Content */}
      <div>
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-3">
          {SERVICE_CATEGORY_LABELS[category] || category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-secondary-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-secondary-700 mb-2">Key Benefits:</h4>
            <ul className="space-y-1">
              {benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-center text-sm text-secondary-600">
                  <FaStar className="text-yellow-500 mr-2 text-xs" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-secondary-600">
              <FaClock className="mr-2" />
              <span className="text-sm">{duration} mins</span>
            </div>
            <div className="flex items-center text-secondary-600">
              <FaRupeeSign className="mr-1" />
              <span className="text-sm font-semibold">{price}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/appointment?service=${_id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Book Appointment
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;