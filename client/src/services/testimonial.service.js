import axiosInstance from './axiosInstance';

export const testimonialService = {
  // Get all testimonials with filtering
  getTestimonials: async (params = {}) => {
    try {
      // Filter out undefined, null, and empty string values
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        // Only add if value is defined, not null, and not empty string (for search)
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const url = queryParams ? `/testimonials?${queryParams}` : '/testimonials';
      
      console.log('📡 Fetching testimonials:', url);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Testimonials response:', response.data);
      
      if (response.data.success) {
        return {
          data: response.data.data,
          pagination: response.data.pagination,
          success: true
        };
      } else {
        return {
          data: [],
          success: false,
          message: response.data.message || 'Failed to fetch testimonials'
        };
      }
    } catch (error) {
      console.error('❌ Error fetching testimonials:', error);
      return {
        data: [],
        success: false,
        message: error.response?.data?.message || 'Network error'
      };
    }
  },

  // Get single testimonial by ID
  getTestimonialById: async (id) => {
    const response = await axiosInstance.get(`/testimonials/${id}`);
    return response.data;
  },

  // Create new testimonial
  createTestimonial: async (testimonialData) => {
    try {
      const response = await axiosInstance.post('/testimonials', testimonialData);
      console.log('✅ Create testimonial response:', response.data);
      
      if (response.data.success) {
        return {
          data: response.data.data,
          message: response.data.message,
          success: true
        };
      }
      return {
        data: null,
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error creating testimonial:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to create testimonial'
      };
    }
  },

  // Update testimonial
  updateTestimonial: async (id, testimonialData) => {
    const response = await axiosInstance.put(`/testimonials/${id}`, testimonialData);
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id) => {
    const response = await axiosInstance.delete(`/testimonials/${id}`);
    return response.data;
  },

  // Approve testimonial
  approveTestimonial: async (id, approved) => {
    const response = await axiosInstance.patch(`/testimonials/${id}/approve`, { isApproved: approved });
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (id, featured) => {
    const response = await axiosInstance.patch(`/testimonials/${id}/featured`, { featured });
    return response.data;
  },

  // Upload testimonial image
  uploadImage: async (id, formData) => {
    const response = await axiosInstance.post(`/testimonials/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get testimonial statistics
  getTestimonialStats: async () => {
    const response = await axiosInstance.get('/testimonials/stats');
    return response.data;
  }
};