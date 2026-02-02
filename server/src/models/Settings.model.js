import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Clinic Information
  clinicName: {
    type: String,
    default: 'MEDIHOPE Physiotherapy Centre'
  },
  clinicEmail: {
    type: String,
    default: 'info@medihope.com'
  },
  clinicPhone: {
    type: String,
    default: '+91-6386065599'
  },
  clinicAddress: {
    type: String,
    default: '123 Health Street, Medical City, MC 12345'
  },
  clinicHours: {
    type: String,
    default: '9:00 AM - 7:00 PM'
  },
  clinicDays: {
    type: String,
    default: 'Monday - Saturday'
  },
  
  // Social Media
  whatsappNumber: {
    type: String,
    default: '+91-6386065599'
  },
  facebookUrl: {
    type: String,
    default: 'https://facebook.com/medihope'
  },
  twitterUrl: {
    type: String,
    default: 'https://twitter.com/medihope'
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/medihope'
  },
  linkedinUrl: {
    type: String,
    default: 'https://linkedin.com/company/medihope'
  },
  
  // Notifications
  emailNotifications: {
    type: Boolean,
    default: true
  },
  whatsappNotifications: {
    type: Boolean,
    default: true
  },
  appointmentReminderHours: {
    type: Number,
    default: 24,
    min: 1,
    max: 72
  },
  slotBufferMinutes: {
    type: Number,
    default: 15,
    min: 0,
    max: 60
  },
  
  // Appearance
  primaryColor: {
    type: String,
    default: '#0077B6'
  },
  secondaryColor: {
    type: String,
    default: '#6B7280'
  },
  
  // Security
  enableMaintenance: {
    type: Boolean,
    default: false
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  requireEmailVerification: {
    type: Boolean,
    default: false
  },
  sessionTimeout: {
    type: Number,
    default: 30,
    min: 5,
    max: 240
  },
  
  // Backup
  autoBackupEnabled: {
    type: Boolean,
    default: true
  },
  autoBackupTime: {
    type: String,
    default: '02:00'
  },
  backupRetentionDays: {
    type: Number,
    default: 30,
    min: 1,
    max: 365
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  // Ensure only one settings document exists
  minimize: false
});

// Static method to get or create settings
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;