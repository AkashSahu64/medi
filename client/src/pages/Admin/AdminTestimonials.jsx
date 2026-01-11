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
  FaEyeSlash
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Mock testimonials data (in real app, you'd fetch from API)
const MOCK_TESTIMONIALS = [
  {
    _id: '1',
    patientName: 'Rajesh Kumar',
    patientAge: 45,
    condition: 'Chronic Back Pain',
    content: 'After 6 months of suffering, MEDIHOPE gave me my life back. Their personalized treatment plan worked wonders!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isApproved: true,
    createdAt: '2024-01-15',
    featured: true
  },
  {
    _id: '2',
    patientName: 'Priya Sharma',
    patientAge: 38,
    condition: 'Sports Injury',
    content: 'Professional care and state-of-the-art equipment helped me recover faster than expected. Highly recommended!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    isApproved: true,
    createdAt: '2024-01-20',
    featured: true
  },
  {
    _id: '3',
    patientName: 'Suresh Patel',
    patientAge: 62,
    condition: 'Arthritis Management',
    content: 'The therapists are knowledgeable and caring. My mobility has improved significantly in just 8 weeks.',
    rating: 4,
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    isApproved: false,
    createdAt: '2024-01-25',
    featured: false
  },
  {
    _id: '4',
    patientName: 'Anjali Verma',
    patientAge: 28,
    condition: 'Post-Accident Rehabilitation',
    content: 'Excellent care and support throughout my recovery journey. The team was always available for questions.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    isApproved: true,
    createdAt: '2024-01-28',
    featured: false
  }
];

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [modalType, setModalType] = useState('create');
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
    watch
  } = useForm();

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [filters, testimonials]);

  const loadTestimonials = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTestimonials(MOCK_TESTIMONIALS);
      setFilteredTestimonials(MOCK_TESTIMONIALS);
      setLoading(false);
    }, 500);
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const updated = testimonials.filter(t => t._id !== id);
      setTestimonials(updated);
      toast.success('Testimonial deleted successfully');
    }
  };

  const handleApprove = (id, approve = true) => {
    const updated = testimonials.map(t =>
      t._id === id ? { ...t, isApproved: approve } : t
    );
    setTestimonials(updated);
    toast.success(`Testimonial ${approve ? 'approved' : 'rejected'} successfully`);
  };

  const handleToggleFeatured = (id) => {
    const updated = testimonials.map(t =>
      t._id === id ? { ...t, featured: !t.featured } : t
    );
    setTestimonials(updated);
    toast.success('Featured status updated');
  };

  const onSubmit = (data) => {
    if (modalType === 'create') {
      const newTestimonial = {
        _id: Date.now().toString(),
        ...data,
        patientAge: parseInt(data.patientAge),
        rating: parseInt(data.rating),
        image: 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTestimonials([newTestimonial, ...testimonials]);
      toast.success('Testimonial added successfully');
    } else {
      const updated = testimonials.map(t =>
        t._id === selectedTestimonial._id 
          ? { 
              ...t, 
              ...data,
              patientAge: parseInt(data.patientAge),
              rating: parseInt(data.rating)
            }
          : t
      );
      setTestimonials(updated);
      toast.success('Testimonial updated successfully');
    }
    setIsModalOpen(false);
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

      <div className="space-y-6">
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
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({ search: '', status: 'all', featured: 'all' })}
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
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.patientName}
                          className="w-full h-full object-cover"
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
                    {testimonial.createdAt}
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
                        onClick={() => handleToggleFeatured(testimonial._id)}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
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
                  {testimonials.filter(t => !t.isApproved).length}
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
                  {testimonials.filter(t => t.featured).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaStar className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Add New Testimonial' : 'Edit Testimonial'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                  onClick={() => reset({ ...watch(), rating: star })}
                  className="text-2xl focus:outline-none"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 20,
                  message: 'Content must be at least 20 characters'
                },
                maxLength: {
                  value: 500,
                  message: 'Content cannot exceed 500 characters'
                }
              })}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {watch('content')?.length || 0}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
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
            >
              Cancel
            </Button>
            <Button type="submit">
              {modalType === 'create' ? 'Add Testimonial' : 'Update Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminTestimonials;