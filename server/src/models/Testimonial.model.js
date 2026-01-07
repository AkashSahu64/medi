import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Please provide patient name'],
  },
  patientAge: {
    type: Number,
    min: [1, 'Age must be positive'],
    max: [120, 'Age must be reasonable'],
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition treated'],
  },
  content: {
    type: String,
    required: [true, 'Please provide testimonial content'],
    maxlength: [500, 'Testimonial cannot exceed 500 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  image: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;