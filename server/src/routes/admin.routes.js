import express from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getRevenueStats,
  getAllContacts,
  updateContactStatus,
  deleteContact
} from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);
router.get('/dashboard/revenue', getRevenueStats);

// Contact management routes
router.get('/contacts', getAllContacts);
router.put('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

export default router;