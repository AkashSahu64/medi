import Appointment from '../models/Appointment.model.js';
import Service from '../models/Service.model.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { sendWhatsAppMessage, whatsappTemplates } from '../utils/whatsappService.js';
import moment from 'moment';

// @desc    Get available time slots
// @route   GET /api/appointments/slots/:date
// @access  Public
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.params;
    
    // Validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }

    // Check if date is valid (Monday-Saturday, not in past)
    const dayOfWeek = appointmentDate.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dayOfWeek === 0) { // Sunday
      return res.status(400).json({
        success: false,
        message: 'Clinic is closed on Sundays',
      });
    }
    
    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments in the past',
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
    const bookedAppointments = await Appointment.find({
      appointmentDate: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z'),
      },
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);
    
    // Filter available slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
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
    } = req.body;

    // Validate service exists and is active
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc || !serviceDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Service not available',
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

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user ? req.user.id : null,
      patientName,
      patientEmail,
      patientPhone,
      service,
      serviceName: serviceDoc.title,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      healthConcern,
      createdBy: req.user ? 'user' : 'guest',
    });

    try {
      // Send confirmation email to patient
      await sendEmail({
        email: patientEmail,
        subject: 'Appointment Request Received - MEDIHOPE',
        html: emailTemplates.appointmentConfirmation(appointment),
      });

      // Send notification to admin
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'New Appointment Request - MEDIHOPE',
        html: emailTemplates.adminNotification(appointment),
      });

      // Send WhatsApp confirmation
      await sendWhatsAppMessage(
        patientPhone,
        whatsappTemplates.appointmentConfirmation(appointment)
      );
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the appointment creation if notifications fail
    }

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully. Confirmation sent.',
    });
  } catch (error) {
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
    const { status, date, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('service', 'title')
      .populate('patient', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      data: appointments,
    });
  } catch (error) {
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

    // Send notifications based on status change
    if (status === 'confirmed') {
      await sendEmail({
        email: appointment.patientEmail,
        subject: 'Appointment Confirmed - MEDIHOPE',
        html: emailTemplates.appointmentConfirmation(appointment),
      });
      
      await sendWhatsAppMessage(
        appointment.patientPhone,
        whatsappTemplates.appointmentConfirmation(appointment)
      );
    }

    res.status(200).json({
      success: true,
      data: appointment,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    next(error);
  }
};