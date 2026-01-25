import express from 'express';
import {
  // Public routes
  getServices,
  getService,
  
  // Admin routes (original)
  createService,
  updateService,
  deleteService,
  
  // Admin routes (new)
  getAllServicesForAdmin,
  getServiceForAdmin,
  createServiceAdmin,
  updateServiceAdmin,
  deleteServiceAdmin,
  
  // Test and utility routes
  testServices,
  toggleServiceStatus
} from '../controllers/service.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get('/', getServices);
router.get('/:id', getService);

// ========== ADMIN ROUTES ==========
// New admin routes (recommended)
router.get('/admin/all', protect, admin, getAllServicesForAdmin);
router.get('/admin/:id', protect, admin, getServiceForAdmin);
router.post('/admin', protect, admin, createServiceAdmin);
router.put('/admin/:id', protect, admin, updateServiceAdmin);
router.delete('/admin/:id', protect, admin, deleteServiceAdmin);

// Original admin routes (for backward compatibility)
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

// ========== UTILITY ROUTES ==========
router.get('/test/all', testServices); // For testing
router.patch('/:id/status', protect, admin, toggleServiceStatus); // Status toggle

export default router;