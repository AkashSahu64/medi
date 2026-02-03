import axiosInstance from './axiosInstance';

export const directoryService = {
  // Get directories by type (public)
  getDirectories: async (type, state = null) => {
    const params = { type };
    if (state && state !== 'all') {
      params.state = state;
    }
    
    const response = await axiosInstance.get('/directories', { params });
    return response.data;
  },

  // Get all states (admin only)
  getStates: async () => {
    const response = await axiosInstance.get('/directories/states');
    return response.data;
  },

  // Get directory stats (admin only)
  getStats: async () => {
    const response = await axiosInstance.get('/directories/stats');
    return response.data;
  },

  // Create directory entry (admin only)
  createDirectory: async (directoryData) => {
    const response = await axiosInstance.post('/directories', directoryData);
    return response.data;
  },

  // Update directory entry (admin only)
  updateDirectory: async (id, directoryData) => {
    const response = await axiosInstance.put(`/directories/${id}`, directoryData);
    return response.data;
  },

  // Delete directory entry (admin only)
  deleteDirectory: async (id) => {
    const response = await axiosInstance.delete(`/directories/${id}`);
    return response.data;
  },

  // Get single directory by ID (admin only)
  getDirectoryById: async (id) => {
    const response = await axiosInstance.get(`/directories/${id}`);
    return response.data;
  }
};