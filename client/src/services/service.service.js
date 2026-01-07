import axiosInstance from './axiosInstance';

export const serviceService = {
  getAllServices: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/services?${queryParams}`);
    return response.data;
  },

  getServiceById: async (id) => {
    const response = await axiosInstance.get(`/services/${id}`);
    return response.data;
  },

  createService: async (serviceData) => {
    const response = await axiosInstance.post('/services', serviceData);
    return response.data;
  },

  updateService: async (id, serviceData) => {
    const response = await axiosInstance.put(`/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id) => {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
  },
};