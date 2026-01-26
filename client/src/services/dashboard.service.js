import axiosInstance from './axiosInstance';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      console.log('📊 Fetching dashboard stats...');
      
      const response = await axiosInstance.get('/admin/dashboard/stats');
      
      if (response.data.success) {
        return {
          data: response.data.data,
          success: true
        };
      }
      return {
        data: null,
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats'
      };
    }
  },

  // Get recent activity
  getRecentActivity: async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/activity');
      
      if (response.data.success) {
        return {
          data: response.data.data,
          success: true
        };
      }
      return {
        data: [],
        success: false
      };
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return {
        data: [],
        success: false
      };
    }
  },

  // Get revenue statistics
  getRevenueStats: async (period = 'monthly') => {
    try {
      const response = await axiosInstance.get(`/admin/dashboard/revenue?period=${period}`);
      
      if (response.data.success) {
        return {
          data: response.data.data,
          success: true
        };
      }
      return {
        data: null,
        success: false
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {
        data: null,
        success: false
      };
    }
  }
};