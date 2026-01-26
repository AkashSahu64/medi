import axiosInstance from './axiosInstance';

export const serviceService = {
  // Get all services for public website (only active)
  getAllServices: async (params = {}) => {
    try {
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const url = queryParams ? `/services?${queryParams}` : '/services';
      
      console.log('📡 Fetching public services:', url);
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        return {
          data: response.data.data,
          success: true,
          count: response.data.count
        };
      }
      return {
        data: [],
        success: false,
        count: 0
      };
    } catch (error) {
      console.error('❌ Error fetching public services:', error);
      return {
        data: [],
        success: false,
        count: 0
      };
    }
  },

  // Get all services for admin panel (including inactive)
  getAllServicesForAdmin: async (params = {}) => {
    try {
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const url = queryParams ? `/services/admin/all?${queryParams}` : '/services/admin/all';
      
      console.log('📡 Fetching admin services:', url);
      
      const response = await axiosInstance.get(url);
      
      console.log('✅ Admin services response:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length
      });
      
      if (response.data.success) {
        return {
          data: response.data.data || [],
          success: true,
          count: response.data.count || 0
        };
      }
      return {
        data: [],
        success: false,
        count: 0
      };
    } catch (error) {
      console.error('❌ Error fetching admin services:', {
        message: error.message,
        status: error.response?.status
      });
      return {
        data: [],
        success: false,
        count: 0
      };
    }
  },

  // Get single service by ID
  getServiceById: async (id) => {
    try {
      const response = await axiosInstance.get(`/services/${id}`);
      return {
        data: response.data.data,
        success: response.data.success
      };
    } catch (error) {
      console.error('Error fetching service:', error);
      return {
        data: null,
        success: false
      };
    }
  },

  // Get single service for admin by ID
  getServiceByIdForAdmin: async (id) => {
    try {
      const response = await axiosInstance.get(`/services/admin/${id}`);
      return {
        data: response.data.data,
        success: response.data.success
      };
    } catch (error) {
      console.error('Error fetching service for admin:', error);
      return {
        data: null,
        success: false
      };
    }
  },

  /// Create service (admin route)
  createService: async (serviceData) => {
    try {
      console.log('Creating service:', serviceData);
      
      const response = await axiosInstance.post('/services/admin', serviceData);
      
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
      console.error('❌ Error creating service:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to create service'
      };
    }
  },

  // Update service (admin route)
  updateService: async (id, serviceData) => {
    try {
      const response = await axiosInstance.put(`/services/admin/${id}`, serviceData);
      
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
      console.error('❌ Error updating service:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to update service'
      };
    }
  },

  // Delete service (admin route - hard delete)
  deleteService: async (id) => {
    try {
      const response = await axiosInstance.delete(`/services/admin/${id}`);
      
      if (response.data.success) {
        return {
          message: response.data.message,
          success: true
        };
      }
      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete service'
      };
    }
  },

  // Toggle service status
  toggleServiceStatus: async (id, isActive) => {
    try {
      const response = await axiosInstance.patch(`/services/admin/${id}/status`, { isActive });
      
      if (response.data.success) {
        return {
          data: response.data.data,
          message: response.data.message,
          success: true
        };
      }
      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error toggling service status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update service status'
      };
    }
  }
};