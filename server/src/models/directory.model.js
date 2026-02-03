import mongoose from 'mongoose';

const directorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['FOMT', 'FNMT'],
    index: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
directorySchema.index({ type: 1, state: 1, isActive: 1 });

// Virtual for formatted createdAt
directorySchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const Directory = mongoose.model('Directory', directorySchema);

export default Directory;