import Contact from '../models/Contact.model.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { validateEmail, validatePhone } from '../utils/helpers.js';

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (phone && !validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number',
      });
    }

    // Save contact message to database
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new',
    });

    try {
      // Send email notification to admin
      await sendEmail({
        email: process.env.ADMIN_EMAIL || 'admin@medihope.com',
        subject: `New Contact Message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">New Contact Message Received</h2>
            <p>A new message has been received through the MEDIHOPE contact form.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #3498db;">Message Details:</h3>
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Message ID:</strong> ${contact._id}</p>
            </div>
            
            <p>Please login to the admin panel to manage this message.</p>
            
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin" 
               style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </div>
        `,
      });

      // Send auto-response to the sender
      await sendEmail({
        email: email,
        subject: 'Thank you for contacting MEDIHOPE',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Message Received</h2>
            <p>Dear ${name},</p>
            <p>Thank you for contacting MEDIHOPE Physiotherapy Centre. We have received your message and will get back to you within 24 hours.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #3498db;">Your Message Summary:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Reference ID:</strong> ${contact._id}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p><strong>Our Contact Information:</strong></p>
            <p>📞 Phone: +91-9876543210<br>
               📧 Email: info@medihope.com<br>
               🏥 Address: 123 Health Street, Medical City</p>
            
            <p><strong>Working Hours:</strong><br>
               Monday - Friday: 9:00 AM - 7:00 PM<br>
               Saturday: 9:00 AM - 2:00 PM<br>
               Sunday: Closed</p>
            
            <hr style="margin: 30px 0;">
            <p style="color: #7f8c8d; font-size: 14px;">
              This is an automated response. Please do not reply to this email.<br>
              MEDIHOPE Physiotherapy Centre
            </p>
          </div>
        `,
      });

    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the contact creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt,
      },
    });

  } catch (error) {
    console.error('Contact creation error:', error);
    
    // Handle duplicate submissions or validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', '),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate submission detected. Please wait before sending another message.',
      });
    }

    next(error);
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const messages = await Contact.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pages: Math.ceil(total / limit),
      data: messages,
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    next(error);
  }
};

// @desc    Update contact message status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    // If status is changing to 'replied', record who replied and when
    if (status === 'replied' && contact.status !== 'replied') {
      contact.repliedBy = req.user.id;
      contact.repliedAt = new Date();
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: `Contact message marked as ${status}`,
      data: contact,
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact message ID',
      });
    }

    next(error);
  }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    // Soft delete by marking as archived
    contact.status = 'archived';
    contact.archivedAt = new Date();
    contact.archivedBy = req.user.id;
    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Contact message archived successfully',
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact message ID',
      });
    }

    next(error);
  }
};