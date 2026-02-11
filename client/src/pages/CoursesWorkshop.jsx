import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import CourseCard from '../components/course/CourseCard';
import { courses } from '../utils/courseData';

const CoursesWorkshop = () => {
  return (
    <>
      <Helmet>
        <title>Courses & Workshops | MEDIHOPE Physiotherapy</title>
        <meta name="description" content="Professional physiotherapy courses and workshops to enhance your skills and knowledge in modern treatment techniques." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0077B6] to-[#005B8D] text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Courses & Workshops
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Advance your skills with specialized training programs designed for modern healthcare professionals
              </p>
              <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">Enrollment Open</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Programs
            </h2>
            <p className="text-gray-600 max-w-4xl mx-auto text-lg">
              Explore our range of professional programs, thoughtfully designed to enhance your clinical expertise and practical skills. Each course is structured to support continuous learning, improve patient outcomes, and elevate the overall quality of your clinical practice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-[#0077B6] to-[#005B8D] rounded-2xl shadow-lg p-8 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Why Choose Our Courses?
              </h3>
              <div className="w-24 h-1 bg-[#f4f5f6] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <div className="w-16 h-16 bg-[#0077B6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Industry Experts</h4>
                <p className="text-gray-600 text-sm">
                  Learn from experienced practitioners with years of clinical expertise
                </p>
              </div>

              <div className="text-center p-6 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <div className="w-16 h-16 bg-[#0077B6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🖐️</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Hands-on Training</h4>
                <p className="text-gray-600 text-sm">
                  Practical sessions with live demonstrations and supervised practice
                </p>
              </div>

              <div className="text-center p-6 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <div className="w-16 h-16 bg-[#0077B6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📜</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Certification</h4>
                <p className="text-gray-600 text-sm">
                  Receive recognized certificates from accredited institutions
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CoursesWorkshop;