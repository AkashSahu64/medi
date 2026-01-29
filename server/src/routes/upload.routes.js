import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private/Admin
router.post('/image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.path);
    
    res.status(200).json({
      success: true,
      data: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

export default router;