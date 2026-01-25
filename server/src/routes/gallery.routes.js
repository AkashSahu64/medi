import express from 'express';
import {
  getGallery,
  getGalleryById,
  uploadMedia,
  updateGalleryItem,
  deleteGalleryItem,
  toggleFeatured,
  getGalleryStats
} from '../controllers/gallery.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(admin);

// Gallery routes
router.get('/', getGallery);
router.get('/stats', getGalleryStats);
router.get('/:id', getGalleryById);
router.post('/upload', upload.array('files', 10), uploadMedia);
router.put('/:id', updateGalleryItem);
router.patch('/:id/featured', toggleFeatured);
router.delete('/:id', deleteGalleryItem);

export default router;