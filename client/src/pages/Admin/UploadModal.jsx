import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaTimes, FaImage, FaVideo, FaCheck } from 'react-icons/fa';
import { galleryService } from '../../services/gallery.service';
import { useToast } from '../../hooks/useToast';

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'clinic',
    tags: '',
    featured: false,
    showDetailButton: false,
    showOnSlider: true
  });
  const { showToast } = useToast();

  const categories = ['equipment', 'session', 'clinic', 'exercises', 'team', 'success'];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
      
      if (!isValidType) {
        showToast(`File "${file.name}" is not a valid image or video`, 'error');
        return false;
      }
      
      if (!isValidSize) {
        showToast(`File "${file.name}" exceeds 50MB limit`, 'error');
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Limit to 10 files
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFiles([]);
    setFormData({
      title: '',
      description: '',
      category: 'clinic',
      tags: '',
      featured: false,
      showDetailButton: false,
      showOnSlider: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      showToast('Please select at least one file', 'error');
      return;
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();
      
      // Add files
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      // Add metadata
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (key === 'tags') {
          formDataToSend.append(key, value);
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString());
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await galleryService.uploadMedia(formDataToSend);
      
      if (response.success) {
        showToast(`${files.length} file(s) uploaded successfully!`, 'success');
        onSuccess(response.data); // Pass the uploaded items to parent
        resetForm();
        onClose();
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.message || 'Failed to upload files', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FaImage className="text-blue-500 text-lg" />;
    } else if (file.type.startsWith('video/')) {
      return <FaVideo className="text-red-500 text-lg" />;
    }
    return null;
  };

  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upload Media</h2>
                <p className="text-sm text-gray-600 mt-1">Add new images or videos to your gallery</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={uploading}
              >
                <FaTimes className="text-gray-500 text-lg" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                        <FaUpload className="text-2xl text-blue-500" />
                      </div>
                      <p className="text-gray-700 font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        Images (PNG, JPG, GIF) and Videos (MP4, MOV) up to 50MB each
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Max 10 files at once • Accepted: Images & Videos
                      </p>
                    </div>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Files ({files.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                        disabled={uploading}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file)}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{getFileSize(file.size)}</span>
                                <span>•</span>
                                <span>{file.type.split('/')[1]?.toUpperCase() || 'Unknown'}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            disabled={uploading}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Fields */}
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
                    placeholder="Enter title for all files"
                    required
                    disabled={uploading}
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
                    disabled={uploading}
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
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter description for all files"
                    disabled={uploading}
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
                    disabled={uploading}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate tags with commas. These help with search and filtering.
                  </p>
                </div>
              </div>

              {/* Settings Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility Settings</h3>
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
                          disabled={uploading}
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
                          disabled={uploading}
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
                          disabled={uploading}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.showOnSlider ? 'bg-green-600' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.showOnSlider ? 'translate-x-7' : 'translate-x-1'}`} />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {files.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FaCheck className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Ready to upload {files.length} file{files.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-blue-700">
                        {files.filter(f => f.type.startsWith('image/')).length} images,{' '}
                        {files.filter(f => f.type.startsWith('video/')).length} videos
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || files.length === 0}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaUpload />
                      Upload {files.length} File{files.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadModal;