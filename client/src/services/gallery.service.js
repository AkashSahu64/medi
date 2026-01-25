import axiosInstance from './axiosInstance';

export const galleryService = {
  // Get all gallery items with filtering
  getGallery: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add only defined parameters
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.type) queryParams.append('type', params.type);
      if (params.featured !== undefined) queryParams.append('featured', params.featured);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/gallery?${queryString}` : '/gallery';
      
      const response = await axiosInstance.get(url);
      
      return response.data;
    } catch (error) {
      console.error("❌ Error in galleryService.getGallery:", error);
      throw error;
    }
  },

  // Get single gallery item by ID
  getGalleryById: async (id) => {
    const response = await axiosInstance.get(`/gallery/${id}`);
    return response.data;
  },

  // Upload new media
  uploadMedia: async (formData) => {
    const response = await axiosInstance.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update gallery item
  updateGalleryItem: async (id, data) => {
    const response = await axiosInstance.put(`/gallery/${id}`, data);
    return response.data;
  },

  // Delete gallery item
  deleteGalleryItem: async (id) => {
    const response = await axiosInstance.delete(`/gallery/${id}`);
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id, featured) => {
    const response = await axiosInstance.patch(`/gallery/${id}/featured`, { featured });
    return response.data;
  },

  // Get gallery statistics
  getGalleryStats: async () => {
    const response = await axiosInstance.get('/gallery/stats');
    return response.data;
  }
};