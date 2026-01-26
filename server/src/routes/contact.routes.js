// routes/contact.routes.js
import express from 'express';
import {
  sendContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
  getAllContacts,
  getContactById,
  markContactAsRead,
  markAllAsRead,
  bulkDeleteContacts,
  deleteContact
} from '../controllers/contact.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route (for contact form on website)
router.post('/', sendContactMessage);

// Admin routes (for admin panel)
router.use(protect);
router.use(admin);

// Legacy endpoints (keep for backward compatibility)
router.get('/', getContactMessages); // GET /api/contact
router.put('/:id/status', updateContactStatus); // PUT /api/contact/:id/status
router.delete('/:id', deleteContactMessage); // DELETE /api/contact/:id (soft delete/archive)

// New enhanced endpoints (for new admin panel)
router.get('/enhanced', getAllContacts); // GET /api/contact/enhanced
router.get('/enhanced/:id', getContactById); // GET /api/contact/enhanced/:id
router.put('/enhanced/:id/read', markContactAsRead); // PUT /api/contact/enhanced/:id/read
router.put('/enhanced/:id/status', updateContactStatus); // PUT /api/contact/enhanced/:id/status
router.delete('/enhanced/:id', deleteContact); // DELETE /api/contact/enhanced/:id (hard delete)
router.put('/enhanced/read-all', markAllAsRead); // PUT /api/contact/enhanced/read-all
router.delete('/enhanced/bulk', bulkDeleteContacts); // DELETE /api/contact/enhanced/bulk

export default router;