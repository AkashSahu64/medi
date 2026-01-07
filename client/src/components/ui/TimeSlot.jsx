import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/helpers';

const TimeSlot = ({ 
  slot, 
  isSelected, 
  isBooked, 
  onClick,
  index 
}) => {
  const formattedTime = formatTime(slot);
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: isBooked ? 1 : 1.05 }}
      whileTap={{ scale: isBooked ? 1 : 0.95 }}
      onClick={() => !isBooked && onClick()}
      disabled={isBooked}
      className={`
        p-4 rounded-lg text-center transition-all duration-300
        ${isSelected 
          ? 'bg-primary-600 text-white shadow-lg' 
          : isBooked 
            ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed' 
            : 'bg-white text-secondary-700 hover:bg-primary-50 hover:text-primary-600 border-2 border-secondary-200 hover:border-primary-500'
        }
      `}
    >
      <div className="font-medium">{formattedTime}</div>
      <div className="text-sm mt-1">
        {isBooked ? 'Booked' : 'Available'}
      </div>
    </motion.button>
  );
};

export default TimeSlot;