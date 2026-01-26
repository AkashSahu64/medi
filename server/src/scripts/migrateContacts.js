// scripts/migrateContacts.js
import mongoose from 'mongoose';
import Contact from '../models/Contact.model.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateContacts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');
    
    // Add isRead field to all contacts
    const contacts = await Contact.find({ isRead: { $exists: false } });
    
    console.log(`Found ${contacts.length} contacts to migrate`);
    
    let updatedCount = 0;
    for (const contact of contacts) {
      // Set isRead based on status
      contact.isRead = contact.status !== 'new';
      await contact.save();
      updatedCount++;
      
      if (updatedCount % 100 === 0) {
        console.log(`✅ Updated ${updatedCount} contacts...`);
      }
    }
    
    console.log(`\n🎉 Migration completed: Updated ${updatedCount} contacts with isRead field`);
    
    // Create indexes for better performance
    console.log('🔧 Creating indexes...');
    try {
      await Contact.collection.createIndex({ status: 1, createdAt: -1 });
      await Contact.collection.createIndex({ isRead: 1 });
      console.log('✅ Indexes created successfully');
    } catch (indexError) {
      console.log('Indexes might already exist:', indexError.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Check if script is being run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  migrateContacts();
}

export default migrateContacts;