// routes/admin.routes.js
import express from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getRevenueStats,
  getAllContacts,
  getContactById,
  markContactAsRead,
  updateContactStatus,
  deleteContact
} from '../controllers/admin.controller.js';
import settingsRoutes from './settings.routes.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(admin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);
router.get('/dashboard/revenue', getRevenueStats);

// Mount settings routes
router.use('/', settingsRoutes);

// Contact management routes
router.get('/contacts', getAllContacts);
router.get('/contacts/:id', getContactById);
router.put('/contacts/:id/read', markContactAsRead);
router.put('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

export default router;