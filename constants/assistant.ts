/**
 * Constants for Assistant pages
 */

export const ASSISTANT_NAVIGATION = [
  { href: '/assistant/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/assistant/appointments', label: 'Appointments', icon: 'list_alt' },
  { href: '/assistant/patients', label: 'Patients', icon: 'group' },
  { href: '/assistant/calendar', label: 'Calendar', icon: 'calendar_month' },
  { href: '/assistant/reports', label: 'Reports', icon: 'bar_chart' },
  { href: '/assistant/communications', label: 'Communications', icon: 'chat' },
  { href: '/assistant/settings', label: 'Settings', icon: 'settings' },
] as const

export const APPOINTMENT_STATUSES = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export const APPOINTMENT_STATUS_COLORS = {
  confirmed: 'bg-green-500 text-white',
  pending: 'bg-yellow-500 text-white',
  cancelled: 'bg-red-500 text-white',
  completed: 'bg-blue-500 text-white',
} as const

export const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
] as const

export const PATIENT_TYPES = {
  NEW: 'new',
  OLD: 'old',
  OT: 'ot',
} as const

