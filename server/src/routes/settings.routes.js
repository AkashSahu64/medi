import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getSettings,
  updateSettings,
  createBackup,
  restoreBackup,
  getBackupHistory,
  downloadBackup,
  deleteBackup,
  resetSettings,
  deleteAllData,
  cleanupBackups
} from '../controllers/settings.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `backup-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// Apply auth middleware to all routes
router.use(protect);
router.use(admin);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Backup routes
router.post('/backup', createBackup);
router.post('/restore', upload.single('backupFile'), restoreBackup);
router.get('/backup-history', getBackupHistory);
router.get('/backup/:id/download', downloadBackup);
router.delete('/backup/:id', deleteBackup);

// Danger zone routes
router.post('/reset-settings', resetSettings);
router.delete('/delete-all-data', deleteAllData);

export default router;