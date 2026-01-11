import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaEye, 
  FaDownload,
  FaSearch,
  FaFilter,
  FaImages,
  FaVideo,
  FaCalendar,
  FaTag,
  FaShareAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Mock gallery data
const MOCK_GALLERY = [
  {
    _id: '1',
    title: 'Advanced Physiotherapy Equipment',
    description: 'Our state-of-the-art equipment for accurate diagnosis and treatment',
    category: 'equipment',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    featured: true,
    createdAt: '2024-01-15',
    tags: ['equipment', 'technology', 'modern']
  },
  {
    _id: '2',
    title: 'Therapy Session in Progress',
    description: 'One-on-one therapy session with our experienced physiotherapist',
    category: 'session',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    featured: true,
    createdAt: '2024-01-18',
    tags: ['session', 'treatment', 'care']
  },
  {
    _id: '3',
    title: 'Clinic Reception Area',
    description: 'Comfortable waiting area for our patients',
    category: 'clinic',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    featured: false,
    createdAt: '2024-01-20',
    tags: ['clinic', 'reception', 'waiting']
  },
  {
    _id: '4',
    title: 'Rehabilitation Exercises',
    description: 'Guided exercises for post-treatment recovery',
    category: 'exercises',
    type: 'video',
    url: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    featured: true,
    createdAt: '2024-01-22',
    tags: ['exercises', 'rehabilitation', 'recovery']
  },
  {
    _id: '5',
    title: 'Team Meeting',
    description: 'Our team discussing patient treatment plans',
    category: 'team',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    featured: false,
    createdAt: '2024-01-25',
    tags: ['team', 'meeting', 'planning']
  },
  {
    _id: '6',
    title: 'Patient Success Story',
    description: 'Before and after recovery photos',
    category: 'success',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    featured: true,
    createdAt: '2024-01-28',
    tags: ['success', 'recovery', 'testimonial']
  }
];

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    featured: 'all'
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'equipment', label: 'Equipment', icon: '🩺' },
    { value: 'session', label: 'Sessions', icon: '💆' },
    { value: 'clinic', label: 'Clinic', icon: '🏥' },
    { value: 'exercises', label: 'Exercises', icon: '🏃' },
    { value: 'team', label: 'Team', icon: '👥' },
    { value: 'success', label: 'Success Stories', icon: '🌟' }
  ];

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    filterGallery();
  }, [filters, gallery]);

  const loadGallery = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGallery(MOCK_GALLERY);
      setFilteredGallery(MOCK_GALLERY);
      setLoading(false);
    }, 500);
  };

  const filterGallery = () => {
    let filtered = [...gallery];

    // Filter by search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Filter by featured
    if (filters.featured !== 'all') {
      filtered = filtered.filter(item => 
        filters.featured === 'featured' ? item.featured : !item.featured
      );
    }

    setFilteredGallery(filtered);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newItem = {
        _id: Date.now().toString(),
        title: 'New Upload',
        description: 'Recently uploaded content',
        category: 'clinic',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516549655669-df6654e435f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1516549655669-df6654e435f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        featured: false,
        createdAt: new Date().toISOString().split('T')[0],
        tags: ['new', 'upload']
      };

      setGallery([newItem, ...gallery]);
      setUploading(false);
      setIsUploadModalOpen(false);
      toast.success('Item uploaded successfully');
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updated = gallery.filter(item => item._id !== id);
      setGallery(updated);
      toast.success('Item deleted successfully');
    }
  };

  const handleToggleFeatured = (id) => {
    const updated = gallery.map(item =>
      item._id === id ? { ...item, featured: !item.featured } : item
    );
    setGallery(updated);
    toast.success('Featured status updated');
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDownload = (item) => {
    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.title.replace(/\s+/g, '-').toLowerCase() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const handleShare = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: item.url,
      });
    } else {
      navigator.clipboard.writeText(item.url);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <>
      <Helmet>
        <title>Gallery Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600">Manage clinic photos, videos, and media content</p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <FaPlus className="mr-2" />
            Upload Media
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{gallery.length}</p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <FaImages className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {gallery.filter(item => item.featured).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <FaEye className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {gallery.filter(item => item.type === 'image').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <FaImages className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {gallery.filter(item => item.type === 'video').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaVideo className="text-xl" />
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
                  placeholder="Search gallery..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  type: 'all',
                  featured: 'all'
                })}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Featured Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Status
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setFilters({ ...filters, featured: 'all' })}
                className={`px-4 py-2 rounded-lg ${
                  filters.featured === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilters({ ...filters, featured: 'featured' })}
                className={`px-4 py-2 rounded-lg ${
                  filters.featured === 'featured'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Featured Only
              </button>
              <button
                onClick={() => setFilters({ ...filters, featured: 'regular' })}
                className={`px-4 py-2 rounded-lg ${
                  filters.featured === 'regular'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Regular Only
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-6">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No gallery items found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.featured !== 'all'
                ? 'Try changing your filter criteria'
                : 'No gallery items added yet'}
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <FaPlus className="mr-2" />
              Upload Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          item.type === 'image' ? 'bg-cyan-500 text-white' : 'bg-purple-500 text-white'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                        {item.featured && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {categories.find(c => c.value === item.category)?.icon}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        <FaTag className="mr-1" size={8} />
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2" />
                      {item.createdAt}
                    </div>
                    <div className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {item.category}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download"
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleShare(item)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Share"
                      >
                        <FaShareAlt />
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleFeatured(item._id)}
                        className={`p-2 rounded-lg ${
                          item.featured
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={item.featured ? 'Remove featured' : 'Mark as featured'}
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Media"
        size="lg"
      >
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag & drop files here
            </p>
            <p className="text-sm text-gray-500 mb-6">
              or click to browse (Supports JPG, PNG, MP4 up to 10MB)
            </p>
            <label className="inline-block">
              <input type="file" className="hidden" multiple />
              <Button type="button" variant="outline">
                Browse Files
              </Button>
            </label>
          </div>

          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Uploading Files (3)</h4>
            <div className="space-y-3">
              {['image1.jpg', 'image2.png', 'video1.mp4'].map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <FaImages className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file}</p>
                      <p className="text-xs text-gray-500">2.4 MB • 50% uploaded</p>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {categories.slice(1).map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter description"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredUpload"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="featuredUpload" className="ml-2 block text-sm text-gray-700">
              Mark as featured
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={uploading}>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedItem?.title}
        size="xl"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Media Display */}
            <div className="relative rounded-xl overflow-hidden bg-gray-900">
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full max-h-96 object-contain"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full max-h-96"
                />
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={() => handleShare(selectedItem)}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                <p className="text-gray-900">{selectedItem.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {categories.find(c => c.value === selectedItem.category)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedItem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="font-medium">{selectedItem.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      selectedItem.featured
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem.featured ? 'Featured' : 'Regular'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
              >
                <FaExternalLinkAlt className="mr-2" />
                Open in New Tab
              </a>
              <Button
                variant="outline"
                onClick={() => handleToggleFeatured(selectedItem._id)}
              >
                {selectedItem.featured ? 'Remove Featured' : 'Mark as Featured'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminGallery;