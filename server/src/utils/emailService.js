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
};