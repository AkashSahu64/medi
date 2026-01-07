import express from 'express';
import {
  getAvailableSlots,
  createAppointment,
  getMyAppointments,
  getAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/slots/:date', getAvailableSlots);
router.post('/', createAppointment); // Can be public for guest booking

// Protected user routes
router.get('/my-appointments', protect, getMyAppointments);

// Admin routes
router.get('/', protect, admin, getAppointments);
router.put('/:id/status', protect, admin, updateAppointmentStatus);

export default router;