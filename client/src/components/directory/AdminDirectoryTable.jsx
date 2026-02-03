import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaHome
} from 'react-icons/fa';
import Button from '../common/Button';
import Input from '../common/Input';

const AdminDirectoryTable = ({
  data,
  type,
  loading,
  onEdit,
  onDelete,
  onView,
  onAddNew,
  onFilterChange,
  states = [],
  currentFilters = {}
}) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Flatten data for table view
  const flatData = data?.flatMap(stateGroup => 
    stateGroup.entries.map(entry => ({
      ...entry,
      state: stateGroup.state
    }))
  ) || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search names..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by State
            </label>
            <select
              value={localFilters.state || 'all'}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={onAddNew}
              className="w-full bg-primary-600 hover:bg-primary-700"
            >
              Add New {type} Entry
            </Button>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                const resetFilters = { search: '', state: 'all' };
                setLocalFilters(resetFilters);
                if (onFilterChange) onFilterChange(resetFilters);
              }}
              fullWidth
            >
              <FaFilter className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total {type} Entries</p>
              <p className="text-2xl font-bold text-gray-900">
                {flatData.length}
              </p>
            </div>
            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
              <FaUser className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">States Covered</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(flatData.map(item => item.state)).size}
              </p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <FaMapMarkerAlt className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Latest Update</p>
              <p className="text-lg font-bold text-gray-900">
                {flatData.length > 0 
                  ? new Date(Math.max(...flatData.map(d => new Date(d.updatedAt || d.createdAt)))).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
            <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
              <FaHome className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {flatData.map((entry) => (
                  <motion.tr
                    key={entry._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" size={12} />
                        <span className="font-medium text-gray-900">
                          {entry.state}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {entry.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaPhoneAlt className="mr-2 text-gray-400" size={12} />
                        <span className="font-mono text-gray-700">
                          {entry.mobile}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 max-w-xs truncate">
                        {entry.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {entry.createdAtFormatted || 
                          new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onView && onView(entry)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => onEdit && onEdit(entry)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit Entry"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(entry._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Entry"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && flatData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {type} entries found
            </h3>
            <p className="text-gray-600 mb-6">
              {localFilters.search || localFilters.state !== 'all'
                ? 'Try changing your filter criteria'
                : `No ${type} entries available. Add your first entry!`}
            </p>
            <Button onClick={onAddNew}>
              Add First {type} Entry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDirectoryTable;