// server.js mein debug code add karein
import './env.js';

import app from './app.js';
import connectDB from './config/db.js';
import './config/passport.js'; 
import bcrypt from 'bcryptjs';
import { verifyEmailConfig } from './utils/emailService.js';
import User from './models/User.model.js';
import Settings from './models/Settings.model.js';
import { setupBackupCron } from './cron/backup.cron.js';

import twilio from 'twilio';

const testClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

testClient.api.accounts(process.env.TWILIO_ACCOUNT_SID)
  .fetch()
  .then(() => console.log('✅ Twilio Auth SUCCESS'))
  .catch(err => console.error('❌ Twilio Auth FAILED:', err.message));


const PORT = process.env.PORT || 5000;

const initializeSettings = async () => {
  try {
    await Settings.getSettings();
    console.log('✅ Settings initialized');
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@medihope.com',
      role: 'admin' 
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@123', 
        10
      );

      const adminUser = await User.create({
        name: 'System Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@medihope.com',
        password: hashedPassword,
        phone: process.env.ADMIN_PHONE || '8076839661',
        role: 'admin',
        isVerified: true
      });

      console.log('✅ Default admin user created:');
      console.log(`   📧 Email: ${adminUser.email}`);
      console.log(`   🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
      console.log('⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

console.log('🔍 DEBUG: Before connectDB');
// Connect to database
connectDB();

console.log('🔍 DEBUG: After connectDB');

connectDB().then(() => {
  createDefaultAdmin();
  initializeSettings();
  setupBackupCron();
});

// Import whatsappService to see when it fails
import('./utils/whatsappService.js')
  .then(() => console.log('✅ WhatsAppService loaded successfully'))
  .catch(err => {
    console.error('❌ WhatsAppService loading failed:', err.message);
    console.error('Full error:', err);
  });

console.log('🔍 DEBUG: Before server.listen');

const server = app.listen(PORT, () => {
  console.log(`MEDIHOPE Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('📧 Email:', process.env.EMAIL_USER ? 'Configured' : 'Not configured');
  console.log('📱 WhatsApp:', process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured');
  console.log('🔐 Google OAuth:', process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured');
});

console.log('🔍 DEBUG: After server.listen');

createDefaultAdmin();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`🚨 Unhandled Rejection at:`, promise);
  console.log(`🚨 Reason: ${err.message}`);
  console.log(`🚨 Stack: ${err.stack}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default server;