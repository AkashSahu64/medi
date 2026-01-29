import Service from '../models/Service.model.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Get all services for public
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const services = await Service.find(query).sort('title');
    
    // For public routes, only show price if showPrice is true
    const servicesToSend = services.map(service => {
      const serviceObj = service.toObject();
      if (!serviceObj.showPrice) {
        delete serviceObj.price;
      }
      return serviceObj;
    });

    res.status(200).json({
      success: true,
      count: servicesToSend.length,
      data: servicesToSend,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service for public
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // For public routes, remove price if showPrice is false
    const serviceObj = service.toObject();
    if (!serviceObj.showPrice) {
      delete serviceObj.price;
    }

    res.status(200).json({
      success: true,
      data: serviceObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services for admin (including inactive)
// @route   GET /api/services/admin/all
// @access  Private/Admin
export const getAllServicesForAdmin = async (req, res, next) => {
  try {
    const { category, featured, isActive, search } = req.query;
    
    // Build query
    const query = {};
    
    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Featured filter
    if (featured && featured !== 'all') {
      query.featured = featured === 'featured';
    }
    
    // Active status filter
    if (isActive && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }
    
    console.log('Admin services query:', query);
    
    const services = await Service.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Error in getAllServicesForAdmin:', error);
    next(error);
  }
};

// @desc    Get single service for admin
// @route   GET /api/services/admin/:id
// @access  Private/Admin
export const getServiceForAdmin = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service (Admin) - Original function
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res, next) => {
  try {
    // Format benefits if it's a string
    if (req.body.benefits && typeof req.body.benefits === 'string') {
      req.body.benefits = req.body.benefits
        .split('\n')
        .map(b => b.trim())
        .filter(b => b.length > 0);
    }
    
    const service = await Service.create(req.body);
    
    console.log('Service created:', service);

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    next(error);
  }
};

// @desc    Create service (Admin) - For new admin routes
// @route   POST /api/services/admin
// @access  Private/Admin
export const createServiceAdmin = async (req, res, next) => {
  try {
    // Format benefits if it's a string
    if (req.body.benefits && typeof req.body.benefits === 'string') {
      req.body.benefits = req.body.benefits
        .split('\n')
        .map(b => b.trim())
        .filter(b => b.length > 0);
    }
    
    // Handle image data structure
    if (req.body.imageUrl && !req.body.image) {
      req.body.image = {
        url: req.body.imageUrl,
        public_id: req.body.imagePublicId || null
      };
      delete req.body.imageUrl;
      delete req.body.imagePublicId;
    }
    
    const service = await Service.create(req.body);
    
    console.log('Service created via admin route:', service);

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service via admin route:', error);
    next(error);
  }
};

// @desc    Update service (Admin) - Original function
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Format benefits if it's a string
    if (req.body.benefits && typeof req.body.benefits === 'string') {
      req.body.benefits = req.body.benefits
        .split('\n')
        .map(b => b.trim())
        .filter(b => b.length > 0);
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    next(error);
  }
};

// @desc    Update service (Admin) - For new admin routes
// @route   PUT /api/services/admin/:id
// @access  Private/Admin
export const updateServiceAdmin = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Format benefits if it's a string
    if (req.body.benefits && typeof req.body.benefits === 'string') {
      req.body.benefits = req.body.benefits
        .split('\n')
        .map(b => b.trim())
        .filter(b => b.length > 0);
    }

    // Handle image update - delete old Cloudinary image if new one is provided
    if (req.body.image && req.body.image.url && req.body.image.url !== service.image.url) {
      // If old image has a public_id, delete it from Cloudinary
      if (service.image && service.image.public_id) {
        try {
          await deleteFromCloudinary(service.image.public_id);
        } catch (cloudinaryError) {
          console.error('Error deleting old Cloudinary image:', cloudinaryError);
          // Continue with update even if Cloudinary delete fails
        }
      }
    } else if (req.body.imageUrl && req.body.imageUrl !== service.image.url) {
      // Backward compatibility for old image format
      if (service.image && service.image.public_id) {
        try {
          await deleteFromCloudinary(service.image.public_id);
        } catch (cloudinaryError) {
          console.error('Error deleting old Cloudinary image:', cloudinaryError);
        }
      }
      req.body.image = {
        url: req.body.imageUrl,
        public_id: req.body.imagePublicId || null
      };
      delete req.body.imageUrl;
      delete req.body.imagePublicId;
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service via admin route:', error);
    next(error);
  }
};

// @desc    Delete service (Admin) - Original function (soft delete)
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Soft delete by marking inactive
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (Admin) - Hard delete for admin routes
// @route   DELETE /api/services/admin/:id
// @access  Private/Admin
export const deleteServiceAdmin = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Delete Cloudinary image if exists
    if (service.image && service.image.public_id) {
      try {
        await deleteFromCloudinary(service.image.public_id);
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary image:', cloudinaryError);
        // Continue with deletion even if Cloudinary delete fails
      }
    }

    // Hard delete from database
    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted permanently',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services for testing
// @route   GET /api/services/test/all
// @access  Public (for testing)
export const testServices = async (req, res) => {
  try {
    const allServices = await Service.find({});
    console.log('Total services in DB:', allServices.length);
    console.log('Sample service:', allServices[0]);
    
    res.status(200).json({
      success: true,
      count: allServices.length,
      data: allServices
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Toggle service status
// @route   PATCH /api/services/:id/status
// @access  Private/Admin
export const toggleServiceStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    service.isActive = isActive;
    await service.save();
    
    res.status(200).json({
      success: true,
      data: service,
      message: `Service ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status'
    });
  }
};

// @desc    Toggle price visibility
// @route   PATCH /api/services/admin/:id/price-visibility
// @access  Private/Admin
export const togglePriceVisibility = async (req, res) => {
  try {
    const { showPrice } = req.body;
    
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    service.showPrice = showPrice;
    await service.save();

    res.status(200).json({
      success: true,
      data: service,
      message: `Price visibility ${showPrice ? 'enabled' : 'disabled'}`
    });
  } catch (error) {
    console.error('Error toggling price visibility:', error);
    next(error);
  }
};