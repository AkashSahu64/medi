import twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER,
  NODE_ENV,
} = process.env;

// 🔍 Debug (safe)
console.log('TWILIO SID:', TWILIO_ACCOUNT_SID);

let client = null;

// ✅ SAFE initialization (NO CRASH)
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
} else {
  console.warn('⚠️ Twilio credentials missing. WhatsApp disabled.');
}

export const sendWhatsAppMessage = async (to, message) => {
  // ✅ Prevent server crash
  if (!client) {
    if (NODE_ENV === 'development') {
      console.log('📩 Mock WhatsApp message:', { to, message });
      return { success: true, mock: true };
    }
    throw new Error('WhatsApp service not configured');
  }

  const formattedNumber = to.startsWith('+')
    ? `whatsapp:${to}`
    : `whatsapp:+91${to}`;

  const response = await client.messages.create({
    body: message,
    from: TWILIO_WHATSAPP_NUMBER,
    to: formattedNumber,
  });

  console.log('WhatsApp message sent:', response.sid);
  return { success: true, sid: response.sid };
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
};