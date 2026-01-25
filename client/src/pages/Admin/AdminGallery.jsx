import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
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
  FaExternalLinkAlt,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { galleryService } from "../../services/gallery.service";

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "clinic",
    tags: "",
    featured: false,
  });
  const [editFormData, setEditFormData] = useState({});
  const fileRef = useRef(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    featured: "all",
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "equipment", label: "Equipment", icon: "🩺" },
    { value: "session", label: "Sessions", icon: "💆" },
    { value: "clinic", label: "Clinic", icon: "🏥" },
    { value: "exercises", label: "Exercises", icon: "🏃" },
    { value: "team", label: "Team", icon: "👥" },
    { value: "success", label: "Success Stories", icon: "🌟" },
  ];

  useEffect(() => {
    loadGallery();
    loadStats();
  }, []);

  useEffect(() => {
    filterGallery();
  }, [filters, gallery]);

  // AdminGallery.jsx में loadGallery function को update करें
const loadGallery = async () => {
  setLoading(true);
  try {
    console.log("🔄 Loading gallery...");
    
    const response = await galleryService.getGallery({
      search: filters.search || undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      type: filters.type !== "all" ? filters.type : undefined,
      featured: filters.featured !== "all" 
        ? (filters.featured === "featured" ? true : false) 
        : undefined,
    });
    
    console.log("✅ Gallery API Response:", response);
    console.log("✅ Gallery data received:", response.data?.length || 0, "items");
    
    if (response.data && Array.isArray(response.data)) {
      setGallery(response.data);
      console.log("✅ Gallery state set with", response.data.length, "items");
      
      // Log first item to see structure
      if (response.data.length > 0) {
        console.log("✅ First gallery item:", response.data[0]);
      }
    } else {
      console.error("❌ No data or invalid data format in response:", response);
      toast.error("No gallery data received");
    }
  } catch (error) {
    console.error("❌ Failed to load gallery:", error);
    console.error("❌ Error details:", error.response?.data);
    
    if (error.response?.status === 401) {
      toast.error("Unauthorized. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to view gallery.");
    } else {
      toast.error("Failed to load gallery");
    }
  } finally {
    setLoading(false);
  }
};

  const loadStats = async () => {
    try {
      const response = await galleryService.getGalleryStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filterGallery = () => {
    let filtered = [...gallery];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(term))),
      );
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    if (filters.featured !== "all") {
      filtered = filtered.filter((item) =>
        filters.featured === "featured" ? item.featured : !item.featured,
      );
    }

    setFilteredGallery(filtered);
  };

  const handleUpload = async (e) => {
  e.preventDefault();
  
  if (selectedFiles.length === 0) {
    toast.error("Please select at least one file");
    return;
  }
  
  setUploading(true);
  
  try {
    console.log("🔄 Uploading files...");
    console.log("📋 Form data:", formData);
    
    // Create FormData object
    const uploadFormData = new FormData();
    
    // Add files
    selectedFiles.forEach((file) => {
      uploadFormData.append("files", file);
    });
    
    // Add metadata - सही नामों का use करें
    uploadFormData.append("title", formData.title || "Untitled");
    uploadFormData.append("description", formData.description || "");
    uploadFormData.append("category", formData.category || "clinic");
    uploadFormData.append("tags", formData.tags || "");
    uploadFormData.append("featured", formData.featured.toString());
    
    console.log("📤 Uploading FormData:");
    for (let [key, value] of uploadFormData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await galleryService.uploadMedia(uploadFormData);
    
    // Refresh gallery
    await loadGallery();
    await loadStats();
    
    toast.success(response.message || "Uploaded successfully");
    
    // Reset form
    setSelectedFiles([]);
    setFormData({
      title: "",
      description: "",
      category: "clinic",
      tags: "",
      featured: false,
    });
    setIsUploadModalOpen(false);
    
  } catch (error) {
    console.error("❌ Upload failed:", error);
    console.error("❌ Error details:", error.response?.data);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Upload failed";
    toast.error(errorMessage);
  } finally {
    setUploading(false);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await galleryService.deleteGalleryItem(id);
        
        // Update local state
        const updated = gallery.filter((item) => item._id !== id);
        setGallery(updated);
        
        toast.success("Item deleted successfully");
        loadStats();
      } catch (error) {
        console.error("Failed to delete item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Set default title from first file name
    if (files.length > 0 && !formData.title) {
      const fileName = files[0].name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await galleryService.toggleFeatured(id, !currentFeatured);
      
      // Update local state
      const updated = gallery.map((item) =>
        item._id === id ? { ...item, featured: !currentFeatured } : item,
      );
      setGallery(updated);
      
      toast.success(`Featured status updated`);
    } catch (error) {
      console.error("Failed to update featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags?.join(", ") || "",
      featured: item.featured,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await galleryService.updateGalleryItem(selectedItem._id, editFormData);
      
      // Refresh gallery
      await loadGallery();
      
      toast.success("Item updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item");
    }
  };

  const handleDownload = (item) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.title.replace(/\s+/g, "-").toLowerCase() + (item.type === "image" ? ".jpg" : ".mp4");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
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
      toast.success("Link copied to clipboard");
    }
  };

  const [stats, setStats] = useState({
    totalItems: 0,
    featuredItems: 0,
    imagesCount: 0,
    videosCount: 0,
  });

  return (
    <>
      <Helmet>
        <title>Gallery Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gallery Management
            </h1>
            <p className="text-gray-600">
              Manage clinic photos, videos, and media content
            </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalItems}
                </p>
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
                  {stats.featuredItems}
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
                  {stats.imagesCount}
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
                  {stats.videosCount}
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
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value });
                    loadGallery(); // Fetch from backend with search
                  }}
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
                onChange={(e) => {
                  setFilters({ ...filters, category: e.target.value });
                  loadGallery(); // Fetch from backend with category filter
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
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
                onChange={(e) => {
                  setFilters({ ...filters, type: e.target.value });
                  loadGallery(); // Fetch from backend with type filter
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            <div className="flex items-end my-1.5">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({
                    search: "",
                    category: "all",
                    type: "all",
                    featured: "all",
                  });
                  loadGallery();
                }}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Featured Filter */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Status
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setFilters({ ...filters, featured: "all" });
                  loadGallery();
                }}
                className={`px-4 py-1.5 rounded-lg ${
                  filters.featured === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, featured: "featured" });
                  loadGallery();
                }}
                className={`px-4 py-1.5 rounded-lg ${
                  filters.featured === "featured"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Featured Only
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, featured: "regular" });
                  loadGallery();
                }}
                className={`px-4 py-1.5 rounded-lg ${
                  filters.featured === "regular"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              {filters.search ||
              filters.category !== "all" ||
              filters.type !== "all" ||
              filters.featured !== "all"
                ? "Try changing your filter criteria"
                : "No gallery items added yet"}
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
                  {item.type === "image" ? (
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <video className="w-full h-full object-cover">
                        <source src={item.url} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <FaVideo className="text-white text-4xl" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            item.type === "image"
                              ? "bg-cyan-500 text-white"
                              : "bg-purple-500 text-white"
                          }`}
                        >
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
                      {categories.find((c) => c.value === item.category)?.icon}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
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
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2" />
                      {new Date(item.createdAt).toLocaleDateString()}
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
                        onClick={() => handleToggleFeatured(item._id, item.featured)}
                        className={`p-2 rounded-lg ${
                          item.featured
                            ? "text-yellow-600 hover:bg-yellow-50"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title={
                          item.featured ? "Remove featured" : "Mark as featured"
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <FaEdit />
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
        <form onSubmit={handleUpload} className="space-y-6 px-4 md:px-6 mb-4">
          {/* Drag & Drop Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center 
hover:border-primary-500 hover:bg-primary-50/40 transition-all"
          >
            <div className="text-4xl mb-4 text-primary-600">📁</div>

            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag & drop files here
            </p>

            <p className="text-sm text-gray-500 mb-6">
              or click to browse (Supports JPG, PNG, GIF, MP4 up to 50MB)
            </p>

            <input
              type="file"
              ref={fileRef}
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
            />

            <Button type="button" onClick={() => fileRef.current.click()}>
              Browse Files
            </Button>
          </div>

          {/* File Info */}
          {selectedFiles.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        {file.type.startsWith("image") ? <FaImages /> : <FaVideo />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.slice(1).map((category) => (
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="equipment, technology, modern"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredUpload"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label
              htmlFor="featuredUpload"
              className="ml-2 block text-sm text-gray-700"
            >
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
              {uploading ? "Uploading..." : "Upload Files"}
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
          <div className="space-y-6 px-4 md:px-6 mb-4">
            {/* Media Display */}
            <div className="relative rounded-xl overflow-hidden bg-gray-900">
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full max-h-[70vh] object-contain mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
                  }}
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full max-h-[70vh] mx-auto"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg 
hover:bg-white/30 transition-all hover:scale-105"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={() => handleShare(selectedItem)}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg 
hover:bg-white/30 transition-all hover:scale-105"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h4>
                <p className="text-gray-900 break-words leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {
                        categories.find(
                          (c) => c.value === selectedItem.category,
                        )?.label
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedItem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="font-medium">
                      {new Date(selectedItem.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        selectedItem.featured
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedItem.featured ? "Featured" : "Regular"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full whitespace-nowrap"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                onClick={() => handleToggleFeatured(selectedItem._id, selectedItem.featured)}
              >
                {selectedItem.featured ? "Remove Featured" : "Mark as Featured"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Gallery Item"
        size="lg"
      >
        {selectedItem && (
          <form onSubmit={handleUpdate} className="space-y-6 px-4 md:px-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Enter title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                >
                  {categories.slice(1).map((category) => (
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="equipment, technology, modern"
                value={editFormData.tags}
                onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featuredEdit"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={editFormData.featured}
                onChange={(e) => setEditFormData({ ...editFormData, featured: e.target.checked })}
              />
              <label
                htmlFor="featuredEdit"
                className="ml-2 block text-sm text-gray-700"
              >
                Mark as featured
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default AdminGallery;