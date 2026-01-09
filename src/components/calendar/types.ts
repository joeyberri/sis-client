// Calendar types and constants
export type EventType =
  | 'assignment'
  | 'quiz'
  | 'exam'
  | 'meeting'
  | 'holiday'
  | 'event'
  | 'deadline'
  | 'class'
  | 'reminder';
export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReminderTime =
  | '5min'
  | '15min'
  | '30min'
  | '1hour'
  | '1day'
  | '1week';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  priority: EventPriority;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  color?: string;
  reminders: ReminderTime[];
  attendees?: string[];
  createdBy: string;
  classId?: string;
  subjectId?: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  completed?: boolean;
}

export interface CalendarFilter {
  types: EventType[];
  priorities: EventPriority[];
  showCompleted: boolean;
}

export const EVENT_COLORS: Record<EventType, string> = {
  assignment: 'bg-blue-500',
  quiz: 'bg-purple-500',
  exam: 'bg-red-500',
  meeting: 'bg-green-500',
  holiday: 'bg-orange-500',
  event: 'bg-teal-500',
  deadline: 'bg-rose-500',
  class: 'bg-indigo-500',
  reminder: 'bg-yellow-500'
};

// Solar icon names for event types
export const EVENT_ICON_NAMES: Record<EventType, string> = {
  assignment: 'solar:document-text-bold-duotone',
  quiz: 'solar:notebook-bold-duotone',
  exam: 'solar:diploma-bold-duotone',
  meeting: 'solar:users-group-rounded-bold-duotone',
  holiday: 'solar:flag-bold-duotone',
  event: 'solar:calendar-bold-duotone',
  deadline: 'solar:danger-circle-bold-duotone',
  class: 'solar:book-2-bold-duotone',
  reminder: 'solar:bell-bold-duotone'
};

export const REMINDER_OPTIONS: { value: ReminderTime; label: string }[] = [
  { value: '5min', label: '5 minutes before' },
  { value: '15min', label: '15 minutes before' },
  { value: '30min', label: '30 minutes before' },
  { value: '1hour', label: '1 hour before' },
  { value: '1day', label: '1 day before' },
  { value: '1week', label: '1 week before' }
];
