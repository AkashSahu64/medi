import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: [true, 'Please provide patient name'],
  },
  patientEmail: {
    type: String,
    required: [true, 'Please provide email'],
  },
  patientPhone: {
    type: String,
    required: [true, 'Please provide phone number'],
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select time slot'],
    enum: [
      '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
      '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00',
      '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
      '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00',
    ],
  },
  healthConcern: {
    type: String,
    maxlength: [500, 'Health concern cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending',
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  createdBy: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent double booking
appointmentSchema.index({ appointmentDate: 1, timeSlot: 1 }, { unique: true });

// Virtual for checking if appointment is in the past
appointmentSchema.virtual('isPast').get(function () {
  return new Date() > this.appointmentDate;
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;