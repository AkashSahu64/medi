import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide service title'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide service description'],
  },
  benefits: [{
    type: String,
    required: [true, 'Please provide at least one benefit'],
  }],
  duration: {
    type: Number,
    required: [true, 'Please provide session duration'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [120, 'Maximum duration is 120 minutes'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide service price'],
  },
  category: {
    type: String,
    enum: ['musculoskeletal', 'neurological', 'sports', 'pediatric', 'geriatric', 'postoperative'],
    required: true,
  },
  image: {
    type: String,
    default: 'default-service.jpg',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;