import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, 
  FaTrash, 
  FaStar, 
  FaRegStar, 
  FaEye, 
  FaEyeSlash,
  FaImage,
  FaVideo,
  FaUpload,
  FaSearch,
  FaFilter,
  FaSync,
  FaCheck,
  FaTimes,
  FaCalendar
} from 'react-icons/fa';
import { galleryService } from '../../services/gallery.service';
import Button from '../../components/common/Button';
import UploadModal from './UploadModal';
import EditModal from './EditModal';
import { useToast } from '../../hooks/useToast';

const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    featured: 'all',
    showOnSlider: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { showToast } = useToast();

  const categories = [
    'all', 'equipment', 'session', 'clinic', 'exercises', 'team', 'success'
  ];

  // Memoized stats derived from galleryItems
  const stats = useMemo(() => {
    const totalItems = galleryItems.length;
    const featuredItems = galleryItems.filter(item => item.featured).length;
    const sliderItems = galleryItems.filter(item => item.showOnSlider).length;
    const showDetailButtonItems = galleryItems.filter(item => item.showDetailButton).length;
    const imagesCount = galleryItems.filter(item => item.type === 'image').length;
    const videosCount = galleryItems.filter(item => item.type === 'video').length;

    return {
      totalItems,
      featuredItems,
      sliderItems,
      showDetailButtonItems,
      imagesCount,
      videosCount
    };
  }, [galleryItems]);

  // Filter gallery items based on current filters
  const filteredItems = useMemo(() => {
    let items = [...galleryItems];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      items = items.filter(item => item.category === filters.category);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      items = items.filter(item => item.type === filters.type);
    }

    // Apply featured filter
    if (filters.featured !== 'all') {
      items = items.filter(item => item.featured === (filters.featured === 'true'));
    }

    // Apply slider filter
    if (filters.showOnSlider !== 'all') {
      items = items.filter(item => item.showOnSlider === (filters.showOnSlider === 'true'));
    }

    // Sort: featured first, then by createdAt
    items.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return items;
  }, [galleryItems, filters]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredItems.slice(start, end);
  }, [filteredItems, pagination.page, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchInitialGallery();
  }, []);

  // Update pagination total when filtered items change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / prev.limit)
    }));
  }, [filteredItems]);

  const fetchInitialGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getGallery({
        page: 1,
        limit: 1000 // Fetch enough items for admin panel
      });
      setGalleryItems(response.data || []);
    } catch (error) {
      showToast('Failed to load gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Optimistic toggle functions
  const handleToggleFeatured = async (id, currentStatus) => {
    const previousItems = [...galleryItems];
    const itemIndex = galleryItems.findIndex(item => item._id === id);
    
    if (itemIndex === -1) return;

    // Optimistic update
    const updatedItems = [...galleryItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      featured: !currentStatus
    };
    setGalleryItems(updatedItems);

    try {
      await galleryService.toggleFeatured(id);
      showToast(`Item ${!currentStatus ? 'marked as featured' : 'removed from featured'}`, 'success');
    } catch (error) {
      // Revert on error
      setGalleryItems(previousItems);
      showToast('Failed to update featured status', 'error');
    }
  };

  const handleToggleDetailButton = async (id, currentStatus) => {
    const previousItems = [...galleryItems];
    const itemIndex = galleryItems.findIndex(item => item._id === id);
    
    if (itemIndex === -1) return;

    // Optimistic update
    const updatedItems = [...galleryItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      showDetailButton: !currentStatus
    };
    setGalleryItems(updatedItems);

    try {
      await galleryService.toggleDetailButton(id);
      showToast(`Detail button ${!currentStatus ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      // Revert on error
      setGalleryItems(previousItems);
      showToast('Failed to update detail button', 'error');
    }
  };

  const handleToggleSlider = async (id, currentStatus) => {
    const previousItems = [...galleryItems];
    const itemIndex = galleryItems.findIndex(item => item._id === id);
    
    if (itemIndex === -1) return;

    // Optimistic update
    const updatedItems = [...galleryItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      showOnSlider: !currentStatus
    };
    setGalleryItems(updatedItems);

    try {
      await galleryService.toggleSlider(id);
      showToast(`Slider visibility ${!currentStatus ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      // Revert on error
      setGalleryItems(previousItems);
      showToast('Failed to update slider visibility', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    const previousItems = [...galleryItems];
    
    // Optimistic update
    const updatedItems = galleryItems.filter(item => item._id !== id);
    setGalleryItems(updatedItems);

    try {
      await galleryService.deleteGalleryItem(id);
      showToast('Item deleted successfully', 'success');
    } catch (error) {
      // Revert on error
      setGalleryItems(previousItems);
      showToast('Failed to delete item', 'error');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUploadSuccess = (newItems) => {
    setShowUploadModal(false);
    setGalleryItems(prev => [...newItems, ...prev]);
    showToast('Media uploaded successfully!', 'success');
  };

  const handleEditSuccess = (updatedItem) => {
    setShowEditModal(false);
    setSelectedItem(null);
    
    // Update the item in local state
    setGalleryItems(prev => 
      prev.map(item => item._id === updatedItem._id ? updatedItem : item)
    );
    
    showToast('Item updated successfully', 'success');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatsCard = ({ title, value, icon, color }) => (
    <motion.div
      key={`${title}-${value}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
        <p className="text-gray-600 mt-2">Manage your gallery content and slider visibility</p>
      </div>

      {/* Stats Grid - Derived from local state */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Items"
          value={stats.totalItems}
          icon={<FaImage className="text-xl text-blue-600" />}
          color="bg-blue-50"
        />
        <StatsCard
          title="Featured"
          value={stats.featuredItems}
          icon={<FaStar className="text-xl text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatsCard
          title="On Slider"
          value={stats.sliderItems}
          icon={<FaEye className="text-xl text-green-600" />}
          color="bg-green-50"
        />
        <StatsCard
          title="With Detail Button"
          value={stats.showDetailButtonItems}
          icon={<FaCheck className="text-xl text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search items..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured
            </label>
            <select
              value={filters.featured}
              onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              On Slider
            </label>
            <select
              value={filters.showOnSlider}
              onChange={(e) => setFilters(prev => ({ ...prev, showOnSlider: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="true">On Slider</option>
              <option value="false">Not on Slider</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {paginatedItems.length} of {filteredItems.length} items
            {filters.search && ` (filtered from ${stats.totalItems} total)`}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchInitialGallery}
              className="flex items-center gap-2"
            >
              <FaSync />
              Refresh All
            </Button>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
            >
              <FaUpload />
              Upload Media
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <FaImage className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
          <p className="text-gray-500 mb-6">Upload your first media item to get started</p>
          <Button onClick={() => setShowUploadModal(true)}>
            Upload Media
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Media Preview */}
                <div className="relative h-48 overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      <FaVideo className="text-4xl text-white" />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.featured && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaStar className="text-xs" /> Featured
                      </span>
                    )}
                    {item.type === 'image' ? (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Image
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Video
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                  
                  {/* Upload Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <FaCalendar className="text-gray-400" />
                    <span>Uploaded: {formatDate(item.createdAt)}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {item.tags?.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Toggle Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      onClick={() => handleToggleFeatured(item._id, item.featured)}
                      className={`flex items-center justify-center gap-1 text-xs py-2 rounded-lg transition-colors ${
                        item.featured
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {item.featured ? <FaStar /> : <FaRegStar />}
                      Featured
                    </button>
                    
                    <button
                      onClick={() => handleToggleDetailButton(item._id, item.showDetailButton)}
                      className={`flex items-center justify-center gap-1 text-xs py-2 rounded-lg transition-colors ${
                        item.showDetailButton
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {item.showDetailButton ? <FaCheck /> : <FaTimes />}
                      Detail Btn
                    </button>
                    
                    <button
                      onClick={() => handleToggleSlider(item._id, item.showOnSlider)}
                      className={`flex items-center justify-center gap-1 text-xs py-2 rounded-lg transition-colors ${
                        item.showOnSlider
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {item.showOnSlider ? <FaEye /> : <FaEyeSlash />}
                      Slider
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
      
      {selectedItem && (
        <EditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default AdminGallery;