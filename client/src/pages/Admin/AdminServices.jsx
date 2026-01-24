import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { serviceService } from '../../services/service.service';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaFilter,
  FaClock,
  FaRupeeSign,
  FaStar,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalType, setModalType] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { execute: fetchServices } = useApi(serviceService.getAllServices);
  const { execute: createService } = useApi(serviceService.createService);
  const { execute: updateService } = useApi(serviceService.updateService);
  const { execute: deleteService } = useApi(serviceService.deleteService);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch
  } = useForm();

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, services]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await fetchServices();
      if (response?.data) {
        setServices(response.data);
        setFilteredServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setModalType('create');
    reset({
      title: '',
      description: '',
      category: SERVICE_CATEGORIES.MUSCULOSKELETAL,
      duration: 30,
      price: '',
      benefits: [''],
      featured: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setModalType('edit');
    reset({
      title: service.title,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      benefits: service.benefits,
      featured: service.featured,
      isActive: service.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        toast.success('Service deleted successfully');
        loadServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const handleStatusToggle = async (service) => {
    try {
      await updateService(service._id, { isActive: !service.isActive });
      toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'}`);
      loadServices();
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (modalType === 'create') {
        await createService(data);
        toast.success('Service created successfully');
      } else {
        await updateService(selectedService._id, data);
        toast.success('Service updated successfully');
      }
      setIsModalOpen(false);
      loadServices();
    } catch (error) {
      toast.error(`Failed to ${modalType} service`);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    ...Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
  ];

  return (
    <>
      <Helmet>
        <title>Services Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600">Manage all physiotherapy services and treatments</p>
          </div>
          <Button onClick={handleCreate}>
            <FaPlus className="mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Services
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end py-1">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-6">🩺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'No services added yet'}
            </p>
            <Button onClick={handleCreate}>
              <FaPlus className="mr-2" />
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Service Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-2">
                        {SERVICE_CATEGORY_LABELS[service.category] || service.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {service.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                      <button
                        onClick={() => handleStatusToggle(service)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          service.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          service.isActive ? 'left-7' : 'left-1'
                        }`}></span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      {service.duration} mins
                    </div>
                    <div className="flex items-center font-semibold text-gray-900">
                      <FaRupeeSign className="mr-1" />
                      {service.price}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {service.benefits?.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <FaStar className="text-yellow-500 mr-2 text-xs" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg text-sm font-medium"
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                      >
                        <FaTrash className="inline mr-2" />
                        Delete
                      </button>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Add New Service' : 'Edit Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 px-4 md:px-6 pb-4">
          <Input
            label="Service Title"
            type="text"
            placeholder="Enter service title"
            error={errors.title?.message}
            required
            {...register('title', {
              required: 'Service title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters'
              }
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter service description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none focus:outline-none"
                {...register('category', { required: 'Category is required' })}
              >
                {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {SERVICE_CATEGORY_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('duration', {
                  required: 'Duration is required',
                  min: { value: 15, message: 'Minimum 15 minutes' },
                  max: { value: 120, message: 'Maximum 120 minutes' }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('isActive')}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits (Add each benefit on a new line)
            </label>
            <textarea
              rows={4}
              placeholder="Enter benefits, one per line..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              {...register('benefits')}
            />
            <p className="mt-1 text-sm text-gray-500">
              Each line will be treated as a separate benefit
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register('featured')}
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Mark as featured service
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {modalType === 'create' ? 'Create Service' : 'Update Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminServices;