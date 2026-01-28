import express from 'express';
import {
  getGallery,
  getGalleryById,
  getSliderItems,
  uploadMedia,
  updateGalleryItem,
  deleteGalleryItem,
  toggleFeatured,
  toggleDetailButton,
  toggleSlider,
  getGalleryStats
} from '../controllers/gallery.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/slider', getSliderItems);

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

// Gallery admin routes
router.get('/', getGallery);
router.get('/stats', getGalleryStats);
router.get('/:id', getGalleryById);
router.post('/upload', upload.array('files', 10), uploadMedia);
router.put('/:id', updateGalleryItem);
router.patch('/:id/featured', toggleFeatured);
router.patch('/:id/detail-button', toggleDetailButton);
router.patch('/:id/slider', toggleSlider);
router.delete('/:id', deleteGalleryItem);

export default router;