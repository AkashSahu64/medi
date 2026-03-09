import express from 'express';
import { sendWhatsAppMessage } from '../utils/whatsappService.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * TEST EMAIL
 * http://localhost:5000/api/test/email
 */
router.get('/email', async (req, res) => {
  try {
    await sendEmail({
      email: 'aakashsahu9415954491@gmail.com', // apna email
      subject: 'Test Email - Medihope',
      html: `<h1>Hi Akash 👋</h1><p>Email system working perfectly 🚀</p>`
    });

    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * TEST WHATSAPP
 * http://localhost:5000/api/test/whatsapp
 */
router.get('/whatsapp', async (req, res) => {
  try {
    const result = await sendWhatsAppMessage(
      '8076839661', // without +91
      'Hello Akash 👋 WhatsApp system working perfectly!'
    );

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * TEST BOTH
 * http://localhost:5000/api/test/both
 */
router.get('/both', async (req, res) => {
  try {
    await sendEmail({
      email: 'aakashsahu9415954491@gmail.com',
      subject: 'Test Both - Medihope',
      html: `<h2>Email + WhatsApp test successful 🎉</h2>`
    });

    await sendWhatsAppMessage(
      '8076839661',
      'Email + WhatsApp dono successfully kaam kar rahe hain 🎉'
    );

    res.json({ success: true, message: 'Email + WhatsApp both sent' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
