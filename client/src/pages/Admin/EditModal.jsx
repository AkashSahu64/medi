import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTimes, 
  FaStar, 
  FaEye, 
  FaCheck, 
  FaImage, 
  FaVideo, 
  FaCalendar,
  FaExternalLinkAlt 
} from 'react-icons/fa';
import { galleryService } from '../../services/gallery.service';
import { useToast } from '../../hooks/useToast';

const EditModal = ({ isOpen, onClose, item, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    featured: false,
    showDetailButton: false,
    showOnSlider: true
  });
  const { showToast } = useToast();

  const categories = ['equipment', 'session', 'clinic', 'exercises', 'team', 'success'];

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'clinic',
        tags: item.tags?.join(', ') || '',
        featured: item.featured || false,
        showDetailButton: item.showDetailButton || false,
        showOnSlider: item.showOnSlider !== false // Default to true
      });
    }
  }, [item]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;

    try {
      setLoading(true);
      const response = await galleryService.updateGalleryItem(item._id, formData);
      
      if (response.success) {
        showToast('Item updated successfully!', 'success');
        onSuccess(response.data); // Pass updated item to parent
        onClose();
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast(error.message || 'Failed to update item', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Media Item</h2>
                <p className="text-sm text-gray-600 mt-1">Update media details and visibility settings</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <FaTimes className="text-gray-500 text-lg" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Preview Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Preview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Media */}
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
                      {item.type === 'image' ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaVideo className="text-4xl text-white/50" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-full">
                            <FaStar className="text-xs" /> Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${
                          item.type === 'image' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {item.type === 'image' ? <FaImage /> : <FaVideo />}
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Media Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-500">File Type</p>
                        <p className="font-medium text-gray-900">{item.format?.toUpperCase() || 'Unknown'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-500">File Size</p>
                        <p className="font-medium text-gray-900">{formatFileSize(item.size)}</p>
                      </div>
                      {item.dimensions && (
                        <div className="space-y-1">
                          <p className="text-gray-500">Dimensions</p>
                          <p className="font-medium text-gray-900">
                            {item.dimensions.width} × {item.dimensions.height}
                          </p>
                        </div>
                      )}
                      {item.type === 'video' && (
                        <div className="space-y-1">
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium text-gray-900">{formatDuration(item.duration)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Metadata */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Uploaded</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaCalendar className="text-gray-400 text-sm" />
                          <p className="font-medium text-gray-900">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <FaExternalLinkAlt />
                        View Original
                      </a>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Current Status</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className={`text-center py-2 rounded-lg ${item.featured ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-600'}`}>
                          <p className="text-xs font-medium">{item.featured ? 'Featured' : 'Not Featured'}</p>
                        </div>
                        <div className={`text-center py-2 rounded-lg ${item.showDetailButton ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600'}`}>
                          <p className="text-xs font-medium">{item.showDetailButton ? 'Detail Button' : 'No Button'}</p>
                        </div>
                        <div className={`text-center py-2 rounded-lg ${item.showOnSlider ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'}`}>
                          <p className="text-xs font-medium">{item.showOnSlider ? 'On Slider' : 'Hidden'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Current Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                      disabled={loading}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={loading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., physiotherapy, equipment, success-story"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Separate tags with commas. These help with search and filtering.
                    </p>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Visibility Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Featured</span>
                          <p className="text-xs text-gray-500">Show in featured section</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="sr-only"
                            disabled={loading}
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Detail Button</span>
                          <p className="text-xs text-gray-500">Show "View Details" button</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.showDetailButton}
                            onChange={(e) => setFormData(prev => ({ ...prev, showDetailButton: e.target.checked }))}
                            className="sr-only"
                            disabled={loading}
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.showDetailButton ? 'bg-purple-600' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.showDetailButton ? 'translate-x-7' : 'translate-x-1'}`} />
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Show on Slider</span>
                          <p className="text-xs text-gray-500">Display in homepage slider</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.showOnSlider}
                            onChange={(e) => setFormData(prev => ({ ...prev, showOnSlider: e.target.checked }))}
                            className="sr-only"
                            disabled={loading}
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.showOnSlider ? 'bg-green-600' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.showOnSlider ? 'translate-x-7' : 'translate-x-1'}`} />
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preview of Changes */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview of Changes</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Featured Status</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        formData.featured === item.featured 
                          ? 'bg-gray-100 text-gray-700' 
                          : formData.featured 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {formData.featured === item.featured ? (
                          'No Change'
                        ) : (
                          <>
                            {item.featured ? <FaStar className="text-xs" /> : null}
                            {formData.featured ? 'Will be Featured' : 'Will be Removed from Featured'}
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Detail Button</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        formData.showDetailButton === item.showDetailButton 
                          ? 'bg-gray-100 text-gray-700' 
                          : formData.showDetailButton 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {formData.showDetailButton === item.showDetailButton 
                          ? 'No Change' 
                          : formData.showDetailButton 
                            ? 'Will Show Button' 
                            : 'Will Hide Button'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Slider Visibility</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        formData.showOnSlider === item.showOnSlider 
                          ? 'bg-gray-100 text-gray-700' 
                          : formData.showOnSlider 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {formData.showOnSlider === item.showOnSlider 
                          ? 'No Change' 
                          : formData.showOnSlider 
                            ? 'Will Show on Slider' 
                            : 'Will Hide from Slider'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditModal;