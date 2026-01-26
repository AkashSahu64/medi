// controllers/contact.controller.js
import Contact from '../models/Contact.model.js';
import { sendEmail } from '../utils/emailService.js';
import { validateEmail, validatePhone } from '../utils/helpers.js';
import { createNotification } from './notification.controller.js';

// @desc    Send contact message (public) - Updated version
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

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save contact message to database
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new',
      isRead: false,
      ipAddress,
      userAgent
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
            <p>📞 Phone: +91-6386065599<br>
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

    // Create notification for admin about new contact
    await createNotification({
      title: 'New Contact Message',
      message: `${name} sent a message: ${subject}`,
      type: 'contact',
      link: `/admin/contacts/${contact._id}`,
      data: { contactId: contact._id },
      priority: 'medium'
    });

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

// @desc    Get all contact messages (admin) - Enhanced version
// @route   GET /api/admin/contacts
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isRead
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Read/unread filter
    if (isRead === 'true') {
      query.isRead = true;
    } else if (isRead === 'false') {
      query.isRead = false;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .populate('repliedBy', 'name email')
      .populate('archivedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get counts for stats
    const total = await Contact.countDocuments(query);
    const newCount = await Contact.countDocuments({ status: 'new' });
    const unreadCount = await Contact.countDocuments({ isRead: false });
    const readCount = await Contact.countDocuments({ isRead: true });
    
    res.status(200).json({
      success: true,
      data: contacts,
      stats: {
        total,
        new: newCount,
        unread: unreadCount,
        read: readCount,
        replied: await Contact.countDocuments({ status: 'replied' }),
        archived: await Contact.countDocuments({ status: 'archived' })
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/admin/contacts/:id
// @access  Private/Admin
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'name email')
      .populate('archivedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    // Mark as read when viewing if not already read
    if (!contact.isRead) {
      contact.isRead = true;
      contact.status = 'read';
      await contact.save();
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact as read
// @route   PUT /api/admin/contacts/:id/read
// @access  Private/Admin
export const markContactAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        isRead: true,
        status: 'read' 
      },
      { new: true }
    ).populate('repliedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact,
      message: 'Message marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status, replyMessage } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { 
      status,
      isRead: status !== 'new' // Auto-mark as read when status changes from new
    };
    
    // If status is 'replied', record who replied and when
    if (status === 'replied') {
      updateData.repliedBy = req.user.id;
      updateData.repliedAt = new Date();
    }
    
    // If status is 'archived', record who archived and when
    if (status === 'archived') {
      updateData.archivedBy = req.user.id;
      updateData.archivedAt = new Date();
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('repliedBy', 'name email')
     .populate('archivedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    // Send reply email if status is 'replied' and replyMessage is provided
    if (status === 'replied' && replyMessage) {
      try {
        await sendEmail({
          email: contact.email,
          subject: `Re: ${contact.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c3e50;">Reply from MEDIHOPE</h2>
              <p>Dear ${contact.name},</p>
              <p>Thank you for contacting MEDIHOPE Physiotherapy Centre. Here is our response to your message:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #3498db;">Our Response:</h3>
                <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;">
                  ${replyMessage.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
                <h4 style="color: #2c3e50;">Original Message:</h4>
                <p><strong>Subject:</strong> ${contact.subject}</p>
                <p><strong>Date:</strong> ${new Date(contact.createdAt).toLocaleDateString()}</p>
                <p>${contact.message}</p>
              </div>
              
              <hr style="margin: 30px 0;">
              <p style="color: #7f8c8d; font-size: 14px;">
                MEDIHOPE Physiotherapy Centre<br>
                📞 Phone: +91-6386065599<br>
                📧 Email: info@medihope.com<br>
                🏥 Address: 123 Health Street, Medical City
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending reply email:', emailError);
        // Continue even if email fails
      }
    }
    
    res.status(200).json({
      success: true,
      data: contact,
      message: `Message status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message (hard delete)
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact message deleted permanently'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact messages (legacy version - without pagination)
// @route   GET /api/contact (legacy)
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .populate('repliedBy', 'name email')
      .populate('archivedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete/archive contact message (legacy)
// @route   DELETE /api/contact/:id (legacy)
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'archived',
        isRead: true,
        archivedBy: req.user.id,
        archivedAt: new Date()
      },
      { new: true }
    ).populate('archivedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact,
      message: 'Message archived successfully'
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Mark all contacts as read
// @route   PUT /api/admin/contacts/read-all
// @access  Private/Admin
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Contact.updateMany(
      { isRead: false },
      { 
        isRead: true,
        status: 'read' 
      }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete contacts
// @route   DELETE /api/admin/contacts/bulk
// @access  Private/Admin
export const bulkDeleteContacts = async (req, res, next) => {
  try {
    const { contactIds } = req.body;
    
    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide contact IDs to delete'
      });
    }
    
    const result = await Contact.deleteMany({
      _id: { $in: contactIds }
    });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} messages deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};