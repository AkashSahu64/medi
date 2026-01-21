import React from 'react';
import {
  FaStar,
  FaQuoteLeft,
  FaUserMd,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';

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

  // Star rating renderer
  const renderStars = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className={`${
            i <= rating ? 'text-yellow-500' : 'text-gray-300'
          } text-base sm:text-lg`}
        />
      ))}
      <span className="ml-2 text-xs sm:text-sm font-semibold text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );

  return (
    <div
      className="
        group
        bg-white rounded-2xl
        shadow-xl hover:shadow-2xl
        transition-all duration-300
        border border-gray-100
        h-full flex flex-col
        mb-2
        min-h-[360px] md:min-h-[420px]
      "
    >
      {/* ================= Header ================= */}
      <div className="
        relative
        bg-gradient-to-r from-cyan-600 to-cyan-500
        text-white
        p-4 md:p-6
        rounded-t-2xl
      ">
        {/* Quote Icon */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <FaQuoteLeft className="text-2xl md:text-3xl text-white/30" />
        </div>

        {/* Patient Info */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/40">
              <img
                src={
                  image ||
                  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'
                }
                alt={patientName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white p-1 rounded-full">
              <FaCheckCircle className="text-[10px]" />
            </div>
          </div>

          {/* Name & Meta */}
          <div className="flex-1">
            <h4 className="text-lg sm:text-xl font-bold">
              {patientName}
            </h4>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-cyan-100 mt-1">
              <span className="flex items-center">
                <FaUserMd className="mr-1" />
                {patientAge} years
              </span>

              <span className="h-3 w-px bg-cyan-400 hidden sm:block" />

              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                {condition}
              </span>
            </div>
          </div>
        </div>

        {/* Treatment Info */}
        <div className="mt-4 pt-4 border-t border-cyan-400/30">
          <div className="
            flex flex-col sm:flex-row
            sm:items-center sm:justify-between
            gap-2
            text-xs sm:text-sm
          ">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span className="font-medium">{treatment}</span>
            </div>

            <div className="bg-white/20 px-3 py-1 rounded-full font-semibold w-fit">
              {duration}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Body ================= */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Rating */}
        <div className="mb-4 sm:mb-6">
          {renderStars()}
        </div>

        {/* Testimonial Text */}
        <div className="flex-1">
          <div className="relative">
            <FaQuoteLeft className="absolute -top-2 -left-1 text-cyan-200 text-xl sm:text-2xl" />
            <p
              className="
                text-gray-700
                text-xs sm:text-sm
                leading-relaxed
                pl-6
                line-clamp-5 sm:line-clamp-4
              "
            >
              “{content}”
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Recovery Progress */}
        <div className="mt-auto">
          <div className="text-[10px] sm:text-xs text-gray-500 mb-2 font-medium">
            Recovery Progress
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
              style={{ width: `${rating * 20}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mt-1">
            <span>Before</span>
            <span className="font-semibold">After Treatment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
