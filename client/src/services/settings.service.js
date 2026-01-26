import axiosInstance from './axiosInstance';

export const settingsService = {
  // Get settings
  getSettings: async () => {
    try {
      const response = await axiosInstance.get('/admin/settings');
      return {
        data: response.data.data,
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to fetch settings'
      };
    }
  },

  // Update settings
  updateSettings: async (settingsData) => {
    try {
      const response = await axiosInstance.put('/admin/settings', settingsData);
      return {
        data: response.data.data,
        success: true,
        message: response.data.message || 'Settings updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating settings:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to update settings'
      };
    }
  },

  // Create backup
  createBackup: async (backupData = {}) => {
    try {
      const response = await axiosInstance.post('/admin/backup', backupData);
      return {
        data: response.data.data,
        success: true,
        message: response.data.message || 'Backup created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating backup:', error);
      return {
        data: null,
        success: false,
        message: error.response?.data?.message || 'Failed to create backup'
      };
    }
  },

  // Get backup history
  getBackupHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/admin/backup-history?${queryParams}` : '/admin/backup-history';
      
      const response = await axiosInstance.get(url);
      return {
        data: response.data.data,
        pagination: response.data.pagination,
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching backup history:', error);
      return {
        data: [],
        success: false,
        message: error.response?.data?.message || 'Failed to fetch backup history'
      };
    }
  },

  // Download backup
  downloadBackup: async (backupId) => {
    try {
      const response = await axiosInstance.get(`/admin/backup/${backupId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${backupId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return {
        success: true,
        message: 'Backup download started'
      };
    } catch (error) {
      console.error('❌ Error downloading backup:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download backup'
      };
    }
  },

  // Delete backup
  deleteBackup: async (backupId) => {
    try {
      const response = await axiosInstance.delete(`/admin/backup/${backupId}`);
      return {
        success: true,
        message: response.data.message || 'Backup deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting backup:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete backup'
      };
    }
  },

  // Restore backup
  restoreBackup: async (restoreData) => {
    try {
      const response = await axiosInstance.post('/admin/restore', restoreData);
      return {
        success: true,
        message: response.data.message || 'Backup restored successfully'
      };
    } catch (error) {
      console.error('❌ Error restoring backup:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore backup'
      };
    }
  },

  // Restore from file
  restoreFromFile: async (file, collections = 'all') => {
    try {
      const formData = new FormData();
      formData.append('backupFile', file);
      formData.append('restoreFromFile', true);
      formData.append('collections', collections);
      
      const response = await axiosInstance.post('/admin/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        message: response.data.message || 'Backup restored successfully'
      };
    } catch (error) {
      console.error('❌ Error restoring from file:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to restore from file'
      };
    }
  },

  // Reset settings
  resetSettings: async () => {
    try {
      const response = await axiosInstance.post('/admin/reset-settings');
      return {
        data: response.data.data,
        success: true,
        message: response.data.message || 'Settings reset successfully'
      };
    } catch (error) {
      console.error('❌ Error resetting settings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset settings'
      };
    }
  },

  // Delete all data
  deleteAllData: async (confirmation, backupFirst = true) => {
    try {
      const response = await axiosInstance.delete('/admin/delete-all-data', {
        data: { confirmation, backupFirst }
      });
      
      return {
        success: true,
        message: response.data.message || 'All data deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting all data:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete all data'
      };
    }
  },

  // Cleanup backups
  cleanupBackups: async () => {
    try {
      const response = await axiosInstance.post('/admin/cleanup-backups');
      return {
        success: true,
        message: response.data.message || 'Backups cleaned up successfully'
      };
    } catch (error) {
      console.error('❌ Error cleaning up backups:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cleanup backups'
      };
    }
  }
};