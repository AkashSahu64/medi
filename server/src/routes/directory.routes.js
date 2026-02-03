import express from 'express';
import {
  getDirectories,
  getDirectoryById,
  createDirectory,
  updateDirectory,
  deleteDirectory,
  getAllStates,
  getDirectoryStats
} from '../controllers/directory.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getDirectories);

// Admin routes (protected)
router.use(protect);
router.use(admin);

router.get('/states', getAllStates);
router.get('/stats', getDirectoryStats);
router.get('/:id', getDirectoryById);
router.post('/', createDirectory);
router.put('/:id', updateDirectory);
router.delete('/:id', deleteDirectory);

export default router;