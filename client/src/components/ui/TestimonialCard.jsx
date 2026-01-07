import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ testimonial, index }) => {
  const { patientName, patientAge, condition, content, rating, image } = testimonial;

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${
            i <= rating ? 'text-yellow-500' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 h-full"
    >
      {/* Quote Icon */}
      <div className="text-primary-100 mb-4">
        <FaQuoteLeft size={32} />
      </div>

      {/* Testimonial Content */}
      <p className="text-secondary-600 italic mb-6 line-clamp-4">
        "{content}"
      </p>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex mr-2">{renderStars()}</div>
        <span className="text-sm font-semibold text-secondary-700">
          {rating}/5
        </span>
      </div>

      {/* Patient Info */}
      <div className="flex items-center">
        {image && (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img
              src={image}
              alt={patientName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="font-semibold text-secondary-900">{patientName}</h4>
          <p className="text-sm text-secondary-600">
            {patientAge && `${patientAge} yrs • `}
            Treated for {condition}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;