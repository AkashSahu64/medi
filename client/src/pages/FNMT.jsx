import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Loader from '../components/common/Loader';
import DirectoryList from '../components/directory/DirectoryList';
import { directoryService } from '../services/directory.service';

const FNMT = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await directoryService.getDirectories('FNMT');
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to load FNMT data');
      }
    } catch (error) {
      console.error('Error loading FNMT data:', error);
      setError('Failed to load FNMT directory. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>FNMT Directory | MEDIHOPE Physiotherapy</title>
        <meta name="description" content="Find FNMT (Friends of Naturopathy & Medical Tourism) contacts across different states" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FNMT Directory
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Find Friends of Naturopathy & Medical Tourism (FNMT) contacts across different states.
              Connect with holistic healthcare facilitators for your wellness journey.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {data.reduce((total, state) => total + state.entries.length, 0)}
                  </div>
                  <div className="text-green-100">Total Contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{data.length}</div>
                  <div className="text-green-100">States Covered</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Directory List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Unable to load directory
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={loadData}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <DirectoryList data={data} type="FNMT" />
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About FNMT
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                FNMT (Friends of Naturopathy & Medical Tourism) are specialized facilitators 
                who bridge traditional naturopathy with modern medical tourism. They help 
                patients explore holistic treatment options, natural therapies, and 
                wellness retreats.
              </p>
              <p className="mt-4">
                This directory connects patients with trusted FNMT professionals who provide 
                guidance on naturopathic treatments, yoga therapy, Ayurveda, and integrative 
                healthcare approaches.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FNMT;