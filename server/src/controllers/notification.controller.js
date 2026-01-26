// controllers/notification.controller.js
import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = { 
      $or: [
        { userId: req.user.id },
        { userId: { $exists: false } } // System notifications
      ]
    };
    
    if (unreadOnly) {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false
    });
    
    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.id,
        $or: [
          { userId: req.user.id },
          { userId: { $exists: false } }
        ]
      },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { 
        $or: [
          { userId: req.user.id },
          { userId: { $exists: false } }
        ],
        isRead: false
      },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { userId: { $exists: false } }
      ]
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notification stats
// @route   GET /api/notifications/stats
// @access  Private
export const getNotificationStats = async (req, res, next) => {
  try {
    const stats = await Notification.aggregate([
      {
        $match: {
          $or: [
            { userId: req.user._id },
            { userId: { $exists: false } }
          ],
          isRead: false
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalUnread = stats.reduce((sum, stat) => sum + stat.count, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalUnread,
        byType: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to create notifications (can be imported elsewhere)
export const createNotification = async ({
  title,
  message,
  type = 'system',
  userId = null,
  link = null,
  data = null,
  priority = 'medium'
}) => {
  try {
    const notification = await Notification.create({
      title,
      message,
      type,
      userId,
      link,
      data,
      priority
    });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};