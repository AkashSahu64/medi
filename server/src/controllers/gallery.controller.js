import Gallery from '../models/Gallery.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all gallery items with filtering
// @route   GET /api/gallery
// @access  Private/Admin
export const getGallery = async (req, res, next) => {
  try {
    const { search, category, type, featured, showOnSlider, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Featured filter
    if (featured && featured !== 'all') {
      query.featured = featured === 'true';
    }
    
    // Show on slider filter
    if (showOnSlider && showOnSlider !== 'all') {
      query.showOnSlider = showOnSlider === 'true';
    }
    
    // Sorting logic: featured first, then by createdAt
    const sortOrder = { featured: -1, createdAt: -1 };
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const total = await Gallery.countDocuments(query);
    
    // Get gallery items with pagination and sorting
    const gallery = await Gallery.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email')
      .lean();
    
    res.status(200).json({
      success: true,
      count: gallery.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: gallery
    });
  } catch (error) {
    console.error("❌ Error in getGallery:", error);
    next(error);
  }
};

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats
// @access  Private/Admin
export const getGalleryStats = async (req, res, next) => {
  try {
    const [
      totalItems,
      featuredItems,
      sliderItems,
      showDetailButtonItems,
      imagesCount,
      videosCount,
      itemsByCategory
    ] = await Promise.all([
      Gallery.countDocuments(),
      Gallery.countDocuments({ featured: true }),
      Gallery.countDocuments({ showOnSlider: true }),
      Gallery.countDocuments({ showDetailButton: true }),
      Gallery.countDocuments({ type: 'image' }),
      Gallery.countDocuments({ type: 'video' }),
      Gallery.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    
    // Convert itemsByCategory array to object
    const categoryStats = {};
    itemsByCategory.forEach(item => {
      categoryStats[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalItems,
        featuredItems,
        sliderItems,
        showDetailButtonItems,
        imagesCount,
        videosCount,
        ...categoryStats
      }
    });
  } catch (error) {
    console.error("❌ Error in getGalleryStats:", error);
    next(error);
  }
};

// @desc    Get gallery items for slider
// @route   GET /api/gallery/slider
// @access  Public
export const getSliderItems = async (req, res, next) => {
  try {
    const sliderItems = await Gallery.find({ 
      showOnSlider: true,
      url: { $exists: true, $ne: null }
    })
    .sort({ featured: -1, createdAt: -1 })
    .select('title description category type url thumbnail featured showDetailButton tags dimensions')
    .lean();
    
    res.status(200).json({
      success: true,
      count: sliderItems.length,
      data: sliderItems
    });
  } catch (error) {
    console.error("❌ Error in getSliderItems:", error);
    next(error);
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Private/Admin
export const getGalleryById = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload media to gallery
// @route   POST /api/gallery/upload
// @access  Private/Admin
export const uploadMedia = async (req, res, next) => {
  try {
    const { title, description, category, tags, featured, showDetailButton, showOnSlider } = req.body;
    const files = req.files;
    const userId = req.user.id;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one file'
      });
    }
    
    const uploadedItems = [];
    
    // Process each file
    for (const file of files) {
      // Determine resource type
      const resourceType = file.mimetype.startsWith('image') ? 'image' : 'video';
      const type = resourceType;
      
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file.path, resourceType);
      
      // Parse tags
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      
      // Create gallery item
      const galleryItem = await Gallery.create({
        title: title || path.parse(file.originalname).name,
        description: description || '',
        category: category || 'clinic',
        type,
        url: cloudinaryResult.url,
        thumbnail: cloudinaryResult.url,
        featured: featured === 'true',
        showDetailButton: showDetailButton === 'true',
        showOnSlider: showOnSlider !== 'false', // Default to true
        tags: tagsArray,
        size: cloudinaryResult.bytes,
        format: cloudinaryResult.format,
        duration: cloudinaryResult.duration || 0,
        dimensions: {
          width: cloudinaryResult.width,
          height: cloudinaryResult.height
        },
        createdBy: userId
      });
      
      uploadedItems.push(galleryItem);
    }
    
    res.status(201).json({
      success: true,
      data: uploadedItems,
      message: `${files.length} file(s) uploaded successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryItem = async (req, res, next) => {
  try {
    const { title, description, category, tags, featured, showDetailButton, showOnSlider } = req.body;
    const galleryId = req.params.id;
    
    // Check if gallery item exists
    const galleryItem = await Gallery.findById(galleryId);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Parse tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : galleryItem.tags;
    
    // Update gallery item
    const updatedItem = await Gallery.findByIdAndUpdate(
      galleryId,
      {
        title: title || galleryItem.title,
        description: description || galleryItem.description,
        category: category || galleryItem.category,
        tags: tagsArray,
        featured: featured !== undefined ? (featured === 'true') : galleryItem.featured,
        showDetailButton: showDetailButton !== undefined ? (showDetailButton === 'true') : galleryItem.showDetailButton,
        showOnSlider: showOnSlider !== undefined ? (showOnSlider === 'true') : galleryItem.showOnSlider
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Gallery item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/gallery/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    
    const galleryItem = await Gallery.findById(galleryId);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Toggle the featured status
    galleryItem.featured = !galleryItem.featured;
    await galleryItem.save();
    
    res.status(200).json({
      success: true,
      data: galleryItem,
      message: `Gallery item ${galleryItem.featured ? 'marked as featured' : 'removed from featured'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle detail button status
// @route   PATCH /api/gallery/:id/detail-button
// @access  Private/Admin
export const toggleDetailButton = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    
    const galleryItem = await Gallery.findById(galleryId);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Toggle the showDetailButton status
    galleryItem.showDetailButton = !galleryItem.showDetailButton;
    await galleryItem.save();
    
    res.status(200).json({
      success: true,
      data: galleryItem,
      message: `Detail button ${galleryItem.showDetailButton ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle slider visibility
// @route   PATCH /api/gallery/:id/slider
// @access  Private/Admin
export const toggleSlider = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    
    const galleryItem = await Gallery.findById(galleryId);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Toggle the showOnSlider status
    galleryItem.showOnSlider = !galleryItem.showOnSlider;
    await galleryItem.save();
    
    res.status(200).json({
      success: true,
      data: galleryItem,
      message: `Slider visibility ${galleryItem.showOnSlider ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    
    const galleryItem = await Gallery.findById(galleryId);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Extract public_id from Cloudinary URL (if using Cloudinary)
    const urlParts = galleryItem.url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    
    // Delete from Cloudinary
    if (galleryItem.url.includes('cloudinary')) {
      await deleteFromCloudinary(`medihope/gallery/${publicId}`, galleryItem.type);
    }
    
    // Delete from database
    await Gallery.findByIdAndDelete(galleryId);
    
    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};