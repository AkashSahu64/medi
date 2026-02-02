import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // MUST be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 IMPORTANT for Gmail
  },
});

export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `MEDIHOPE Physiotherapy <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      replyTo: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Fallback to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('MOCK EMAIL (development):', {
        to: options.email,
        subject: options.subject,
        html: options.html,
      });
      return { messageId: 'mock-message-id' };
    }
    
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

// Helper to verify email configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Email templates
export const emailTemplates = {
  appointmentConfirmation: (appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Appointment Confirmed</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment has been confirmed with MEDIHOPE Physiotherapy Centre.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Appointment Details:</h3>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> ${appointment.timeSlot}</p>
        <p><strong>Reference ID:</strong> ${appointment._id}</p>
      </div>
      
      <p>Please arrive 10 minutes before your scheduled time.</p>
      <p>For any queries, call us at +91-XXXXXXXXXX</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #7f8c8d; font-size: 14px;">
        MEDIHOPE Physiotherapy Centre<br>
        Address Line 1, Address Line 2<br>
        City, State - PIN Code<br>
        Phone: +91-XXXXXXXXXX
      </p>
    </div>
  `,

  adminNotification: (appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">New Appointment Request</h2>
      <p>A new appointment has been requested on the MEDIHOPE platform.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Appointment Details:</h3>
        <p><strong>Patient:</strong> ${appointment.patientName}</p>
        <p><strong>Phone:</strong> ${appointment.patientPhone}</p>
        <p><strong>Email:</strong> ${appointment.patientEmail}</p>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.timeSlot}</p>
        <p><strong>Health Concern:</strong> ${appointment.healthConcern || 'Not specified'}</p>
      </div>
      
      <p>Please login to the admin panel to review and confirm this appointment.</p>
      
      <a href="${process.env.CLIENT_URL}/admin/appointments" 
         style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
        View in Admin Panel
      </a>
    </div>
  `,
  
  passwordReset: (user, resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #7f8c8d; font-size: 14px;">
        MEDIHOPE Physiotherapy Centre
      </p>
    </div>
  `,
  appointmentCancelled: (appointment) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #e74c3c;">Appointment Cancelled</h2>
    <p>Dear ${appointment.patientName},</p>
    <p>Your appointment with MEDIHOPE Physiotherapy Centre has been cancelled.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #3498db;">Cancelled Appointment Details:</h3>
      <p><strong>Service:</strong> ${appointment.serviceName}</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time Slot:</strong> ${appointment.timeSlot}</p>
      <p><strong>Reference ID:</strong> ${appointment._id}</p>
    </div>
    
    <p>Please contact us if you wish to reschedule.</p>
    <p>For any queries, call us at +91-XXXXXXXXXX</p>
    
    <hr style="margin: 30px 0;">
    <p style="color: #7f8c8d; font-size: 14px;">
      MEDIHOPE Physiotherapy Centre<br>
      Address Line 1, Address Line 2<br>
      City, State - PIN Code<br>
      Phone: +91-XXXXXXXXXX
    </p>
  </div>
`,
appointmentBookedUser: (appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Appointment Request Received</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Thank you for booking an appointment with MEDIHOPE Physiotherapy Centre. Your request has been received and is pending confirmation.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Appointment Details:</h3>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> ${appointment.timeSlot}</p>
        <p><strong>Reference ID:</strong> ${appointment._id}</p>
        <p><strong>Status:</strong> Pending Confirmation</p>
      </div>
      
      <p>Our team will review your request and confirm the appointment within 24 hours.</p>
      <p>For any queries, call us at +91-6386065599</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #7f8c8d; font-size: 14px;">
        MEDIHOPE Physiotherapy Centre<br>
        Address Line 1, Address Line 2<br>
        City, State - PIN Code<br>
        Phone: +91-6386065599
      </p>
    </div>
  `,

  appointmentBookedAdmin: (appointment) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">📅 New Appointment Request</h2>
      <p><strong>Attention Admin Team,</strong></p>
      <p>A new appointment has been requested on the MEDIHOPE platform.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Appointment Details:</h3>
        <p><strong>Patient Name:</strong> ${appointment.patientName}</p>
        <p><strong>Phone:</strong> ${appointment.patientPhone}</p>
        <p><strong>Email:</strong> ${appointment.patientEmail}</p>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.timeSlot}</p>
        <p><strong>Health Concern:</strong> ${appointment.healthConcern || 'Not specified'}</p>
        <p><strong>Reference ID:</strong> ${appointment._id}</p>
        <p><strong>Booked Via:</strong> ${appointment.createdBy === 'guest' ? 'Public Website' : 'User Account'}</p>
      </div>
      
      <p><strong>Action Required:</strong> Please review and confirm this appointment in the admin panel.</p>
      
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/appointments/${appointment._id}" 
         style="display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        📋 View Appointment in Admin Panel
      </a>
      
      <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `,

  appointmentUpdated: (appointment, changes) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Appointment Details Updated</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment details have been updated by our admin team.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Updated Appointment Details:</h3>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> ${appointment.timeSlot}</p>
        <p><strong>Reference ID:</strong> ${appointment._id}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
        
        ${changes ? `
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 15px;">
          <h4 style="color: #856404;">Changes Made:</h4>
          <p>${changes}</p>
        </div>
        ` : ''}
      </div>
      
      <p>If you have any questions about these changes, please contact us at +91-6386065599</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #7f8c8d; font-size: 14px;">
        MEDIHOPE Physiotherapy Centre<br>
        Phone: +91-6386065599
      </p>
    </div>
  `,

  appointmentStatusChanged: (appointment, oldStatus) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Appointment Status Updated</h2>
      <p>Dear ${appointment.patientName},</p>
      <p>Your appointment status has been updated.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Appointment Details:</h3>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> ${appointment.timeSlot}</p>
        <p><strong>Reference ID:</strong> ${appointment._id}</p>
        
        <div style="margin-top: 15px; padding: 10px; background: ${appointment.status === 'confirmed' ? '#d4edda' : appointment.status === 'cancelled' ? '#f8d7da' : '#fff3cd'}; border-radius: 5px;">
          <p><strong>Status Changed:</strong> ${oldStatus} → <strong style="color: ${appointment.status === 'confirmed' ? '#155724' : appointment.status === 'cancelled' ? '#721c24' : '#856404'}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</strong></p>
        </div>
      </div>
      
      ${appointment.status === 'confirmed' ? `
        <p>🎉 Your appointment has been confirmed! Please arrive 10 minutes before your scheduled time.</p>
      ` : appointment.status === 'cancelled' ? `
        <p>We're sorry to inform you that your appointment has been cancelled. Please contact us to reschedule.</p>
      ` : appointment.status === 'completed' ? `
        <p>Thank you for choosing MEDIHOPE. We hope your session was beneficial.</p>
      ` : ''}
      
      <p>For any queries, call us at +91-6386065599</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #7f8c8d; font-size: 14px;">
        MEDIHOPE Physiotherapy Centre<br>
        Phone: +91-6386065599
      </p>
    </div>
  `,

  adminStatusChangeNotification: (appointment, oldStatus) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">📊 Appointment Status Updated (Admin Record)</h2>
      <p><strong>Admin Notification:</strong></p>
      <p>Appointment status has been changed by ${appointment.updatedBy || 'Admin'}.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #3498db;">Appointment Details:</h3>
        <p><strong>Patient:</strong> ${appointment.patientName}</p>
        <p><strong>Phone:</strong> ${appointment.patientPhone}</p>
        <p><strong>Service:</strong> ${appointment.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.timeSlot}</p>
        
        <div style="margin-top: 15px; padding: 10px; background: #e2e3e5; border-radius: 5px;">
          <p><strong>Status Change:</strong> ${oldStatus} → <strong>${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</strong></p>
          <p><strong>Change Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/appointments/${appointment._id}" 
         style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 5px;">
        View Appointment
      </a>
      
      <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
        This is a system notification for record-keeping purposes.
      </p>
    </div>
  `
};