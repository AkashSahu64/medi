import Appointment from '../models/Appointment.model.js';
import Service from '../models/Service.model.js';
import User from '../models/User.model.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { 
  sendWhatsAppMessage, 
  whatsappTemplates, 
  isValidPhoneNumber, 
  normalizePhoneNumber 
} from '../utils/whatsappService.js';
import Notification from '../models/Notification.model.js';
import moment from 'moment';

// Helper function to ensure appointment is properly populated
const ensureAppointmentPopulated = async (appointment) => {
  try {
    console.log(`🔍 Ensuring appointment is populated: ${appointment._id}`);
    
    // If appointment is already populated with necessary fields, return as is
    if (appointment && 
        appointment.patientName && 
        appointment.serviceName && 
        appointment.appointmentDate && 
        appointment.timeSlot) {
      
      // Still check if patientPhone exists and is valid
      if (appointment.patientPhone && isValidPhoneNumber(appointment.patientPhone)) {
        console.log(`✅ Appointment already populated with valid phone`);
        return appointment;
      }
    }
    
    // Otherwise, fetch fresh from database
    console.log(`🔄 Fetching fresh appointment data from DB`);
    const populated = await Appointment.findById(appointment._id || appointment.id)
      .populate('service', 'title duration')
      .populate('patient', 'name email phone')
      .lean();
    
    if (!populated) {
      throw new Error(`Appointment ${appointment._id} not found in database`);
    }
    
    console.log(`✅ Appointment successfully populated from DB`);
    return populated;
  } catch (error) {
    console.error('❌ Error populating appointment:', error.message);
    return appointment; // Return original as fallback
  }
};

// Helper function to send notifications (non-blocking)
const sendNotifications = async (type, appointment, additionalData = {}) => {
  try {
    console.log(`\n🔔 ========== START ${type} NOTIFICATIONS ==========`);
    console.log(`📋 Appointment ID: ${appointment._id}`);
    
    const { ADMIN_EMAIL, ADMIN_WHATSAPP, CLIENT_URL, NODE_ENV } = process.env;
    const adminEmail = ADMIN_EMAIL || 'admin@medihope.com';
    const adminWhatsappRaw = ADMIN_WHATSAPP || '+916386065599';
    const adminWhatsapp = normalizePhoneNumber(adminWhatsappRaw);
    
    // Log environment configuration
    console.log(`⚙️ Environment: ${NODE_ENV}`);
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`📱 Admin WhatsApp (Raw): ${adminWhatsappRaw}`);
    console.log(`📱 Admin WhatsApp (Normalized): ${adminWhatsapp}`);
    
    // Validate admin WhatsApp number
    if (!adminWhatsapp || !isValidPhoneNumber(adminWhatsapp)) {
      console.error(`❌ INVALID ADMIN WHATSAPP NUMBER: ${adminWhatsappRaw}`);
      console.error(`   Normalized: ${adminWhatsapp}`);
    } else {
      console.log(`✅ Admin WhatsApp number is valid`);
    }
    
    // Ensure appointment has all necessary data
    console.log(`🔄 Ensuring appointment data is complete...`);
    const populatedAppointment = await ensureAppointmentPopulated(appointment);
    
    if (!populatedAppointment) {
      console.error('❌ CRITICAL: Cannot send notifications - Appointment not found');
      return;
    }
    
    // Log appointment details
    console.log(`📋 Appointment Details:`);
    console.log(`   Patient: ${populatedAppointment.patientName}`);
    console.log(`   Service: ${populatedAppointment.serviceName}`);
    console.log(`   Date: ${populatedAppointment.appointmentDate}`);
    console.log(`   Time: ${populatedAppointment.timeSlot}`);
    console.log(`   Status: ${populatedAppointment.status}`);
    
    // Validate patient phone number
    const patientPhone = populatedAppointment.patientPhone;
    const patientPhoneNormalized = normalizePhoneNumber(patientPhone);
    const isValidPatientPhone = patientPhone && isValidPhoneNumber(patientPhone);
    
    console.log(`\n📱 PHONE NUMBER VALIDATION:`);
    console.log(`   Patient Phone (Raw): ${patientPhone}`);
    console.log(`   Patient Phone (Normalized): ${patientPhoneNormalized}`);
    console.log(`   Valid: ${isValidPatientPhone}`);
    
    if (!isValidPatientPhone) {
      console.warn(`⚠️ WARNING: Invalid patient phone number - WhatsApp will not be sent`);
    }
    
    switch (type) {
      case 'BOOKED':
        console.log(`\n📨 SENDING BOOKING NOTIFICATIONS...`);
        
        // Send to User
        if (populatedAppointment.patientEmail) {
          console.log(`📧 Sending booking email to user: ${populatedAppointment.patientEmail}`);
          try {
            await sendEmail({
              email: populatedAppointment.patientEmail,
              subject: 'Appointment Request Received - MEDIHOPE',
              html: emailTemplates.appointmentBookedUser(populatedAppointment),
            });
            console.log(`✅ User booking email sent successfully`);
          } catch (emailError) {
            console.error(`❌ User booking email failed:`, emailError.message);
          }
        } else {
          console.log(`⚠️ No user email provided - skipping user email`);
        }
        
        if (isValidPatientPhone) {
          console.log(`📱 Sending booking WhatsApp to user: ${patientPhoneNormalized}`);
          const userWhatsAppResult = await sendWhatsAppMessage(
            patientPhoneNormalized,
            whatsappTemplates.appointmentBookedUser(populatedAppointment),
            'appointmentBookedUser'
          );
          console.log(`📱 User WhatsApp Result:`, {
            success: userWhatsAppResult.success,
            mock: userWhatsAppResult.mock || false,
            error: userWhatsAppResult.error
          });
        } else {
          console.warn(`⚠️ Skipping user WhatsApp - Invalid phone: ${patientPhone}`);
        }
        
        // Send to Admin
        console.log(`\n📨 SENDING ADMIN BOOKING NOTIFICATIONS...`);
        
        if (adminEmail) {
          console.log(`📧 Sending booking email to admin: ${adminEmail}`);
          try {
            await sendEmail({
              email: adminEmail,
              subject: '📅 New Appointment Request - MEDIHOPE',
              html: emailTemplates.appointmentBookedAdmin(populatedAppointment),
            });
            console.log(`✅ Admin booking email sent successfully`);
          } catch (emailError) {
            console.error(`❌ Admin booking email failed:`, emailError.message);
          }
        }
        
        if (adminWhatsapp && isValidPhoneNumber(adminWhatsapp)) {
          console.log(`📱 Sending booking WhatsApp to admin: ${adminWhatsapp}`);
          const adminWhatsAppResult = await sendWhatsAppMessage(
            adminWhatsapp,
            whatsappTemplates.appointmentBookedAdmin(populatedAppointment),
            'appointmentBookedAdmin'
          );
          console.log(`📱 Admin WhatsApp Result:`, {
            success: adminWhatsAppResult.success,
            mock: adminWhatsAppResult.mock || false,
            error: adminWhatsAppResult.error
          });
        } else {
          console.warn(`⚠️ Skipping admin WhatsApp - Invalid admin phone or not configured`);
        }
        break;
        
      case 'STATUS_CHANGED':
        const { oldStatus } = additionalData;
        
        console.log(`\n🔄 SENDING STATUS CHANGE NOTIFICATIONS...`);
        console.log(`   Status Change: ${oldStatus} → ${populatedAppointment.status}`);
        
        // Send to User
        if (populatedAppointment.patientEmail) {
          console.log(`📧 Sending status email to user: ${populatedAppointment.patientEmail}`);
          try {
            await sendEmail({
              email: populatedAppointment.patientEmail,
              subject: `Appointment ${populatedAppointment.status.charAt(0).toUpperCase() + populatedAppointment.status.slice(1)} - MEDIHOPE`,
              html: emailTemplates.appointmentStatusChanged(populatedAppointment, oldStatus),
            });
            console.log(`✅ User status email sent successfully`);
          } catch (emailError) {
            console.error(`❌ User status email failed:`, emailError.message);
          }
        }
        
        if (isValidPatientPhone) {
          console.log(`📱 Sending status WhatsApp to user: ${patientPhoneNormalized}`);
          const userWhatsAppResult = await sendWhatsAppMessage(
            patientPhoneNormalized,
            whatsappTemplates.appointmentStatusChanged(populatedAppointment, oldStatus),
            'appointmentStatusChanged'
          );
          console.log(`📱 User Status WhatsApp Result:`, {
            success: userWhatsAppResult.success,
            mock: userWhatsAppResult.mock || false,
            error: userWhatsAppResult.error
          });
        } else {
          console.warn(`⚠️ Skipping user status WhatsApp - Invalid phone: ${patientPhone}`);
        }
        
        // Send to Admin (record keeping)
        console.log(`\n📨 SENDING ADMIN STATUS NOTIFICATIONS...`);
        
        if (adminEmail) {
          console.log(`📧 Sending status email to admin: ${adminEmail}`);
          try {
            await sendEmail({
              email: adminEmail,
              subject: `Appointment Status Changed to ${populatedAppointment.status} - MEDIHOPE`,
              html: emailTemplates.adminStatusChangeNotification(populatedAppointment, oldStatus),
            });
            console.log(`✅ Admin status email sent successfully`);
          } catch (emailError) {
            console.error(`❌ Admin status email failed:`, emailError.message);
          }
        }
        
        // Admin WhatsApp notification only for important status changes
        if (['cancelled', 'confirmed', 'completed'].includes(populatedAppointment.status)) {
          if (adminWhatsapp && isValidPhoneNumber(adminWhatsapp)) {
            console.log(`📱 Sending status WhatsApp to admin: ${adminWhatsapp}`);
            const adminWhatsAppResult = await sendWhatsAppMessage(
              adminWhatsapp,
              whatsappTemplates.adminStatusChangeNotification(populatedAppointment, oldStatus),
              'adminStatusChangeNotification'
            );
            console.log(`📱 Admin Status WhatsApp Result:`, {
              success: adminWhatsAppResult.success,
              mock: adminWhatsAppResult.mock || false,
              error: adminWhatsAppResult.error
            });
          } else {
            console.warn(`⚠️ Skipping admin status WhatsApp - Invalid admin phone or not configured`);
          }
        } else {
          console.log(`ℹ️ Admin WhatsApp skipped for status: ${populatedAppointment.status} (only for cancelled/confirmed/completed)`);
        }
        break;
        
      case 'UPDATED':
        const { changes } = additionalData;
        
        console.log(`\n✏️ SENDING UPDATE NOTIFICATIONS...`);
        console.log(`   Changes: ${changes}`);
        
        // Send to User
        if (populatedAppointment.patientEmail) {
          console.log(`📧 Sending update email to user: ${populatedAppointment.patientEmail}`);
          try {
            await sendEmail({
              email: populatedAppointment.patientEmail,
              subject: 'Appointment Details Updated - MEDIHOPE',
              html: emailTemplates.appointmentUpdated(populatedAppointment, changes),
            });
            console.log(`✅ User update email sent successfully`);
          } catch (emailError) {
            console.error(`❌ User update email failed:`, emailError.message);
          }
        }
        
        if (isValidPatientPhone) {
          console.log(`📱 Sending update WhatsApp to user: ${patientPhoneNormalized}`);
          const userWhatsAppResult = await sendWhatsAppMessage(
            patientPhoneNormalized,
            whatsappTemplates.appointmentUpdated(populatedAppointment, changes),
            'appointmentUpdated'
          );
          console.log(`📱 User Update WhatsApp Result:`, {
            success: userWhatsAppResult.success,
            mock: userWhatsAppResult.mock || false,
            error: userWhatsAppResult.error
          });
        } else {
          console.warn(`⚠️ Skipping user update WhatsApp - Invalid phone: ${patientPhone}`);
        }
        break;
    }
    
    console.log(`\n✅ ========== ${type} NOTIFICATIONS COMPLETED ==========\n`);
  } catch (notificationError) {
    console.error('❌ CRITICAL NOTIFICATION ERROR:', notificationError.message);
    console.error('❌ Stack trace:', notificationError.stack);
    // Don't fail the main operation
  }
};

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

    // Validate phone number
    const normalizedPhone = normalizePhoneNumber(patientPhone);
    if (!normalizedPhone || !isValidPhoneNumber(patientPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Please provide a valid 10-digit phone number'
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

    // Create appointment object with normalized phone
    const appointmentData = {
      patientName,
      patientEmail: patientEmail || '',
      patientPhone: normalizedPhone,
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

    // Create notification for new appointment
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

    // Send notifications based on status (non-blocking)
    console.log(`\n📨 Triggering notifications for new appointment...`);
    if (status === 'pending') {
      // Send booking notifications to both user and admin
      sendNotifications('BOOKED', appointment).catch(err => 
        console.error('Booking notification error:', err)
      );
    } else if (status === 'confirmed') {
      // If appointment is created as confirmed, send status change notification
      sendNotifications('STATUS_CHANGED', appointment, { oldStatus: 'pending' }).catch(err =>
        console.error('Confirmation notification error:', err)
      );
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

    // Validate phone number
    const normalizedPhone = normalizePhoneNumber(patientPhone);
    if (!normalizedPhone || !isValidPhoneNumber(patientPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Please provide a valid 10-digit phone number'
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

    // Create appointment object with normalized phone
    const appointmentData = {
      patientName,
      patientEmail: patientEmail || '',
      patientPhone: normalizedPhone,
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

    // Send notifications based on status (non-blocking)
    console.log(`\n📨 Triggering notifications for admin-created appointment...`);
    if (status === 'pending') {
      // Send booking notifications to both user and admin
      sendNotifications('BOOKED', appointment).catch(err => 
        console.error('Admin booking notification error:', err)
      );
    } else if (status === 'confirmed') {
      // If appointment is created as confirmed, send status change notification
      sendNotifications('STATUS_CHANGED', appointment, { oldStatus: 'pending' }).catch(err =>
        console.error('Admin confirmation notification error:', err)
      );
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
    
    // Save old appointment data for change detection
    const oldAppointment = { ...appointment.toObject() };
    const changes = [];
    
    // Normalize phone number if being updated
    if (updateData.patientPhone) {
      const normalizedPhone = normalizePhoneNumber(updateData.patientPhone);
      if (!normalizedPhone || !isValidPhoneNumber(updateData.patientPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number format'
        });
      }
      updateData.patientPhone = normalizedPhone;
      
      if (oldAppointment.patientPhone !== normalizedPhone) {
        changes.push(`Phone number updated`);
      }
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
      
      // Track date changes
      if (updateData.appointmentDate && 
          new Date(updateData.appointmentDate).toDateString() !== 
          oldAppointment.appointmentDate.toDateString()) {
        changes.push(`Date changed to ${new Date(updateData.appointmentDate).toLocaleDateString()}`);
      }
      
      // Track time slot changes
      if (updateData.timeSlot && updateData.timeSlot !== oldAppointment.timeSlot) {
        changes.push(`Time slot changed to ${updateData.timeSlot}`);
      }
    }
    
    // Update service name if service ID is provided
    if (updateData.service && updateData.service.length === 24) {
      const service = await Service.findById(updateData.service);
      if (service) {
        updateData.serviceName = service.title;
        
        // Track service changes
        if (oldAppointment.service.toString() !== updateData.service) {
          changes.push(`Service changed to ${service.title}`);
        }
      }
    }
    
    // Track notes changes
    if (updateData.notes && updateData.notes !== oldAppointment.notes) {
      changes.push('Notes updated');
    }
    
    // Add updatedBy field
    if (req.user) {
      updateData.updatedBy = req.user.name || 'Admin';
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
    console.log(`   Changes detected: ${changes.length > 0 ? changes.join(', ') : 'None'}`);
    
    // Send update notification if there are changes
    if (changes.length > 0) {
      console.log(`\n📨 Triggering update notifications...`);
      sendNotifications('UPDATED', updatedAppointment, { 
        changes: changes.join(', ') 
      }).catch(err =>
        console.error('Update notification error:', err)
      );
    } else {
      console.log(`ℹ️ No changes detected - skipping notifications`);
    }
    
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
    
    // Save old status
    const oldStatus = appointment.status;
    
    // Don't send notification if status hasn't changed
    if (oldStatus === status) {
      console.log(`⚠️ Status unchanged (${oldStatus}), skipping notifications`);
      
      // Populate for response
      const populatedAppointment = await Appointment.findById(id)
        .populate('patient', 'name email')
        .populate('service', 'title duration');
      
      return res.status(200).json({
        success: true,
        data: populatedAppointment,
        message: `Appointment status is already ${status}`,
      });
    }
    
    appointment.status = status;
    if (notes) appointment.notes = notes;
    
    // Add updatedBy field
    if (req.user) {
      appointment.updatedBy = req.user.name || 'Admin';
    }
    
    await appointment.save();
    
    // Populate for response
    const populatedAppointment = await Appointment.findById(id)
      .populate('patient', 'name email')
      .populate('service', 'title duration');

    // Create notification for status change
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
    
    // Send status change notifications (non-blocking)
    console.log(`\n📨 Triggering status change notifications...`);
    sendNotifications('STATUS_CHANGED', populatedAppointment, { oldStatus }).catch(err =>
      console.error('Status change notification error:', err)
    );
    
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