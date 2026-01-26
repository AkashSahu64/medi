// services/notification.service.js
import axiosInstance from './axiosInstance';

export const notificationService = {
  // Get notifications
  getNotifications: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/notifications?${queryParams}` : '/notifications';
      
      const response = await axiosInstance.get(url);
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return {
        data: [],
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications'
      };
    }
  },

  // Get notification stats
  getNotificationStats: async () => {
    try {
      const response = await axiosInstance.get('/notifications/stats');
      return {
        data: response.data.data,
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching notification stats:', error);
      return {
        data: { totalUnread: 0, byType: [] },
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notification stats'
      };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark notification as read'
      };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await axiosInstance.put('/notifications/read-all');
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark all notifications as read'
      };
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/notifications/${notificationId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete notification'
      };
    }
  }
};