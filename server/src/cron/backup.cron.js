import cron from 'node-cron';
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

export const setupBackupCron = () => {
  // Run daily at specified time
  cron.schedule('0 2 * * *', async () => { // 2 AM daily
    try {
      console.log('🔄 Starting automated backup...');
      
      const settings = await Settings.getSettings();
      
      if (!settings.autoBackupEnabled) {
        console.log('⏸️ Auto backup disabled, skipping...');
        return;
      }
      
      // Create backup data
      const backupData = {};
      
      const [appointments, users, services, contacts, testimonials] = await Promise.all([
        Appointment.find().lean(),
        User.find().lean(),
        Service.find().lean(),
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
      
      // Save backup to database
      const backup = await Backup.create({
        name: `auto-backup-${Date.now()}`,
        type: 'auto',
        size: backupSize,
        data: backupData,
        collections: ['appointments', 'users', 'services', 'settings', 'contacts', 'testimonials'],
        expiresAt: new Date(Date.now() + (settings.backupRetentionDays || 30) * 24 * 60 * 60 * 1000)
      });
      
      // Save to file system
      const backupDir = path.join(__dirname, '../backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const backupFilePath = path.join(backupDir, `${backup.name}.json`);
      fs.writeFileSync(backupFilePath, backupString);
      
      console.log(`✅ Auto backup created: ${backup.name} (${formatBytes(backupSize)})`);
      
      // Cleanup old backups
      await cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Error in auto backup:', error);
    }
  });
  
  console.log('⏰ Auto backup scheduler started');
};

const cleanupOldBackups = async () => {
  try {
    const settings = await Settings.getSettings();
    const retentionDays = settings.backupRetentionDays || 30;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const oldBackups = await Backup.find({
      type: { $ne: 'manual' },
      createdAt: { $lt: cutoffDate }
    });
    
    for (const backup of oldBackups) {
      const backupFilePath = path.join(__dirname, '../backups', `${backup.name}.json`);
      if (fs.existsSync(backupFilePath)) {
        fs.unlinkSync(backupFilePath);
      }
    }
    
    const result = await Backup.deleteMany({
      type: { $ne: 'manual' },
      createdAt: { $lt: cutoffDate }
    });
    
    console.log(`🧹 Cleaned up ${result.deletedCount} old backups`);
    
  } catch (error) {
    console.error('❌ Error cleaning up old backups:', error);
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};