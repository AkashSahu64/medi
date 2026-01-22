export const TIME_SLOTS = [
  '09:00-09:30',
  '09:30-10:00',
  '10:00-10:30',
  '10:30-11:00',
  '11:00-11:30',
  '11:30-12:00',
  '12:00-12:30',
  '12:30-13:00',
  '14:00-14:30',
  '14:30-15:00',
  '15:00-15:30',
  '15:30-16:00',
  '16:00-16:30',
  '16:30-17:00',
  '17:00-17:30',
  '17:30-18:00',
];

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
};

export const SERVICE_CATEGORIES = {
  MUSCULOSKELETAL: 'musculoskeletal',
  NEUROLOGICAL: 'neurological',
  SPORTS: 'sports',
  PEDIATRIC: 'pediatric',
  GERIATRIC: 'geriatric',
  POSTOPERATIVE: 'postoperative',
};

export const SERVICE_CATEGORY_LABELS = {
  [SERVICE_CATEGORIES.MUSCULOSKELETAL]: 'Musculoskeletal',
  [SERVICE_CATEGORIES.NEUROLOGICAL]: 'Neurological',
  [SERVICE_CATEGORIES.SPORTS]: 'Sports',
  [SERVICE_CATEGORIES.PEDIATRIC]: 'Pediatric',
  [SERVICE_CATEGORIES.GERIATRIC]: 'Geriatric',
  [SERVICE_CATEGORIES.POSTOPERATIVE]: 'Post-Operative',
};

export const CLINIC_INFO = {
  name: 'MEDIHOPE Physiotherapy Centre',
  address: '123 Health Street, Medical City, MC 12345',
  phone: '+91-9876543210',
  PHONE_FULL: '+91-9876543210',
  PHONE_MOBILE: '9876543210',
  email: 'info@medihope.com',
  whatsapp: '+919876543210',
  workingHours: {
    weekdays: '9:00 AM - 7:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed',
  },
};