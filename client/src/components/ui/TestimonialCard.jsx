import React from 'react';
import { FaStar, FaQuoteLeft, FaUserMd, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const TestimonialCard = ({ testimonial }) => {
  const { 
    patientName, 
    patientAge, 
    condition, 
    content, 
    rating, 
    image,
    treatment,
    duration
  } = testimonial;

  // Generate star rating
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <FaStar
            key={i}
            className={`${
              i <= rating ? 'text-yellow-500' : 'text-gray-300'
            } text-lg`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="group min-h-[420px] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col mb-2">
      {/* Card Header with Gradient */}
      <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 text-white p-6 rounded-t-2xl">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6">
          <FaQuoteLeft className="text-3xl text-white/30" />
        </div>
        
        {/* Patient Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/40">
              <img
                src={image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                alt={patientName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white p-1 rounded-full">
              <FaCheckCircle className="text-xs" />
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold">{patientName}</h4>
            <div className="flex items-center space-x-3 text-sm text-cyan-100 mt-1">
              <span className="flex items-center">
                <FaUserMd className="mr-1" />
                {patientAge} years
              </span>
              <span className="h-4 w-px bg-cyan-400"></span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {condition}
              </span>
            </div>
          </div>
        </div>
        
        {/* Treatment Info */}
        <div className="mt-4 pt-4 border-t border-cyan-400/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span className="font-medium">{treatment}</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full font-semibold">
              {duration}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Rating */}
        <div className="mb-6">
          {renderStars()}
        </div>

        {/* Testimonial Content */}
        <div className="flex-1">
          <div className="relative">
            <FaQuoteLeft className="absolute -top-2 -left-1 text-cyan-200 text-2xl" />
            <p className="text-gray-700 text-sm leading-relaxed pl-6 line-clamp-4">
              "{content}"
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Recovery Progress */}
        <div className="mt-auto">
          <div className="text-xs text-gray-500 mb-2 font-medium">Recovery Progress</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
              style={{ width: `${rating * 20}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Before</span>
            <span className="font-semibold">After Treatment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;