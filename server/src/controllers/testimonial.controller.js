import Testimonial from '../models/Testimonial.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all testimonials with filtering
// @route   GET /api/testimonials
// @access  Private/Admin
export const getTestimonials = async (req, res, next) => {
  try {
    const { search, status, featured, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    
    // Search filter - TEXT search ko theek karna
    if (search) {
      query.$text = { $search: search };
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.isApproved = status === 'approved';
    }
    
    // Featured filter
    if (featured && featured !== 'all') {
      query.featured = featured === 'featured';
    }
    
    console.log('Query:', query); // Debug ke liye
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get testimonials - TEXT index nahi hai toh alternate search use karein
    let testimonials;
    if (search && !query.$text) {
      // Agar text index nahi hai toh regex use karein
      const searchRegex = new RegExp(search, 'i');
      testimonials = await Testimonial.find({
        ...query,
        $or: [
          { patientName: searchRegex },
          { condition: searchRegex },
          { content: searchRegex }
        ]
      })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    } else {
      testimonials = await Testimonial.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }
    
    // Total count
    const total = await Testimonial.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    next(error);
  }
};

// @desc    Get testimonial statistics
// @route   GET /api/testimonials/stats
// @access  Private/Admin
export const getTestimonialStats = async (req, res, next) => {
  try {
    const [
      totalTestimonials,
      approvedTestimonials,
      pendingTestimonials,
      featuredTestimonials,
      averageRating
    ] = await Promise.all([
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ isApproved: true }),
      Testimonial.countDocuments({ isApproved: false }),
      Testimonial.countDocuments({ featured: true }),
      Testimonial.aggregate([
        { $match: { isApproved: true } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ])
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalTestimonials,
        approvedTestimonials,
        pendingTestimonials,
        featuredTestimonials,
        averageRating: averageRating[0]?.averageRating || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Private/Admin
export const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res, next) => {
  try {
    const { patientName, patientAge, condition, content, rating, isApproved, featured } = req.body;
    const userId = req.user.id;
    
    // Generate image URL from patient name if not provided
    const image = req.body.image || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=random&size=200`;
    
    // Create testimonial
    const testimonial = await Testimonial.create({
      patientName,
      patientAge: parseInt(patientAge),
      condition,
      content,
      rating: parseInt(rating),
      image,
      isApproved: isApproved === 'true' || isApproved === true,
      featured: featured === 'true' || featured === true,
      createdBy: userId
    });
    
    const populatedTestimonial = await Testimonial.findById(testimonial._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedTestimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res, next) => {
  try {
    const { patientName, patientAge, condition, content, rating, isApproved, featured } = req.body;
    
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    // Update testimonial
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        patientName: patientName || testimonial.patientName,
        patientAge: patientAge ? parseInt(patientAge) : testimonial.patientAge,
        condition: condition || testimonial.condition,
        content: content || testimonial.content,
        rating: rating ? parseInt(rating) : testimonial.rating,
        isApproved: isApproved !== undefined ? (isApproved === 'true' || isApproved === true) : testimonial.isApproved,
        featured: featured !== undefined ? (featured === 'true' || featured === true) : testimonial.featured
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      data: updatedTestimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    // Delete from database
    await Testimonial.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/reject testimonial
// @route   PATCH /api/testimonials/:id/approve
// @access  Private/Admin
export const approveTestimonial = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    testimonial.isApproved = isApproved;
    await testimonial.save();
    
    res.status(200).json({
      success: true,
      data: testimonial,
      message: `Testimonial ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/testimonials/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res, next) => {
  try {
    const { featured } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    testimonial.featured = featured;
    await testimonial.save();
    
    res.status(200).json({
      success: true,
      data: testimonial,
      message: `Testimonial ${featured ? 'marked as featured' : 'removed from featured'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload testimonial image
// @route   POST /api/testimonials/:id/upload-image
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path, 'image');
    
    // Update testimonial with new image
    testimonial.image = cloudinaryResult.url;
    await testimonial.save();
    
    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};