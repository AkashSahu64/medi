import { 
  format, 
  parseISO, 
  isValid, 
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths
} from 'date-fns';
import { FaCalendarAlt, FaComments, FaEnvelope, FaExclamationTriangle, FaInfoCircle, FaUser } from 'react-icons/fa';

// Date formatting
export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, formatStr);
  } catch (error) {
    return '';
  }
};

// Add to your existing helpers.js or create new notification helpers
export const getNotificationTypeIcon = (type) => {
  const icons = {
    appointment: <FaCalendarAlt />,
    testimonial: <FaComments />,
    user: <FaUser />,
    contact: <FaEnvelope />,
    system: <FaInfoCircle />,
    urgent: <FaExclamationTriangle />
  };
  return icons[type] || icons.system;
};

export const getNotificationTypeColor = (type) => {
  const colors = {
    appointment: 'text-blue-500 bg-blue-100',
    testimonial: 'text-green-500 bg-green-100',
    user: 'text-purple-500 bg-purple-100',
    contact: 'text-yellow-500 bg-yellow-100',
    system: 'text-gray-500 bg-gray-100',
    urgent: 'text-red-500 bg-red-100'
  };
  return colors[type] || colors.system;
};

export const getPriorityColor = (priority) => {
  const colors = {
    urgent: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[priority] || colors.medium;
};

// Time formatting
export const formatTime = (time) => {
  if (!time) return '';
  
  try {
    const [start, end] = time.split('-');
    const formatTimePart = (t) => {
      const [hours, minutes] = t.split(':');
      const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const formattedHours = parseInt(hours) % 12 || 12;
      return `${formattedHours}:${minutes} ${period}`;
    };
    
    return `${formatTimePart(start)} - ${formatTimePart(end)}`;
  } catch (error) {
    return time;
  }
};

// Format date and time together
export const formatDateTime = (date, time) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    const dateStr = format(dateObj, 'dd MMM yyyy');
    return time ? `${dateStr} • ${formatTime(time)}` : dateStr;
  } catch (error) {
    return '';
  }
};

// Time ago formatting
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    const now = new Date();
    
    // Calculate differences
    const seconds = differenceInSeconds(now, dateObj);
    const minutes = differenceInMinutes(now, dateObj);
    const hours = differenceInHours(now, dateObj);
    const days = differenceInDays(now, dateObj);
    const weeks = differenceInWeeks(now, dateObj);
    const months = differenceInMonths(now, dateObj);
    
    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else if (weeks < 4) {
      return `${weeks}w ago`;
    } else if (months < 12) {
      return `${months}mo ago`;
    } else {
      return format(dateObj, 'dd MMM yyyy');
    }
  } catch (error) {
    return '';
  }
};

// Format relative time for dashboard
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    const now = new Date();
    const diffInHours = differenceInHours(now, dateObj);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = differenceInDays(now, dateObj);
      return `${diffInDays} days ago`;
    }
  } catch (error) {
    return '';
  }
};

// Format currency (Indian Rupees)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  
  try {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  } catch (error) {
    return `₹${amount}`;
  }
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  try {
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('en-IN').format(number);
  } catch (error) {
    return String(num);
  }
};

// Format phone number for display
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Validation functions
export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Text utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Status utilities
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-cyan-100 text-cyan-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'rescheduled':
      return 'bg-purple-100 text-purple-800';
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'read':
      return 'bg-gray-100 text-gray-800';
    case 'replied':
      return 'bg-green-100 text-green-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    case true:
    case 'true':
    case 'active':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case false:
    case 'false':
    case 'inactive':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'rescheduled':
      return 'Rescheduled';
    case 'new':
      return 'New';
    case 'read':
      return 'Read';
    case 'replied':
      return 'Replied';
    case 'archived':
      return 'Archived';
    case true:
    case 'true':
      return 'Active';
    case false:
    case 'false':
      return 'Inactive';
    default:
      return capitalizeWords(status);
  }
};

// WhatsApp utilities
export const generateWhatsAppLink = (phone, message = '') => {
  if (!phone) return '#';
  
  const cleanedPhone = phone.replace(/\D/g, '');
  const phoneWithCountryCode = cleanedPhone.startsWith('91') ? cleanedPhone : `91${cleanedPhone}`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phoneWithCountryCode}${message ? `?text=${encodedMessage}` : ''}`;
};

// Date utilities for appointments
export const isPastDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    
    return dateObj < today;
  } catch (error) {
    return false;
  }
};

export const isToday = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    
    return dateObj.getTime() === today.getTime();
  } catch (error) {
    return false;
  }
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Generate avatar URL from name
export const generateAvatarUrl = (name, size = 200) => {
  if (!name) return `https://ui-avatars.com/api/?name=Unknown&background=random&size=${size}`;
  
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&size=${size}`;
};

// Get age from birth date
export const getAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    if (!isValid(birthDateObj)) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return null;
  }
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format duration in minutes to readable format
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}min` : ''}`.trim();
  }
};

// Generate random ID (for testing)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Export all functions
export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatTimeAgo,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  formatPhone,
  validatePhone,
  validateEmail,
  truncateText,
  capitalize,
  capitalizeWords,
  getStatusColor,
  getStatusText,
  generateWhatsAppLink,
  isPastDate,
  isToday,
  getInitials,
  generateAvatarUrl,
  getAge,
  debounce,
  formatDuration,
  generateId
};