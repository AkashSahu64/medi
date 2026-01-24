import axiosInstance from './axiosInstance';

export const userService = {
  // Get all users with optional filtering
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/users?${queryParams}`);
    return response.data;
  },

  // Get single user by ID
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  // Reset password
  resetPassword: async (id) => {
    const response = await axiosInstance.post(`/users/${id}/reset-password`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  }
};