import Appointment from '../models/Appointment.model.js';
import Service from '../models/Service.model.js';
import User from '../models/User.model.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { sendWhatsAppMessage, whatsappTemplates } from '../utils/whatsappService.js';
import moment from 'moment';

// @desc    Get available time slots
// @route   GET /api/appointments/slots/:date
// @access  Public
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.params;
    
    console.log('📅 Getting available slots for date:', date);
    
    // Validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format',
      });
    }

    // Check if date is valid (not in past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check availability for past dates',
      });
    }

    // Define all possible slots (9 AM - 7 PM, 30 min slots, lunch break 1-2 PM)
    const allSlots = [
      '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
      '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00',
      '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
      '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00',
    ];

    // Get booked slots for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookedAppointments = await Appointment.find({
      appointmentDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: { $in: ['pending', 'confirmed'] },
    });

    console.log(`Found ${bookedAppointments.length} booked appointments for ${date}`);
    
    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);
    
    // Filter available slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    console.log(`Available slots for ${date}:`, availableSlots);

    res.status(200).json({
      success: true,
      date: date,
      totalSlots: allSlots.length,
      bookedSlots: bookedSlots.length,
      availableSlots: availableSlots.length,
      data: availableSlots,
    });
  } catch (error) {
    console.error('❌ Error in getAvailableSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @route   POST /api/appointments/admin (for admin)
// @access  Private/Public (depending on auth)
export const createAppointment = async (req, res, next) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      service,
      appointmentDate,
      timeSlot,
      healthConcern,
      status = 'pending',
      notes = ''
    } = req.body;

    console.log('📝 Creating appointment (Public):', { 
      patientName, 
      patientEmail, 
      service, 
      appointmentDate, 
      timeSlot 
    });

    // Validate required fields
    if (!patientName || !patientPhone || !service || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patient name, phone, service, date and time slot'
      });
    }

    // Check if service exists
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(400).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check if service is active
    if (!serviceDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This service is currently unavailable',
      });
    }

    // Check if slot is already booked (double-check)
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is no longer available',
      });
    }

    // Create appointment object
    const appointmentData = {
      patientName,
      patientEmail: patientEmail || '',
      patientPhone,
      service,
      serviceName: serviceDoc.title,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      healthConcern: healthConcern || '',
      status,
      notes: notes || '',
      createdBy: req.user ? 'user' : 'guest'
    };

    // Add patient ID if user is logged in
    if (req.user) {
      appointmentData.patient = req.user.id;
    }

    // Create appointment
    const appointment = await Appointment.create(appointmentData);

    // Populate appointment for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('service', 'title duration');

    //Create notification for new appointment
    if (appointment.status === 'pending') {
      await Notification.create({
        title: 'New Appointment Request',
        message: `${appointment.patientName} requested an appointment for ${appointment.serviceName}`,
        type: 'appointment',
        link: `/admin/appointments/${appointment._id}`,
        data: { appointmentId: appointment._id },
        priority: 'high'
      });
    }
    // Send notifications if status is confirmed
    if (status === 'confirmed' && patientEmail) {
      try {
        await sendEmail({
          email: patientEmail,
          subject: 'Appointment Confirmed - MEDIHOPE',
          html: emailTemplates.appointmentConfirmation(populatedAppointment),
        });
        
        if (patientPhone) {
          await sendWhatsAppMessage(
            patientPhone,
            whatsappTemplates.appointmentConfirmation(populatedAppointment)
          );
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't fail appointment creation
      }
    }

    console.log('✅ Appointment created:', appointment._id);

    res.status(201).json({
      success: true,
      data: populatedAppointment,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    next(error);
  }
};

// @desc    Create new appointment (Admin)
// @route   POST /api/appointments/admin
// @access  Private/Admin
export const createAppointmentAdmin = async (req, res, next) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      service,
      appointmentDate,
      timeSlot,
      healthConcern,
      status = 'pending',
      notes = ''
    } = req.body;

    console.log('📝 Creating appointment (Admin):', { 
      patientName, 
      patientEmail, 
      service, 
      appointmentDate, 
      timeSlot 
    });

    // Validate required fields
    if (!patientName || !patientPhone || !service || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patient name, phone, service, date and time slot'
      });
    }

    // Check if service exists
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(400).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    // Create appointment object
    const appointmentData = {
      patientName,
      patientEmail: patientEmail || '',
      patientPhone,
      service,
      serviceName: serviceDoc.title,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      healthConcern: healthConcern || '',
      status,
      notes: notes || '',
      createdBy: 'admin'
    };

    // Create appointment
    const appointment = await Appointment.create(appointmentData);

    // Populate appointment for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('service', 'title duration');

    // Create notification for new appointment
    if (appointment.status === 'pending') {
      await Notification.create({
        title: 'New Appointment Request (Admin Created)',
        message: `${appointment.patientName} - ${appointment.serviceName}`,
        type: 'appointment',
        link: `/admin/appointments/${appointment._id}`,
        data: { appointmentId: appointment._id },
        priority: 'high'
      });
    }
    // Send notifications if status is confirmed
    if (status === 'confirmed' && patientEmail) {
      try {
        await sendEmail({
          email: patientEmail,
          subject: 'Appointment Confirmed - MEDIHOPE',
          html: emailTemplates.appointmentConfirmation(populatedAppointment),
        });
        
        if (patientPhone) {
          await sendWhatsAppMessage(
            patientPhone,
            whatsappTemplates.appointmentConfirmation(populatedAppointment)
          );
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    console.log('✅ Appointment created by admin:', appointment._id);

    res.status(201).json({
      success: true,
      data: populatedAppointment,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('❌ Error creating appointment (admin):', error);
    next(error);
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('service', 'title duration')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req, res, next) => {
  try {
    const { 
      status, 
      date, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;
    
    console.log('📅 Fetching appointments with filters:', { status, date, search, page, limit });
    
    // Build query
    const query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Date filter
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { 
        $gte: startDate, 
        $lt: endDate 
      };
    }
    
    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { patientName: searchRegex },
        { patientEmail: searchRegex },
        { patientPhone: searchRegex },
        { serviceName: searchRegex }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get appointments
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('service', 'title duration price')
      .sort('-appointmentDate')
      .skip(skip)
      .limit(parseInt(limit));
    
    // Total count
    const total = await Appointment.countDocuments(query);
    
    console.log(`✅ Found ${appointments.length} appointments out of ${total}`);
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      data: appointments,
    });
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private/Admin
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('service', 'title duration price');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment (Admin - full update)
// @route   PUT /api/appointments/:id
// @access  Private/Admin
export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`🔄 Updating appointment ${id}:`, updateData);
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    
    // If date or time is being changed, check availability
    if (updateData.appointmentDate || updateData.timeSlot) {
      const newDate = updateData.appointmentDate || appointment.appointmentDate;
      const newTimeSlot = updateData.timeSlot || appointment.timeSlot;
      
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: id }, // Exclude current appointment
        appointmentDate: new Date(newDate),
        timeSlot: newTimeSlot,
        status: { $in: ['pending', 'confirmed'] },
      });
      
      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked',
        });
      }
    }
    
    // Update service name if service ID is provided
    if (updateData.service && updateData.service.length === 24) {
      const service = await Service.findById(updateData.service);
      if (service) {
        updateData.serviceName = service.title;
      }
    }
    
    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('patient', 'name email')
    .populate('service', 'title duration');
    
    console.log('✅ Appointment updated:', id);
    
    res.status(200).json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    next(error);
  }
};

// @desc    Update appointment status (Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    console.log(`📊 Updating status for appointment ${id} to ${status}`);
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    
    appointment.status = status;
    if (notes) appointment.notes = notes;
    
    await appointment.save();
    
    // Populate for response
    const populatedAppointment = await Appointment.findById(id)
      .populate('patient', 'name email')
      .populate('service', 'title duration');

    //Create notification for status change
    if (status === 'confirmed') {
      await Notification.create({
        title: 'Appointment Confirmed',
        message: `Appointment for ${appointment.patientName} has been confirmed`,
        type: 'appointment',
        link: `/admin/appointments/${appointment._id}`,
        data: { appointmentId: appointment._id },
        priority: 'medium'
      });
    }
    
    // Send notifications for status changes
    if (status === 'confirmed' && appointment.patientEmail) {
      try {
        await sendEmail({
          email: appointment.patientEmail,
          subject: 'Appointment Confirmed - MEDIHOPE',
          html: emailTemplates.appointmentConfirmation(populatedAppointment),
        });
        
        if (appointment.patientPhone) {
          await sendWhatsAppMessage(
            appointment.patientPhone,
            whatsappTemplates.appointmentConfirmation(populatedAppointment)
          );
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    } else if (status === 'cancelled' && appointment.patientEmail) {
      try {
        await sendEmail({
          email: appointment.patientEmail,
          subject: 'Appointment Cancelled - MEDIHOPE',
          html: emailTemplates.appointmentCancelled(populatedAppointment),
        });
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }
    
    res.status(200).json({
      success: true,
      data: populatedAppointment,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    console.error('❌ Error updating appointment status:', error);
    next(error);
  }
};

// @desc    Delete appointment (Admin)
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting appointment ${id}`);
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    
    // Hard delete
    await Appointment.findByIdAndDelete(id);
    
    console.log('✅ Appointment deleted:', id);
    
    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting appointment:', error);
    next(error);
  }
};

// @desc    Get appointment statistics (Admin)
// @route   GET /api/appointments/stats
// @access  Private/Admin
export const getAppointmentStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      todaysAppointments,
      upcomingAppointments
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Appointment.countDocuments({
        appointmentDate: { $gte: today, $lt: tomorrow }
      }),
      Appointment.countDocuments({
        appointmentDate: { $gte: tomorrow },
        status: { $in: ['pending', 'confirmed'] }
      })
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todaysAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    console.error('❌ Error getting appointment stats:', error);
    next(error);
  }
};