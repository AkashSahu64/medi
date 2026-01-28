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
      if (params.showOnSlider !== undefined) queryParams.append('showOnSlider', params.showOnSlider);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/gallery?${queryString}` : '/gallery';
      
      const response = await axiosInstance.get(url);
      
      return response.data;
    } catch (error) {
      console.error("❌ Error in galleryService.getGallery:", error);
      throw error;
    }
  },

  // Get slider items - CORRECTED: Calls dedicated slider endpoint
  getSliderItems: async () => {
    try {
      // FIX: Use the dedicated slider endpoint, not a filtered query
      const response = await axiosInstance.get('/gallery/slider');
      
      // Debug log to see what we're getting
      console.log("📱 Slider API Response:", {
        endpoint: '/gallery/slider',
        data: response.data,
        count: response.data?.data?.length || 0
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ Error in galleryService.getSliderItems:", {
        message: error.message,
        response: error.response?.data
      });
      
      // Fallback: Try the filtered endpoint if slider endpoint fails
      try {
        console.log("🔄 Falling back to filtered endpoint...");
        const fallbackResponse = await axiosInstance.get('/gallery?showOnSlider=true');
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        throw error; // Throw original error
      }
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
  toggleFeatured: async (id) => {
    const response = await axiosInstance.patch(`/gallery/${id}/featured`);
    return response.data;
  },

  // Toggle detail button status
  toggleDetailButton: async (id) => {
    const response = await axiosInstance.patch(`/gallery/${id}/detail-button`);
    return response.data;
  },

  // Toggle slider visibility
  toggleSlider: async (id) => {
    const response = await axiosInstance.patch(`/gallery/${id}/slider`);
    return response.data;
  },

  // Get gallery statistics
  getGalleryStats: async () => {
    const response = await axiosInstance.get('/gallery/stats');
    return response.data;
  }
};