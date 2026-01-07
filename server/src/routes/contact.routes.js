import express from 'express';
import {
  sendContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from '../controllers/contact.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/', sendContactMessage);

// Admin routes
router.get('/', protect, admin, getContactMessages);
router.put('/:id/status', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContactMessage);

export default router;