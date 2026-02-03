import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminDirectoryTable from '../../components/directory/AdminDirectoryTable';
import DirectoryFormModal from '../../components/directory/DirectoryFormModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { directoryService } from '../../services/directory.service';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const DirectoryManagement = () => {
  const [activeTab, setActiveTab] = useState('FOMT');
  const [fomtData, setFomtData] = useState([]);
  const [fnmtData, setFnmtData] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    state: 'all'
  });
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const currentData = activeTab === 'FOMT' ? fomtData : fnmtData;
  
  // Load data
  const loadData = useCallback(async (type = activeTab) => {
    try {
      setLoading(true);
      
      const [dataResponse, statesResponse] = await Promise.all([
        directoryService.getDirectories(type, filters.state === 'all' ? null : filters.state),
        directoryService.getStates()
      ]);
      
      if (dataResponse.success) {
        if (type === 'FOMT') {
          setFomtData(dataResponse.data);
        } else {
          setFnmtData(dataResponse.data);
        }
      }
      
      if (statesResponse.success) {
        setStates(statesResponse.data);
      }
    } catch (error) {
      console.error('Error loading directory data:', error);
      toast.error('Failed to load directory data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters.state]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Apply search filter
  const filteredData = React.useMemo(() => {
    if (!filters.search) return currentData;
    
    const searchTerm = filters.search.toLowerCase();
    return currentData.map(stateGroup => ({
      ...stateGroup,
      entries: stateGroup.entries.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm) ||
        entry.mobile.includes(searchTerm) ||
        entry.address.toLowerCase().includes(searchTerm)
      )
    })).filter(stateGroup => stateGroup.entries.length > 0);
  }, [currentData, filters.search]);
  
  // Handlers
  const handleAddNew = () => {
    setSelectedEntry(null);
    setIsFormModalOpen(true);
  };
  
  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsFormModalOpen(true);
  };
  
  const handleView = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    
    try {
      const response = await directoryService.deleteDirectory(id);
      
      if (response.success) {
        toast.success('Entry deleted successfully');
        loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting directory:', error);
      toast.error('Failed to delete entry');
    }
  };
  
  const handleSubmit = async (formData, id = null) => {
    setFormLoading(true);
    
    try {
      let response;
      
      if (id) {
        // Update existing
        response = await directoryService.updateDirectory(id, formData);
      } else {
        // Create new
        response = await directoryService.createDirectory(formData);
      }
      
      if (response.success) {
        toast.success(id ? 'Entry updated successfully' : 'Entry added successfully');
        setIsFormModalOpen(false);
        loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving directory:', error);
      toast.error(error.response?.data?.message || 'Failed to save entry');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({ search: '', state: 'all' });
  };
  
  const tabs = [
    { id: 'FOMT', label: 'FOMT Directory', color: 'primary' },
    { id: 'FNMT', label: 'FNMT Directory', color: 'green' }
  ];
  
  return (
    <>
      <Helmet>
        <title>Directory Management | MEDIHOPE Admin</title>
      </Helmet>
      
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Directory Management
            </h1>
            <p className="text-gray-600">
              Manage FOMT and FNMT directory entries
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-sm`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <AdminDirectoryTable
          data={filteredData}
          type={activeTab}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onAddNew={handleAddNew}
          onFilterChange={handleFilterChange}
          states={states}
          currentFilters={filters}
        />
      </div>
      
      {/* Form Modal */}
      <DirectoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        entry={selectedEntry}
        type={activeTab}
        states={states}
        onSubmit={handleSubmit}
        loading={formLoading}
      />
      
      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEntry(null);
        }}
        title="Directory Entry Details"
        size="md"
      >
        {selectedEntry && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <p className="mt-1 font-semibold">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedEntry.type === 'FOMT'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedEntry.type}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">State</h4>
                <p className="mt-1 font-medium">{selectedEntry.state}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="mt-1 font-medium">{selectedEntry.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Mobile Number</h4>
              <p className="mt-1 font-medium">
                <a
                  href={`tel:${selectedEntry.mobile}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {selectedEntry.mobile}
                </a>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                {selectedEntry.address}
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created: {selectedEntry.createdAtFormatted || 'N/A'}</span>
                <span>Updated: {selectedEntry.updatedAt ? new Date(selectedEntry.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DirectoryManagement;