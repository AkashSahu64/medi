import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaCalendar, FaMapMarkerAlt, FaGraduationCap, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { getCourseById } from '../utils/courseData';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCourse = getCourseById(courseId);
    setCourse(foundCourse);
    setLoading(false);
  }, [courseId]);

  const handleWhatsAppClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!course) return;
    const message = `Hi, I'm interested in the ${course.title} course. Can you provide registration details?`;
    const url = `https://wa.me/${course.content?.mainWhatsApp || '9811860004'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCallClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!course) return;
    window.location.href = `tel:${course.content?.contactNumbers?.[0] || '9811860004'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link 
            to="/courses-workshop" 
            className="inline-flex items-center text-[#0077B6] hover:text-[#005B8D] font-semibold"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { content } = course;

  return (
    <>
      <Helmet>
        <title>{course.title} - {course.subtitle} | MEDIHOPE Courses</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Back Navigation */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link
              to="/courses-workshop"
              className="inline-flex items-center text-[#0077B6] hover:text-[#005B8D] font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Back to Courses
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className={`bg-gradient-to-r from-[#0077B6] to-[#005B8D] text-white py-12`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <span className="px-4 py-1 bg-white/30 backdrop-blur-sm rounded-full text-sm font-semibold">
                  ENROLLMENT OPEN
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl opacity-90 mb-6">{course.subtitle}</p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-white text-[#0077B6] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center"
                >
                  <FaWhatsapp className="mr-2" />
                  Enroll via WhatsApp
                </button>
                <button
                  onClick={handleCallClick}
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold flex items-center"
                >
                  <FaPhone className="mr-2" />
                  Call for Details
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Intro Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-[#0077B6] mr-3">#</span>
                  Course Overview
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border-l-4 border-[#0077B6] rounded-r">
                    <p className="text-gray-800 font-medium">{content.intro}</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
                    <p className="text-gray-800 font-semibold">{content.importantNote}</p>
                  </div>
                  
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                    <p className="text-gray-800">{content.clarification}</p>
                  </div>
                </div>
              </motion.div>

              {/* Clinical Expertise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-[#0077B6] mr-3">#</span>
                  Clinical Expertise of {course.title} Practitioner
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.clinicalExpertise.map((skill, index) => (
                    <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                      <FaCheckCircle className="text-[#0077B6] mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-gray-800">{content.teachingApproach}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    This presents a valuable opportunity for physiotherapists to enhance their skills and knowledge.
                  </p>
                </div>
              </motion.div>

              {/* Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaCalendar className="text-[#0077B6] mr-3" />
                  Schedule & Format
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{content.schedule}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#0077B6]/5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {content.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <span className="w-2 h-2 bg-[#0077B6] rounded-full mr-3"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#0077B6]/5 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Duration:</h4>
                      <p className="text-3xl font-bold text-[#0077B6] mb-2">5+5 Days</p>
                      <p className="text-gray-700">of Hands-on Classes</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Conditions Handled */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  You would be able to handle:
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {content.conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 hover:bg-[#0077B6]/5 hover:border-[#0077B6]/20 border border-gray-200 rounded-lg transition-all"
                    >
                      <span className="text-gray-700 text-sm">{condition}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm p-6 sticky top-24"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Information</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[#0077B6]/5 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaGraduationCap className="text-[#0077B6] mr-3" />
                      <span className="font-semibold text-gray-900">Certification</span>
                    </div>
                    <p className="text-gray-700 text-sm">{content.certification}</p>
                  </div>
                  
                  <div className="p-4 bg-[#0077B6]/5 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="text-[#0077B6] mr-3" />
                      <span className="font-semibold text-gray-900">Location</span>
                    </div>
                    <p className="text-gray-700 text-sm">{content.location}</p>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h4 className="font-bold text-gray-900 mb-4">Contact Details</h4>
                    <div className="space-y-3">
                      {content.contactNumbers.map((number, index) => (
                        <a
                          key={index}
                          href={`tel:${number}`}
                          onClick={handleCallClick}
                          className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center font-semibold text-gray-900 transition-colors"
                        >
                          {number}
                        </a>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full mt-4 bg-[#25D366] hover:bg-[#1DA851] text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                    >
                      <FaWhatsapp className="mr-2 text-xl" />
                      WhatsApp for Enrollment
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#0077B6] to-[#005B8D] text-white rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">Limited Seats Available</h3>
                <p className="text-white/90 mb-6 text-sm">
                  This is the final batch of {course.title} Course offered after April 2026.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-white text-[#0077B6] hover:bg-gray-100 py-3 rounded-lg font-bold flex items-center justify-center"
                >
                  <FaWhatsapp className="mr-2" />
                  Secure Your Seat Now
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Fixed CTA (Mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex space-x-3">
            <button
              onClick={handleCallClick}
              className="flex-1 bg-[#0077B6] text-white py-3 rounded-lg font-semibold flex items-center justify-center"
            >
              <FaPhone className="mr-2" />
              Call Now
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-[#25D366] text-white py-3 rounded-lg font-semibold flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;