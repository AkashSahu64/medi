import twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
  NODE_ENV,
} = process.env;

// 🔍 Debug (safe)
console.log('TWILIO SID:', TWILIO_ACCOUNT_SID ? 'Present' : 'Missing');
console.log('TWILIO WhatsApp Number:', TWILIO_WHATSAPP_NUMBER);

let client = null;

// ✅ SAFE initialization (NO CRASH)
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log('✅ Twilio client initialized');
} else {
  console.warn('⚠️ Twilio credentials missing. WhatsApp disabled.');
}

// ✅ Phone Number Normalization Helper
export const normalizePhoneNumber = (phone) => {
  if (!phone) {
    console.error('❌ Phone number is empty/null');
    return null;
  }

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Validate length
  if (cleaned.length < 10) {
    console.error(`❌ Invalid phone number length: ${cleaned.length} digits`);
    return null;
  }

  // Handle different formats:
  // 1. 10-digit Indian number (most common) -> +91XXXXXXXXXX
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // 2. Already has 91 prefix (12 digits) -> +91XXXXXXXXXX
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }

  // 3. Already has +91 (13 digits) -> keep as is
  if (cleaned.length === 13 && cleaned.startsWith('9191')) {
    // Remove duplicate 91
    return `+${cleaned.substring(2)}`;
  }

  // 4. Already has country code
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }

  // Default: assume Indian number
  return `+91${cleaned.slice(-10)}`;
};

// ✅ Validate phone number
export const isValidPhoneNumber = (phone) => {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return false;

  // Basic validation: should have country code and at least 10 digits
  const digits = normalized.replace(/\D/g, '');
  return digits.length >= 10;
};

export const sendWhatsAppMessage = async (to, message, templateName = 'unknown') => {
  console.log(`📱 Attempting WhatsApp send - Template: ${templateName}`);

  // ✅ Normalize phone number
  const normalizedTo = normalizePhoneNumber(to);
  if (!normalizedTo) {
    console.error(`❌ Invalid phone number: ${to}. WhatsApp not sent.`);
    return {
      success: false,
      error: 'Invalid phone number',
      normalizedTo: null
    };
  }

  console.log(`📱 Phone Details - Original: ${to}, Normalized: ${normalizedTo}`);
  console.log(`📝 Message length: ${message.length} chars`);
  console.log(`📋 Message preview: ${message.substring(0, 100)}...`);

  // ✅ Prevent server crash if Twilio not configured
  if (!client) {
    if (NODE_ENV === 'development') {
      console.log(`📩 [MOCK] WhatsApp message to: ${normalizedTo}`);
      console.log(`📩 [MOCK] Template: ${templateName}`);
      console.log(`📩 [MOCK] Message: ${message.substring(0, 150)}...`);
      return {
        success: true,
        mock: true,
        normalizedTo,
        templateName
      };
    }
    console.warn(`⚠️ WhatsApp service not configured. Message not sent to: ${normalizedTo}`);
    return {
      success: false,
      error: 'WhatsApp service not configured',
      normalizedTo
    };
  }

  try {
    // Ensure Twilio number is properly formatted
    const fromNumber = TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
      ? TWILIO_WHATSAPP_NUMBER
      : `whatsapp:${TWILIO_WHATSAPP_NUMBER}`;

    const toNumber = normalizedTo.startsWith('whatsapp:')
      ? normalizedTo
      : `whatsapp:${normalizedTo}`;

    console.log(`📤 Twilio API call - From: ${fromNumber}, To: ${toNumber}`);

    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber,
    });

    console.log(`✅ WhatsApp message sent successfully!`);
    console.log(`   Message SID: ${response.sid}`);
    console.log(`   To: ${toNumber}`);
    console.log(`   Template: ${templateName}`);
    console.log(`   Status: ${response.status}`);

    return {
      success: true,
      sid: response.sid,
      status: response.status,
      normalizedTo,
      templateName
    };
  } catch (error) {
    console.error(`❌ WhatsApp sending error:`, {
      message: error.message,
      code: error.code,
      phone: normalizedTo,
      template: templateName
    });

    // Log Twilio error details if available
    if (error.moreInfo) {
      console.error(`❌ Twilio Error Details:`, error.moreInfo);
    }

    return {
      success: false,
      error: error.message,
      code: error.code,
      normalizedTo,
      templateName,
      mock: NODE_ENV === 'development'
    };
  }
};

export const whatsappTemplates = {
  appointmentConfirmation: (appointment) => `
*Appointment Confirmed* ✅

Dear ${appointment.patientName},

Your appointment with MEDIHOPE Physiotherapy Centre has been confirmed.

*Details:*
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Time: ${appointment.timeSlot}
Ref ID: ${appointment._id}

Please arrive 10 minutes early.

For queries: +91-XXXXXXXXXX

_This is an automated message. Please do not reply._
  `.trim(),

  appointmentReminder: (appointment) => `
*Appointment Reminder* ⏰

Reminder: You have an appointment tomorrow at MEDIHOPE.

Time: ${appointment.timeSlot}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Service: ${appointment.serviceName}

Please call +91-XXXXXXXXXX if you need to reschedule.

_This is an automated reminder._
  `.trim(),

  appointmentBookedUser: (appointment) => `
*Appointment Request Received* 📅

Dear ${appointment.patientName},

Thank you for booking with MEDIHOPE Physiotherapy Centre.

*Details:*
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Time: ${appointment.timeSlot}
Ref ID: ${appointment._id}
Status: Pending Confirmation

We'll confirm your appointment within 24 hours.

For queries: +91-6386065599

_This is an automated message. Please do not reply._
  `.trim(),

  appointmentBookedAdmin: (appointment) => `
*🚨 NEW APPOINTMENT REQUEST*

Patient: ${appointment.patientName}
Phone: ${appointment.patientPhone}
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Time: ${appointment.timeSlot}
Ref ID: ${appointment._id}
Booked Via: ${appointment.createdBy === 'guest' ? 'Website' : 'User Account'}

Action Required: Please review and confirm in admin panel.

_This is an automated alert._
  `.trim(),

  appointmentUpdated: (appointment, changes) => `
*Appointment Updated* ✏️

Dear ${appointment.patientName},

Your appointment details have been updated.

*Updated Details:*
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Time: ${appointment.timeSlot}
Ref ID: ${appointment._id}
Status: ${appointment.status}

${changes ? `Changes: ${changes}` : ''}

Contact: +91-6386065599 for queries.

_This is an automated update._
  `.trim(),

  appointmentStatusChanged: (appointment, oldStatus) => `
*Appointment Status Updated* 🔄

Dear ${appointment.patientName},

Your appointment status has changed.

*Details:*
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Time: ${appointment.timeSlot}
Ref ID: ${appointment._id}

*Status:* ${oldStatus} → ${appointment.status.toUpperCase()}

${appointment.status === 'confirmed' ? '✅ Please arrive 10 minutes early.' : ''}
${appointment.status === 'cancelled' ? '❌ Please contact us to reschedule.' : ''}

Contact: +91-6386065599

_This is an automated notification._
  `.trim(),

  adminStatusChangeNotification: (appointment, oldStatus) => `
*ADMIN: Status Changed*

Patient: ${appointment.patientName}
Phone: ${appointment.patientPhone}
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}

Status: ${oldStatus} → ${appointment.status}
Changed: ${new Date().toLocaleTimeString()}

_System notification_
  `.trim(),
  
  appointmentConfirmation: (appointment) => `
*Appointment Confirmed* ✅

Dear ${appointment.patientName},

Your appointment with MEDIHOPE Physiotherapy Centre has been confirmed.

*Details:*
Service: ${appointment.serviceName}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Time: ${appointment.timeSlot}
Ref ID: ${appointment._id}

Please arrive 10 minutes early.

For queries: +91-6386065599

_This is an automated message. Please do not reply._
  `.trim(),
  
  appointmentReminder: (appointment) => `
*Appointment Reminder* ⏰

Reminder: You have an appointment tomorrow at MEDIHOPE.

Time: ${appointment.timeSlot}
Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}
Service: ${appointment.serviceName}

Please call +91-6386065599 if you need to reschedule.

_This is an automated reminder._
  `.trim(),
};