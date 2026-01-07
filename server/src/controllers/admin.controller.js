import Appointment from '../models/Appointment.model.js';
import User from '../models/User.model.js';
import Service from '../models/Service.model.js';
import Contact from '../models/Contact.model.js';
import Testimonial from '../models/Testimonial.model.js';
import mongoose from 'mongoose';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts using Promise.all for parallel execution
    const [
      totalAppointments,
      pendingAppointments,
      totalPatients,
      totalServices,
      unreadMessages,
      totalRevenueResult,
      todayAppointments,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'user' }),
      Service.countDocuments({ isActive: true }),
      Contact.countDocuments({ status: 'new' }),
      // Calculate total revenue from completed appointments
      Appointment.aggregate([
        { $match: { status: 'completed' } },
        { $lookup: {
            from: 'services',
            localField: 'service',
            foreignField: '_id',
            as: 'serviceDetails'
          }
        },
        { $unwind: '$serviceDetails' },
        { $group: {
            _id: null,
            totalRevenue: { $sum: '$serviceDetails.price' }
          }
        }
      ]),
      // Today's appointments
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    ]);

    // Get weekly appointment trends
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyAppointments = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        todayAppointments,
        totalPatients,
        totalServices,
        unreadMessages,
        totalRevenue: totalRevenueResult[0]?.totalRevenue || 0,
        weeklyAppointments: weeklyAppointments.map(item => ({
          date: item._id,
          count: item.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/dashboard/activity
// @access  Private/Admin
export const getRecentActivity = async (req, res, next) => {
  try {
    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('service', 'title')
      .sort('-createdAt')
      .limit(10);

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort('-createdAt')
      .limit(5);

    // Get recent testimonials
    const recentTestimonials = await Testimonial.find()
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        recentAppointments: recentAppointments.map(apt => ({
          id: apt._id,
          patientName: apt.patient?.name || apt.patientName,
          service: apt.service?.title || apt.serviceName,
          date: apt.appointmentDate,
          timeSlot: apt.timeSlot,
          status: apt.status,
          createdAt: apt.createdAt
        })),
        recentContacts,
        recentTestimonials
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue statistics
// @route   GET /api/admin/dashboard/revenue
// @access  Private/Admin
export const getRevenueStats = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    let startDate, groupFormat;

    const now = new Date();
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }

    // Revenue by date
    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      { $unwind: '$serviceDetails' },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$serviceDetails.price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top services by revenue
    const topServices = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      { $unwind: '$serviceDetails' },
      {
        $group: {
          _id: '$serviceDetails.title',
          revenue: { $sum: '$serviceDetails.price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueStats,
        topServices,
        period
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/admin/contacts
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};