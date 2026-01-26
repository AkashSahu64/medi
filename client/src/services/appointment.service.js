import axiosInstance from './axiosInstance';

export const appointmentService = {
  // Get available slots for a date
  getAvailableSlots: async (date) => {
    try {
      console.log('📅 Fetching slots for date:', date);
      
      const response = await axiosInstance.get(`/appointments/slots/${date}`);
      
      if (response.data.success) {
        console.log('✅ Available slots:', response.data.data.length);
        return {
          data: response.data.data,
          success: true
        };
      } else {
        console.error('❌ API error:', response.data.message);
        return {
          data: [],
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      console.error('❌ Error fetching available slots:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return {
        data: [],
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available slots'
      };
    }
  },


  // Create new appointment (for admin)
 createAppointment: async (appointmentData) => {
    try {
      console.log('📝 Creating appointment via admin route:', appointmentData);
      
      // Use admin route for admin panel
      const response = await axiosInstance.post('/appointments/admin', appointmentData);
      
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
      console.error('❌ Error creating appointment:', {
        message: error.message,
        response: error.response?.data
      });
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to create appointment'
      };
    }
  },

  // Get all appointments (Admin)
  getAllAppointments: async (params = {}) => {
    try {
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const url = queryParams ? `/appointments?${queryParams}` : '/appointments';
      
      console.log('📡 Fetching appointments from:', url);
      
      const response = await axiosInstance.get(url);
      
      console.log('✅ Appointments response:', {
        count: response.data?.data?.length,
        total: response.data?.total,
        pages: response.data?.pages
      });
      
      if (response.data.success) {
        return {
          data: response.data.data || [],
          total: response.data.total || 0,
          pages: response.data.pages || 1,
          success: true
        };
      }
      return {
        data: [],
        total: 0,
        pages: 1,
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error fetching appointments:', {
        message: error.message,
        status: error.response?.status
      });
      return {
        data: [],
        total: 0,
        pages: 1,
        success: false,
        message: 'Failed to load appointments'
      };
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/appointments/${id}`);
      
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
      console.error('Error fetching appointment:', error);
      return {
        data: null,
        success: false
      };
    }
  },

  // Update appointment (full update)
  updateAppointment: async (id, appointmentData) => {
    try {
      console.log(`🔄 Updating appointment ${id}:`, appointmentData);
      
      const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
      
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
      console.error('❌ Error updating appointment:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to update appointment'
      };
    }
  },

  // Update appointment status only
  updateAppointmentStatus: async (id, status, notes = '') => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}/status`, {
        status,
        notes,
      });
      
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
      console.error('❌ Error updating appointment status:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to update appointment status'
      };
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    try {
      const response = await axiosInstance.delete(`/appointments/${id}`);
      
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
      console.error('❌ Error deleting appointment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete appointment'
      };
    }
  },

  // Get user appointments
  getMyAppointments: async () => {
    try {
      const response = await axiosInstance.get('/appointments/my-appointments');
      
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
      console.error('Error fetching user appointments:', error);
      return {
        data: [],
        success: false
      };
    }
  },

  // Cancel appointment (alias for status update to cancelled)
  cancelAppointment: async (id) => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}/status`, {
        status: 'cancelled',
        notes: 'Cancelled by admin'
      });
      
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
      console.error('❌ Error cancelling appointment:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to cancel appointment'
      };
    }
  }
};