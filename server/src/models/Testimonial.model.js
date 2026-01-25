import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Please provide patient name'],
    trim: true,
    maxlength: [100, 'Patient name cannot exceed 100 characters']
  },
  patientAge: {
    type: Number,
    required: [true, 'Please provide patient age'],
    min: [1, 'Age must be positive'],
    max: [120, 'Age must be reasonable']
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition treated'],
    trim: true,
    maxlength: [100, 'Condition cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide testimonial content'],
    trim: true,
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5
  },
  image: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=Unknown&background=random'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for filtering
testimonialSchema.index({ isApproved: 1, featured: 1 });
testimonialSchema.index({ patientName: 'text', condition: 'text', content: 'text' });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;