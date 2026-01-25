import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaFilter,
  FaStar,
  FaUser,
  FaCalendar,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { testimonialService } from '../../services/testimonial.service';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [modalType, setModalType] = useState('create');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    approvedTestimonials: 0,
    pendingTestimonials: 0,
    featuredTestimonials: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // all, approved, pending
    featured: 'all' // all, featured, regular
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm();

  useEffect(() => {
    loadTestimonials();
    loadStats();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [filters, testimonials]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      console.log("🔄 Loading testimonials...");
      
      const response = await testimonialService.getTestimonials({
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        featured: filters.featured !== 'all' ? filters.featured : undefined,
      });
      
      console.log("✅ Testimonials loaded:", response.data?.length || 0, "items");
      
      if (response.data) {
        setTestimonials(response.data);
        setFilteredTestimonials(response.data);
      } else {
        console.error("❌ No data in response:", response);
        toast.error("No testimonial data received");
      }
    } catch (error) {
      console.error("❌ Failed to load testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await testimonialService.getTestimonialStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filterTestimonials = () => {
    let filtered = [...testimonials];

    // Filter by search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.patientName.toLowerCase().includes(term) ||
        t.condition.toLowerCase().includes(term) ||
        t.content.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => 
        filters.status === 'approved' ? t.isApproved : !t.isApproved
      );
    }

    // Filter by featured
    if (filters.featured !== 'all') {
      filtered = filtered.filter(t => 
        filters.featured === 'featured' ? t.featured : !t.featured
      );
    }

    setFilteredTestimonials(filtered);
  };

  const handleCreate = () => {
    setSelectedTestimonial(null);
    setModalType('create');
    reset({
      patientName: '',
      patientAge: '',
      condition: '',
      content: '',
      rating: 5,
      isApproved: true,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalType('edit');
    reset({
      patientName: testimonial.patientName,
      patientAge: testimonial.patientAge,
      condition: testimonial.condition,
      content: testimonial.content,
      rating: testimonial.rating,
      isApproved: testimonial.isApproved,
      featured: testimonial.featured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialService.deleteTestimonial(id);
        
        // Update local state
        const updated = testimonials.filter(t => t._id !== id);
        setTestimonials(updated);
        
        toast.success('Testimonial deleted successfully');
        loadStats();
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
        toast.error("Failed to delete testimonial");
      }
    }
  };

  const handleApprove = async (id, approve = true) => {
    try {
      await testimonialService.approveTestimonial(id, approve);
      
      // Update local state
      const updated = testimonials.map(t =>
        t._id === id ? { ...t, isApproved: approve } : t
      );
      setTestimonials(updated);
      
      toast.success(`Testimonial ${approve ? 'approved' : 'rejected'} successfully`);
      loadStats();
    } catch (error) {
      console.error("Failed to approve/reject testimonial:", error);
      toast.error("Failed to update testimonial status");
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await testimonialService.toggleFeatured(id, !currentFeatured);
      
      // Update local state
      const updated = testimonials.map(t =>
        t._id === id ? { ...t, featured: !currentFeatured } : t
      );
      setTestimonials(updated);
      
      toast.success('Featured status updated');
      loadStats();
    } catch (error) {
      console.error("Failed to update featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      if (modalType === 'create') {
        const response = await testimonialService.createTestimonial(data);
        
        // Add new testimonial to the list
        setTestimonials([response.data, ...testimonials]);
        
        toast.success(response.message || 'Testimonial added successfully');
        loadStats();
      } else {
        const response = await testimonialService.updateTestimonial(selectedTestimonial._id, data);
        
        // Update local state
        const updated = testimonials.map(t =>
          t._id === selectedTestimonial._id ? response.data : t
        );
        setTestimonials(updated);
        
        toast.success(response.message || 'Testimonial updated successfully');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to save testimonial:", error);
      const errorMessage = error.response?.data?.message || "Failed to save testimonial";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <Helmet>
        <title>Testimonials Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
            <p className="text-gray-600">Manage patient testimonials and reviews</p>
          </div>
          <Button onClick={handleCreate}>
            <FaPlus className="mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTestimonials}</p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <FaUser className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingTestimonials}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <FaTimes className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.featuredTestimonials}
                </p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaStar className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value });
                    loadTestimonials(); // Fetch from backend with search
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  loadTestimonials(); // Fetch from backend with status filter
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured
              </label>
              <select
                value={filters.featured}
                onChange={(e) => {
                  setFilters({ ...filters, featured: e.target.value });
                  loadTestimonials(); // Fetch from backend with featured filter
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            <div className="flex items-end my-1.5">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({ search: '', status: 'all', featured: 'all' });
                  loadTestimonials();
                }}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-6">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No testimonials found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status !== 'all' || filters.featured !== 'all'
                ? 'Try changing your filter criteria'
                : 'No testimonials added yet'}
            </p>
            <Button onClick={handleCreate}>
              <FaPlus className="mr-2" />
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Testimonial Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                        <img
                          src={testimonial.image}
                          alt={testimonial.patientName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.patientName)}&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.patientName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {testimonial.patientAge} yrs • {testimonial.condition}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {testimonial.rating}/5
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {testimonial.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          testimonial.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {testimonial.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="relative">
                    <div className="text-2xl text-gray-200 absolute -top-2 -left-2">"</div>
                    <p className="text-gray-600 italic line-clamp-3">
                      {testimonial.content}
                    </p>
                    <div className="text-2xl text-gray-200 absolute -bottom-2 -right-2">"</div>
                  </div>

                  {/* Date */}
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <FaCalendar className="mr-2" />
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="px-3 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg text-sm font-medium"
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                      >
                        <FaTrash className="inline mr-2" />
                        Delete
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      {!testimonial.isApproved && (
                        <button
                          onClick={() => handleApprove(testimonial._id, true)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleApprove(testimonial._id, false)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(testimonial._id, testimonial.featured)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                        title={testimonial.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        {testimonial.featured ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonial Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Add New Testimonial' : 'Edit Testimonial'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 md:px-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input
              label="Patient Name"
              type="text"
              placeholder="Enter patient name"
              error={errors.patientName?.message}
              required
              {...register('patientName', {
                required: 'Patient name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />

            <Input
              label="Patient Age"
              type="number"
              placeholder="Enter age"
              min="1"
              max="120"
              error={errors.patientAge?.message}
              required
              {...register('patientAge', {
                required: 'Age is required',
                min: { value: 1, message: 'Age must be at least 1' },
                max: { value: 120, message: 'Age must be reasonable' }
              })}
            />
          </div>

          <Input
            label="Condition Treated"
            type="text"
            placeholder="e.g., Back Pain, Sports Injury"
            error={errors.condition?.message}
            required
            {...register('condition', {
              required: 'Condition is required',
              minLength: {
                value: 3,
                message: 'Condition must be at least 3 characters'
              }
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star)}
                  className="text-2xl outline-none focus:outline-none hover:scale-110 transition-transform"
                >
                  <FaStar
                    className={`${star <= watch('rating') ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
              <input
                type="hidden"
                {...register('rating')}
              />
              <span className="ml-2 text-sm text-gray-600">
                {watch('rating') || 5}/5
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Content
            </label>
            <textarea
              rows={4}
              placeholder="Enter the testimonial content..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
focus:ring-2 focus:ring-primary-500 focus:border-transparent
outline-none focus:outline-none resize-none"
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 20,
                  message: 'Content must be at least 20 characters'
                },
                maxLength: {
                  value: 1000,
                  message: 'Content cannot exceed 1000 characters'
                }
              })}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {watch('content')?.length || 0}/1000 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isApproved"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('isApproved')}
              />
              <label htmlFor="isApproved" className="ml-2 block text-sm text-gray-700">
                Approve immediately
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('featured')}
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Mark as featured
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {modalType === 'create' ? 'Add Testimonial' : 'Update Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminTestimonials;