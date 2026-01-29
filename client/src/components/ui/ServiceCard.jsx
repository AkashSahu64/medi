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

  // Get appropriate icon based on category
  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'musculoskeletal': return <FaStethoscope />;
      case 'neurological': return <FaUserMd />;
      case 'sports': return <FaCheckCircle />;
      case 'pediatric': return <FaUserMd />;
      case 'geriatric': return <FaUserMd />;
      case 'postoperative': return <FaStethoscope />;
      default: return <FaStethoscope />;
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden h-full">
      {/* Header with Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image?.url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-cyan-600">
              {getCategoryIcon(category)}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {SERVICE_CATEGORY_LABELS[category] || category}
            </span>
          </div>
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Recommended
            </div>
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <FaClock className="text-white" />
            <span className="text-white font-semibold text-sm">{duration} mins</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800/90 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2 h-10">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-3 h-12">
          {description}
        </p>

        {/* Benefits List */}
        {benefits.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Key Benefits
            </h4>
            <ul className="space-y-1.5">
              {benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <span className="inline-block w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="line-clamp-1">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            {showPrice && price ? (
              <>
                <div className="text-xs text-gray-500 mb-1">Starting from</div>
                <div className="flex items-center text-2xl font-bold text-gray-900">
                  <FaRupeeSign className="text-gray-700 text-lg" />
                  <span>{price}</span>
                  <span className="text-sm font-normal text-gray-500 ml-1">/session</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-1">Contact for pricing</div>
                <div className="flex items-center text-lg font-bold text-cyan-600">
                  <FaPhoneAlt className="mr-2" />
                  <span>Call for Quote</span>
                </div>
              </>
            )}
          </div>
          
          <Link 
            to={`/appointment?service=${_id}`}
            className="group"
          >
            <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-5 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg">
              <span>{showPrice && price ? 'Book Now' : 'Inquire Now'}</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;