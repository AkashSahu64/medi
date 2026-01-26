import express from 'express';
import {
  getAvailableSlots,
  createAppointment,
  getMyAppointments,
  getAppointments,
  getAppointmentById,
  createAppointmentAdmin,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from '../controllers/appointment.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get('/slots/:date', getAvailableSlots);
router.post('/', createAppointment); // Public booking

// ========== PROTECTED USER ROUTES ==========
router.get('/my-appointments', protect, getMyAppointments);

// ========== ADMIN ROUTES ==========
router.get('/', protect, admin, getAppointments);
router.get('/:id', protect, admin, getAppointmentById);
router.post('/admin', protect, admin, createAppointmentAdmin); // Admin create
router.put('/:id', protect, admin, updateAppointment);
router.put('/:id/status', protect, admin, updateAppointmentStatus);
router.delete('/:id', protect, admin, deleteAppointment);

export default router;