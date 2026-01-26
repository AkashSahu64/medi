// services/contact.service.js
import axiosInstance from './axiosInstance';

export const contactService = {
  // ========== PUBLIC ENDPOINTS ==========
  
  // Send contact message (for contact form)
  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/contact', messageData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error sending contact message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  // ========== ADMIN ENDPOINTS (Legacy) ==========
  
  // Get all messages (legacy)
  getMessages: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(`/contact?${queryParams}`);
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      console.error('❌ Error fetching messages (legacy):', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch messages'
      };
    }
  },

  // Update message status (legacy)
  updateMessageStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/contact/${id}/status`, { status });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error updating message status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update status'
      };
    }
  },

  // Delete/archive message (legacy - soft delete)
  deleteMessage: async (id) => {
    try {
      const response = await axiosInstance.delete(`/contact/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete message'
      };
    }
  },

  // ========== ENHANCED ADMIN ENDPOINTS ==========
  
  // Get all contacts with enhanced features
  getContacts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/contact/enhanced?${queryParams}` : '/contact/enhanced';
      
      const response = await axiosInstance.get(url);
      return {
        data: response.data.data,
        stats: response.data.stats,
        pagination: response.data.pagination,
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching contacts:', error);
      return {
        data: [],
        stats: { total: 0, new: 0, unread: 0, read: 0, replied: 0, archived: 0 },
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contacts'
      };
    }
  },

  // Get single contact with details
  getContactById: async (contactId) => {
    try {
      const response = await axiosInstance.get(`/contact/enhanced/${contactId}`);
      return {
        data: response.data.data,
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching contact:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contact'
      };
    }
  },

  // Mark contact as read
  markContactAsRead: async (contactId) => {
    try {
      const response = await axiosInstance.put(`/contact/enhanced/${contactId}/read`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error marking contact as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark contact as read'
      };
    }
  },

  // Update contact status with reply
  updateContactStatus: async (contactId, status, replyMessage = '') => {
    try {
      const response = await axiosInstance.put(`/contact/enhanced/${contactId}/status`, { 
        status, 
        replyMessage 
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error updating contact status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contact status'
      };
    }
  },

  // Delete contact (hard delete)
  deleteContact: async (contactId) => {
    try {
      const response = await axiosInstance.delete(`/contact/enhanced/${contactId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error deleting contact:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete contact'
      };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await axiosInstance.put('/contact/enhanced/read-all');
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark all as read'
      };
    }
  },

  // Bulk delete
  bulkDeleteContacts: async (contactIds) => {
    try {
      const response = await axiosInstance.delete('/contact/enhanced/bulk', { 
        data: { contactIds } 
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error bulk deleting contacts:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bulk delete contacts'
      };
    }
  },

  // Quick reply via email
  quickReply: async (contactId, message) => {
    try {
      const response = await axiosInstance.post(`/contact/enhanced/${contactId}/reply`, { message });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error sending quick reply:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reply'
      };
    }
  }
};