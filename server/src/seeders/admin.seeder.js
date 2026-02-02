import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for admin seeding');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@medihope.com' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@medihope.com',
      password: hashedPassword,
      phone: '6386065599',
      role: 'admin',
      isVerified: true,
      createdAt: new Date()
    });

    await adminUser.save();
    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@medihope.com');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️ IMPORTANT: Change this password immediately after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createDefaultAdmin();