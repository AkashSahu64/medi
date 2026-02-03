import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaEye } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi, I'm interested in the ${course.title} course. Can you provide more details?`;
    const url = `https://wa.me/${course.whatsappNumber || '6386065599'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleShowDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/courses-workshop/${course.id}`);
  };

  const imageSrc = course.image || course.placeholderImage;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE SECTION (IMAGE DECIDES CARD SIZE) */}
      <div className="relative">
        <motion.img
          src={imageSrc}
          alt={course.title}
          className="w-full h-auto object-contain"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.85 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
        />

        {/* HOVER CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 p-5 flex flex-col justify-between text-white"
        >
          {/* STATUS */}
          <div className="flex justify-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.isActive
                  ? 'bg-[#0077B6]'
                  : 'bg-gray-700/80'
              }`}
            >
              {course.isActive ? 'ENROLLING NOW' : 'COMING SOON'}
            </span>
          </div>

          {/* INFO */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{course.title}</h3>
            <p className="text-sm font-medium text-white/90">
              {course.subtitle}
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-3">
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-[#25D366] hover:bg-[#1DA851] py-2 rounded-lg flex items-center justify-center text-sm font-semibold"
            >
              <FaWhatsapp className="mr-2" />
              WhatsApp
            </button>

            <button
              onClick={handleShowDetails}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg flex items-center justify-center text-sm font-semibold border border-white/30"
            >
              <FaEye className="mr-2" />
              Show Details
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseCard;
