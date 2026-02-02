import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
  FaUserMd,
  FaStethoscope,
  FaArrowRight,
  FaPhoneAlt
} from 'react-icons/fa';
import { SERVICE_CATEGORY_LABELS } from '../../utils/constants';

const ServiceCard = ({ service }) => {
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
    showPrice = true,
  } = service;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'musculoskeletal':
        return <FaStethoscope />;
      case 'neurological':
        return <FaUserMd />;
      case 'sports':
        return <FaCheckCircle />;
      case 'pediatric':
      case 'geriatric':
        return <FaUserMd />;
      case 'postoperative':
        return <FaStethoscope />;
      default:
        return <FaStethoscope />;
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* IMAGE */}
      <div className="relative aspect-[16/7] overflow-hidden">
        <img
          src={
            image?.url ||
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-cyan-600 text-sm">
              {getCategoryIcon(category)}
            </span>
            <span className="text-xs font-semibold text-gray-800 truncate">
              {SERVICE_CATEGORY_LABELS[category] || category}
            </span>
          </div>
        </div>

        {/* Featured */}
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Recommended
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-cyan-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {description}
        </p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="mb-1">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <FaCheckCircle className="text-green-500 mr-2 text-xs" />
              Key Benefits
            </h4>
            <ul className="space-y-1">
              {benefits.slice(0, 2).map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-xs text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{benefit}</span>
                </li>
              ))}
              {benefits[2] && (
                <li className="hidden sm:flex items-start text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{benefits[2]}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-200 my-1" />

        {/* FOOTER */}
        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mb-2">
          
          {/* Price */}
          <div>
            {showPrice && price ? (
              <>
                <div className="text-xs text-gray-500 mb-1">
                  Starting from
                </div>
                <div className="flex items-center text-lg font-bold text-gray-900">
                  <FaRupeeSign className="text-sm mr-1" />
                  {price}
                  <span className="text-xs text-gray-500 ml-1">
                    /session
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-1">
                  Contact for pricing
                </div>
                <div className="flex items-center text-sm font-semibold text-cyan-600">
                  <FaPhoneAlt className="mr-2" />
                  Call for Quote
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <Link to={`/appointment?service=${_id}`} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white px-5 py-3 rounded-lg font-semibold text-sm transition-all shadow-md">
              {showPrice && price ? 'Book Now' : 'Inquire Now'}
              <FaArrowRight className="text-sm" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
