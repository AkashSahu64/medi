// models/Contact.model.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    trim: true,
    minlength: [3, 'Subject must be at least 3 characters'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  repliedAt: {
    type: Date
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  archivedAt: {
    type: Date
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

// Update the updatedAt timestamp on save
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set isRead based on status
  if (this.status !== 'new' && !this.isRead) {
    this.isRead = true;
  }
  
  next();
});

// Create text index for search
contactSchema.index({ name: 'text', email: 'text', subject: 'text', message: 'text' });

// Index for faster queries
contactSchema.index({ status: 1, isRead: 1, createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;