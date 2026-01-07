import axiosInstance from './axiosInstance';

export const appointmentService = {
  getAvailableSlots: async (date) => {
    const response = await axiosInstance.get(`/appointments/slots/${date}`);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await axiosInstance.get('/appointments/my-appointments');
    return response.data;
  },

  getAllAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/appointments?${queryParams}`);
    return response.data;
  },

  updateAppointmentStatus: async (id, status, notes = '') => {
    const response = await axiosInstance.put(`/appointments/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await axiosInstance.put(`/appointments/${id}/status`, {
      status: 'cancelled',
    });
    return response.data;
  },
};