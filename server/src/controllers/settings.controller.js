import Settings from '../models/Settings.model.js';
import Backup from '../models/Backup.model.js';
import Appointment from '../models/Appointment.model.js';
import User from '../models/User.model.js';
import Service from '../models/Service.model.js';
import Contact from '../models/Contact.model.js';
import Testimonial from '../models/Testimonial.model.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    console.log('📝 Updating settings:', req.body);
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      // Update each field
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          settings[key] = req.body[key];
        }
      });
    }
    
    settings.lastUpdated = Date.now();
    if (req.user) {
      settings.updatedBy = req.user.id;
    }
    
    await settings.save();
    
    console.log('✅ Settings updated successfully:', settings._id);
    
    // Don't update CSS if it causes errors - we'll handle it on frontend
    // if (req.body.primaryColor || req.body.secondaryColor) {
    //   updateCSSVariables(settings);
    // }
    
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    next(error);
  }
};

// Simple function to update CSS (optional)
const updateCSSVariables = async (settings) => {
  try {
    // Create CSS content with the new colors
    const cssContent = `
:root {
  --primary: ${settings.primaryColor || '#0077B6'};
  --secondary: ${settings.secondaryColor || '#6B7280'};
  --primary-dark: ${adjustColor(settings.primaryColor || '#0077B6', -20)};
  --primary-light: ${adjustColor(settings.primaryColor || '#0077B6', 20)};
}
    `;
    
    // Ensure directory exists
    const publicDir = path.join(__dirname, '../../public');
    const cssDir = path.join(publicDir, 'css');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }
    
    // Write CSS file
    const cssPath = path.join(cssDir, 'theme.css');
    fs.writeFileSync(cssPath, cssContent);
    
    console.log('🎨 CSS variables updated');
  } catch (error) {
    console.error('⚠️ Could not update CSS (optional):', error.message);
    // Don't throw error - CSS update is optional
  }
};

// Simple color adjustment function
const adjustColor = (color, amount) => {
  // Return same color - in production use a proper color library
  return color;
};


// @desc    Create backup
// @route   POST /api/admin/backup
// @access  Private/Admin
export const createBackup = async (req, res, next) => {
  try {
    const { type = 'manual', collections = 'all' } = req.body;
    
    // Define collections to backup
    const collectionsToBackup = collections === 'all' 
      ? ['appointments', 'users', 'services', 'settings', 'contacts', 'testimonials']
      : collections.split(',');
    
    const backupData = {};
    const backupPromises = [];
    
    // Backup each collection
    if (collectionsToBackup.includes('appointments')) {
      backupPromises.push(
        Appointment.find().lean().then(data => {
          backupData.appointments = data;
        })
      );
    }
    
    if (collectionsToBackup.includes('users')) {
      backupPromises.push(
        User.find().lean().then(data => {
          // Remove sensitive data
          backupData.users = data.map(user => {
            const { password, resetPasswordToken, resetPasswordExpire, ...safeUser } = user;
            return safeUser;
          });
        })
      );
    }
    
    if (collectionsToBackup.includes('services')) {
      backupPromises.push(
        Service.find().lean().then(data => {
          backupData.services = data;
        })
      );
    }
    
    if (collectionsToBackup.includes('settings')) {
      backupPromises.push(
        Settings.getSettings().then(data => {
          backupData.settings = data.toObject();
        })
      );
    }
    
    if (collectionsToBackup.includes('contacts')) {
      backupPromises.push(
        Contact.find().lean().then(data => {
          backupData.contacts = data;
        })
      );
    }
    
    if (collectionsToBackup.includes('testimonials')) {
      backupPromises.push(
        Testimonial.find().lean().then(data => {
          backupData.testimonials = data;
        })
      );
    }
    
    await Promise.all(backupPromises);
    
    // Calculate backup size
    const backupString = JSON.stringify(backupData);
    const backupSize = Buffer.byteLength(backupString, 'utf8');
    
    // Save backup to database
    const backup = await Backup.create({
      name: `backup-${Date.now()}`,
      type: type,
      size: backupSize,
      data: backupData,
      collections: collectionsToBackup,
      createdBy: req.user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    // Also save to file system for safety
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFilePath = path.join(backupDir, `${backup.name}.json`);
    fs.writeFileSync(backupFilePath, backupString);
    
    res.status(201).json({
      success: true,
      data: {
        id: backup._id,
        name: backup.name,
        type: backup.type,
        size: formatBytes(backupSize),
        createdAt: backup.createdAt,
        collections: backup.collections.length
      },
      message: 'Backup created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore from backup
// @route   POST /api/admin/restore
// @access  Private/Admin
export const restoreBackup = async (req, res, next) => {
  try {
    const { backupId, restoreFromFile, collections = 'all' } = req.body;
    
    let backupData;
    
    if (restoreFromFile && req.file) {
      // Restore from uploaded file
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      backupData = JSON.parse(fileContent);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    } else if (backupId) {
      // Restore from database backup
      const backup = await Backup.findById(backupId);
      if (!backup) {
        return res.status(404).json({
          success: false,
          message: 'Backup not found'
        });
      }
      backupData = backup.data;
    } else {
      return res.status(400).json({
        success: false,
        message: 'No backup source provided'
      });
    }
    
    // Define collections to restore
    const collectionsToRestore = collections === 'all' 
      ? Object.keys(backupData)
      : collections.split(',');
    
    // Start a transaction for atomic restore
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Restore each collection
      if (collectionsToRestore.includes('appointments') && backupData.appointments) {
        await Appointment.deleteMany({}).session(session);
        await Appointment.insertMany(backupData.appointments, { session });
      }
      
      if (collectionsToRestore.includes('users') && backupData.users) {
        await User.deleteMany({}).session(session);
        await User.insertMany(backupData.users, { session });
      }
      
      if (collectionsToRestore.includes('services') && backupData.services) {
        await Service.deleteMany({}).session(session);
        await Service.insertMany(backupData.services, { session });
      }
      
      if (collectionsToRestore.includes('settings') && backupData.settings) {
        await Settings.deleteMany({}).session(session);
        await Settings.create([backupData.settings], { session });
      }
      
      if (collectionsToRestore.includes('contacts') && backupData.contacts) {
        await Contact.deleteMany({}).session(session);
        await Contact.insertMany(backupData.contacts, { session });
      }
      
      if (collectionsToRestore.includes('testimonials') && backupData.testimonials) {
        await Testimonial.deleteMany({}).session(session);
        await Testimonial.insertMany(backupData.testimonials, { session });
      }
      
      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: 'Backup restored successfully'
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get backup history
// @route   GET /api/admin/backup-history
// @access  Private/Admin
export const getBackupHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    
    const query = {};
    if (type && type !== 'all') {
      query.type = type;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const backups = await Backup.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Backup.countDocuments(query);
    
    // Format backup data for response
    const formattedBackups = backups.map(backup => ({
      id: backup._id,
      name: backup.name,
      type: backup.type,
      size: formatBytes(backup.size),
      collections: backup.collections.length,
      createdAt: backup.createdAt,
      createdBy: backup.createdBy
    }));
    
    res.status(200).json({
      success: true,
      data: formattedBackups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download backup
// @route   GET /api/admin/backup/:id/download
// @access  Private/Admin
export const downloadBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const backup = await Backup.findById(id);
    if (!backup) {
      return res.status(404).json({
        success: false,
        message: 'Backup not found'
      });
    }
    
    const backupString = JSON.stringify(backup.data, null, 2);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${backup.name}.json`);
    res.send(backupString);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete backup
// @route   DELETE /api/admin/backup/:id
// @access  Private/Admin
export const deleteBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const backup = await Backup.findById(id);
    if (!backup) {
      return res.status(404).json({
        success: false,
        message: 'Backup not found'
      });
    }
    
    // Delete from database
    await Backup.findByIdAndDelete(id);
    
    // Delete from file system if exists
    const backupFilePath = path.join(__dirname, '../backups', `${backup.name}.json`);
    if (fs.existsSync(backupFilePath)) {
      fs.unlinkSync(backupFilePath);
    }
    
    res.status(200).json({
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset all settings to default
// @route   POST /api/admin/reset-settings
// @access  Private/Admin
export const resetSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    // Get default values from schema
    const defaultSettings = {};
    Object.keys(Settings.schema.paths).forEach(path => {
      if (Settings.schema.paths[path].defaultValue !== undefined) {
        defaultSettings[path] = Settings.schema.paths[path].defaultValue;
      }
    });
    
    // Reset to defaults
    Object.keys(defaultSettings).forEach(key => {
      settings[key] = defaultSettings[key];
    });
    
    settings.lastUpdated = Date.now();
    settings.updatedBy = req.user.id;
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings reset to default values'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all data (DANGER ZONE)
// @route   DELETE /api/admin/delete-all-data
// @access  Private/Admin
export const deleteAllData = async (req, res, next) => {
  try {
    const { confirmation, backupFirst = true } = req.body;
    
    if (confirmation !== 'DELETE_ALL_DATA_CONFIRM') {
      return res.status(400).json({
        success: false,
        message: 'Confirmation required. Please type DELETE_ALL_DATA_CONFIRM'
      });
    }
    
    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create backup first if requested
      if (backupFirst) {
        const backupData = {};
        
        const [appointments, users, services, settings, contacts, testimonials] = await Promise.all([
          Appointment.find().lean(),
          User.find().lean(),
          Service.find().lean(),
          Settings.getSettings(),
          Contact.find().lean(),
          Testimonial.find().lean()
        ]);
        
        backupData.appointments = appointments;
        backupData.users = users.map(user => {
          const { password, resetPasswordToken, resetPasswordExpire, ...safeUser } = user;
          return safeUser;
        });
        backupData.services = services;
        backupData.settings = settings.toObject();
        backupData.contacts = contacts;
        backupData.testimonials = testimonials;
        
        const backupString = JSON.stringify(backupData);
        const backupSize = Buffer.byteLength(backupString, 'utf8');
        
        await Backup.create({
          name: `emergency-backup-${Date.now()}`,
          type: 'manual',
          size: backupSize,
          data: backupData,
          collections: ['appointments', 'users', 'services', 'settings', 'contacts', 'testimonials'],
          createdBy: req.user.id,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        });
      }
      
      // Delete all data except settings and backups
      await Promise.all([
        Appointment.deleteMany({}).session(session),
        User.deleteMany({ role: { $ne: 'admin' } }).session(session), // Keep admin users
        Service.deleteMany({}).session(session),
        Contact.deleteMany({}).session(session),
        Testimonial.deleteMany({}).session(session)
      ]);
      
      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: backupFirst 
          ? 'All data deleted successfully. Emergency backup created.'
          : 'All data deleted successfully.'
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Clean up old backups
// @route   POST /api/admin/cleanup-backups
// @access  Private/Admin
export const cleanupBackups = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    const retentionDays = settings.backupRetentionDays || 30;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const result = await Backup.deleteMany({
      type: { $ne: 'manual' },
      createdAt: { $lt: cutoffDate }
    });
    
    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old backups`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to format bytes
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};