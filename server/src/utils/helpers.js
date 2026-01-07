import moment from 'moment';
import crypto from 'crypto';

export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Format date to readable string
export const formatDate = (date, format = 'DD MMM YYYY') => {
  return moment(date).format(format);
};

// Format time slot
export const formatTimeSlot = (timeSlot) => {
  if (!timeSlot) return '';
  const [start, end] = timeSlot.split('-');
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// Format single time
export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${period}`;
};

// Generate random OTP
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Generate unique ID
export const generateUniqueId = (prefix = 'MED') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Sanitize string (remove special characters)
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9\s]/g, '').trim();
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate file name with timestamp
export const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${sanitized}-${timestamp}.${extension}`;
};

// Validate appointment date (not in past, not Sunday)
export const isValidAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is in past
  if (appointmentDate < today) {
    return { valid: false, message: 'Cannot book appointments in the past' };
  }
  
  // Check if Sunday (0 = Sunday)
  if (appointmentDate.getDay() === 0) {
    return { valid: false, message: 'Clinic is closed on Sundays' };
  }
  
  return { valid: true, message: 'Valid date' };
};

// Calculate appointment duration in minutes
export const calculateDuration = (timeSlot) => {
  if (!timeSlot) return 0;
  const [start, end] = timeSlot.split('-');
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return endTime - startTime;
};

// Generate hash for sensitive data
export const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Parse query parameters
export const parseQueryParams = (query) => {
  const params = {};
  
  if (query.page) params.page = parseInt(query.page) || 1;
  if (query.limit) params.limit = parseInt(query.limit) || 10;
  if (query.sort) params.sort = query.sort;
  if (query.search) params.search = query.search.trim();
  
  return params;
};

// Get status color for UI
export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    confirmed: 'success',
    completed: 'info',
    cancelled: 'danger',
    rescheduled: 'primary'
  };
  return colors[status] || 'secondary';
};

// Format currency (Indian Rupees)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Generate pagination metadata
export const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
};

// Sleep/delay function
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};