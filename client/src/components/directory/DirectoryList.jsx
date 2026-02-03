import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaUser } from 'react-icons/fa';

const DirectoryList = ({ data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No {type} entries found
        </h3>
        <p className="text-gray-600">
          Check back soon for updates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((stateGroup, index) => (
        <motion.div
          key={stateGroup.state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* State Header */}
          <div className="bg-primary-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FaMapMarkerAlt className="mr-3" />
              {stateGroup.state}
            </h2>
            <p className="text-primary-100 text-sm mt-1">
              {stateGroup.entries.length} {type} entries
            </p>
          </div>

          {/* Entries Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUser className="mr-2" size={12} />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaPhoneAlt className="mr-2" size={12} />
                      Mobile Number
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stateGroup.entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {entry.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${entry.mobile}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {entry.mobile}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 max-w-md">
                        {entry.address}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DirectoryList;