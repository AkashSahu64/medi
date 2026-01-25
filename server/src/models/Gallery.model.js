import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['equipment', 'session', 'clinic', 'exercises', 'team', 'success']
  },
  type: {
    type: String,
    required: [true, 'Please specify media type'],
    enum: ['image', 'video']
  },
  url: {
    type: String,
    required: [true, 'Please provide media URL']
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide thumbnail URL']
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  size: {
    type: Number,
    default: 0
  },
  format: {
    type: String
  },
  duration: {
    type: Number, // for videos in seconds
    default: 0
  },
  dimensions: {
    width: Number,
    height: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for filtering
gallerySchema.index({ category: 1, type: 1, featured: 1 });
gallerySchema.index({ title: 'text', description: 'text', tags: 'text' });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;