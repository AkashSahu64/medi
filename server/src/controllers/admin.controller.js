import Appointment from '../models/Appointment.model.js';
import Service from '../models/Service.model.js';
import User from '../models/User.model.js';
import Contact from '../models/Contact.model.js';
import Testimonial from '../models/Testimonial.model.js';
import mongoose from 'mongoose';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    console.log('📊 Fetching dashboard stats...');

    // Get all stats in parallel for better performance
    const [
      totalAppointments,
      pendingAppointments,
      todayAppointments,
      totalServices,
      activeServices,
      totalPatients,
      totalUsers,
      totalAdmins,
      revenueData,
      newContacts,
      pendingTestimonials,
      monthlyAppointments,
      recentAppointments
    ] = await Promise.all([
      // Total appointments
      Appointment.countDocuments(),
      
      // Pending appointments
      Appointment.countDocuments({ status: 'pending' }),
      
      // Today's appointments
      Appointment.countDocuments({
        appointmentDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['pending', 'confirmed'] }
      }),
      
      // Total services
      Service.countDocuments(),
      
      // Active services
      Service.countDocuments({ isActive: true }),
      
      // Total patients (unique patients from appointments)
      Appointment.aggregate([
        { $group: { _id: '$patientPhone' } },
        { $count: 'total' }
      ]),
      
      // Total users
      User.countDocuments({ role: 'user' }),
      
      // Total admins
      User.countDocuments({ role: { $in: ['admin', 'therapist'] } }),
      
      // Revenue from completed appointments in last 30 days
      Appointment.aggregate([
        {
          $match: {
            status: 'completed',
            appointmentDate: { $gte: thirtyDaysAgo }
          }
        },
        {
          $lookup: {
            from: 'services',
            localField: 'service',
            foreignField: '_id',
            as: 'serviceInfo'
          }
        },
        {
          $unwind: {
            path: '$serviceInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$serviceInfo.price' },
            averageRevenue: { $avg: '$serviceInfo.price' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // New/unread contacts
      Contact.countDocuments({ status: 'new' }),
      
      // Pending testimonials
      Testimonial.countDocuments({ isApproved: false }),
      
      // Monthly appointments for chart
      Appointment.aggregate([
        {
          $match: {
            appointmentDate: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      
      // Recent appointments for dashboard
      Appointment.find()
        .populate('service', 'title')
        .sort({ appointmentDate: -1 })
        .limit(5)
    ]);

    console.log('✅ Dashboard stats calculated:', {
      totalAppointments,
      pendingAppointments,
      todayAppointments,
      totalServices,
      totalPatients: totalPatients[0]?.total || 0,
      revenue: revenueData[0]?.totalRevenue || 0
    });

    // Process recent appointments for activity feed
    const recentActivity = [];
    
    // Add recent appointments to activity
    recentAppointments.forEach(apt => {
      recentActivity.push({
        type: 'appointment',
        user: apt.patientName,
        action: apt.status === 'pending' ? 'requested an appointment' : 
                apt.status === 'confirmed' ? 'appointment confirmed' : 
                apt.status === 'completed' ? 'completed appointment' : 'cancelled appointment',
        details: `${apt.serviceName} on ${apt.appointmentDate.toLocaleDateString()}`,
        time: apt.createdAt,
        icon: 'FaCalendarAlt'
      });
    });

    // Add recent users (last 5) to activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3);
    
    recentUsers.forEach(user => {
      recentActivity.push({
        type: 'user',
        user: user.name,
        action: user.role === 'admin' ? 'admin logged in' : 'new user registered',
        details: user.email,
        time: user.createdAt,
        icon: 'FaUser'
      });
    });

    // Sort activity by time (newest first)
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        todayAppointments,
        totalServices,
        activeServices,
        totalPatients: totalPatients[0]?.total || 0,
        totalUsers,
        totalAdmins,
        revenue: revenueData[0]?.totalRevenue || 0,
        averageRevenue: revenueData[0]?.averageRevenue || 0,
        completedAppointments: revenueData[0]?.count || 0,
        newContacts,
        pendingTestimonials,
        monthlyAppointments: monthlyAppointments.map(item => ({
          date: item._id,
          count: item.count
        })),
        recentActivity: recentActivity.slice(0, 10) // Limit to 10 most recent
      }
    });
  } catch (error) {
    console.error('❌ Error in getDashboardStats:', error);
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/dashboard/activity
// @access  Private/Admin
export const getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    
    const activities = [];
    
    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate('service', 'title')
      .populate('patient', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    recentAppointments.forEach(apt => {
      activities.push({
        type: 'appointment',
        icon: 'FaCalendarAlt',
        user: apt.patientName,
        action: `Appointment ${apt.status}`,
        details: `${apt.serviceName} for ${apt.patientName}`,
        time: apt.createdAt,
        color: apt.status === 'completed' ? 'text-green-500' : 
               apt.status === 'confirmed' ? 'text-blue-500' : 
               apt.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
      });
    });
    
    // Get recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        icon: 'FaUser',
        user: user.name,
        action: user.role === 'admin' ? 'Admin logged in' : 'New registration',
        details: user.email,
        time: user.createdAt,
        color: 'text-purple-500'
      });
    });
    
    // Get recent testimonials
    const recentTestimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    recentTestimonials.forEach(testimonial => {
      activities.push({
        type: 'testimonial',
        icon: 'FaComments',
        user: testimonial.patientName,
        action: testimonial.isApproved ? 'Testimonial approved' : 'New testimonial',
        details: testimonial.condition,
        time: testimonial.createdAt,
        color: testimonial.isApproved ? 'text-green-500' : 'text-yellow-500'
      });
    });
    
    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    recentContacts.forEach(contact => {
      activities.push({
        type: 'contact',
        icon: 'FaEnvelope',
        user: contact.name,
        action: 'New contact message',
        details: contact.subject,
        time: contact.createdAt,
        color: contact.status === 'new' ? 'text-red-500' : 'text-gray-500'
      });
    });
    
    // Sort all activities by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // Limit to requested number
    const limitedActivities = activities.slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: limitedActivities.length,
      data: limitedActivities
    });
  } catch (error) {
    console.error('Error in getRecentActivity:', error);
    next(error);
  }
};

// @desc    Get revenue statistics
// @route   GET /api/admin/dashboard/revenue
// @access  Private/Admin
export const getRevenueStats = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let startDate, endDate, groupFormat;
    const endDateObj = new Date();
    
    if (period === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      groupFormat = { $dayOfWeek: '$appointmentDate' };
    } else if (period === 'monthly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' } };
    } else if (period === 'yearly') {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      groupFormat = { $month: '$appointmentDate' };
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' } };
    }
    
    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          appointmentDate: { $gte: startDate, $lte: endDateObj }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      { $unwind: '$serviceInfo' },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$serviceInfo.price' },
          appointmentCount: { $sum: 1 },
          averageServicePrice: { $avg: '$serviceInfo.price' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      period,
      data: revenueStats
    });
  } catch (error) {
    console.error('Error in getRevenueStats:', error);
    next(error);
  }
};

// @desc    Get all contacts
// @route   GET /api/admin/contacts
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    contact.status = status;
    await contact.save();
    
    res.status(200).json({
      success: true,
      data: contact,
      message: 'Contact status updated'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    await Contact.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};