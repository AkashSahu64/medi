import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Loader from "../components/common/Loader";
import DirectoryList from "../components/directory/DirectoryList";
import { directoryService } from "../services/directory.service";

const FOMT = () => {
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

      const response = await directoryService.getDirectories("FOMT");

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "Failed to load FOMT data");
      }
    } catch (error) {
      console.error("Error loading FOMT data:", error);
      setError("Failed to load FOMT directory. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>FOMT Practitioner | MEDIHOPE Physiotherapy</title>
        <meta
          name="description"
          content="Find FOMT (Friends of Medical Tourism) contacts across different states"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header + Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              {/* Left Content (3/4) */}
              <div className="lg:col-span-3">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  FOMT Practitioners
                </h1>
                <p className="text-gray-600 text-lg max-w-3xl">
                  Fellowship in Orthopedic Manual Therapy (FOMT) contacts across
                  different states. Connect with medical tourism facilitators
                  for your healthcare journey.
                </p>
              </div>

              {/* Right Stats (1/4) */}
              <div className="bg-transparent border rounded-xl p-6 text-white">
                <div className="flex justify-between items-center text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-600">
                      {data.reduce(
                        (total, state) => total + state.entries.length,
                        0,
                      )}
                    </div>
                    <div className="text-gray-700 text-sm">Total Contacts</div>
                  </div>

                  <div>
                    <div className="text-3xl font-bold text-gray-600">
                      {data.length}
                    </div>
                    <div className="text-gray-700 text-sm">States Covered</div>
                  </div>
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
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <DirectoryList data={data} type="FOMT" />
            )}
          </motion.div>

          {/* Info Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About FOMT
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>
                FOMT (Friends of Medical Tourism) are dedicated facilitators who
                assist patients in navigating medical tourism opportunities.
                They provide guidance on treatment options, hospital selection,
                travel arrangements, and local support.
              </p>
              <p className="mt-4">
                This directory helps patients connect with trusted FOMT
                professionals across different states for seamless medical
                tourism experiences.
              </p>
            </div>
          </motion.div> */}
        </div>
      </div>
    </>
  );
};

export default FOMT;
