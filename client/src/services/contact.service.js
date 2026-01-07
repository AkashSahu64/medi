import axiosInstance from './axiosInstance';

export const contactService = {
  sendMessage: async (messageData) => {
    const response = await axiosInstance.post('/contact', messageData);
    return response.data;
  },

  getMessages: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/contact?${queryParams}`);
    return response.data;
  },

  updateMessageStatus: async (id, status) => {
    const response = await axiosInstance.put(`/contact/${id}/status`, { status });
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await axiosInstance.delete(`/contact/${id}`);
    return response.data;
  },
};