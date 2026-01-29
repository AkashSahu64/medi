import express from 'express';
import {
  getServices,
  getService,
  getAllServicesForAdmin,
  getServiceForAdmin,
  createService,
  createServiceAdmin,
  updateService,
  updateServiceAdmin,
  deleteService,
  deleteServiceAdmin,
  testServices,
  toggleServiceStatus,
  togglePriceVisibility
} from '../controllers/service.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get('/', getServices);
router.get('/:id', getService);

// ========== ADMIN ROUTES ==========
router.get('/admin/all', protect, admin, getAllServicesForAdmin);
router.get('/admin/:id', protect, admin, getServiceForAdmin);
router.post('/admin', protect, admin, createServiceAdmin);
router.put('/admin/:id', protect, admin, updateServiceAdmin);
router.delete('/admin/:id', protect, admin, deleteServiceAdmin);
router.patch('/admin/:id/price-visibility', protect, admin, togglePriceVisibility);

// Original admin routes (for backward compatibility)
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

// ========== UTILITY ROUTES ==========
router.get('/test/all', testServices); // For testing
router.patch('/:id/status', protect, admin, toggleServiceStatus); // Status toggle

export default router;