import express from 'express';
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  toggleFeatured,
  uploadImage,
  getTestimonialStats
} from '../controllers/testimonial.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(admin);

// Testimonial routes
router.get('/', getTestimonials);
router.get('/stats', getTestimonialStats);
router.get('/:id', getTestimonialById);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/approve', approveTestimonial);
router.patch('/:id/featured', toggleFeatured);
router.post('/:id/upload-image', upload.single('image'), uploadImage);

export default router;