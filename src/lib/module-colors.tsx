'use client';

import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

// Module color definitions - each module has a consistent color scheme
export const moduleColors = {
  // Core Academic
  students: {
    primary: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    bgSolid: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    accent: '#3B82F6'
  },
  teachers: {
    primary: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    bgSolid: 'bg-purple-500',
    border: 'border-purple-200 dark:border-purple-800',
    badge:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    accent: '#9333EA'
  },
  classes: {
    primary: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    bgSolid: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    accent: '#10B981'
  },

  // Assessment & Grading
  assessments: {
    primary: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    bgSolid: 'bg-orange-500',
    border: 'border-orange-200 dark:border-orange-800',
    badge:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    accent: '#F97316'
  },
  grades: {
    primary: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    bgSolid: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-800',
    badge:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    accent: '#F59E0B'
  },

  // Finance
  fees: {
    primary: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    bgSolid: 'bg-green-500',
    border: 'border-green-200 dark:border-green-800',
    badge:
      'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    accent: '#22C55E'
  },
  payments: {
    primary: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    bgSolid: 'bg-teal-500',
    border: 'border-teal-200 dark:border-teal-800',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    accent: '#14B8A6'
  },
  invoices: {
    primary: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    bgSolid: 'bg-cyan-500',
    border: 'border-cyan-200 dark:border-cyan-800',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    accent: '#06B6D4'
  },

  // Attendance & Calendar
  attendance: {
    primary: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    bgSolid: 'bg-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-800',
    badge:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    accent: '#6366F1'
  },
  calendar: {
    primary: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    bgSolid: 'bg-violet-500',
    border: 'border-violet-200 dark:border-violet-800',
    badge:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    accent: '#8B5CF6'
  },

  // Communication
  messages: {
    primary: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    bgSolid: 'bg-sky-500',
    border: 'border-sky-200 dark:border-sky-800',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    accent: '#0EA5E9'
  },
  alerts: {
    primary: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    bgSolid: 'bg-rose-500',
    border: 'border-rose-200 dark:border-rose-800',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    accent: '#F43F5E'
  },

  // Admin & Settings
  settings: {
    primary: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-950/30',
    bgSolid: 'bg-slate-500',
    border: 'border-slate-200 dark:border-slate-800',
    badge:
      'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300',
    accent: '#64748B'
  },
  reports: {
    primary: 'text-fuchsia-600 dark:text-fuchsia-400',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
    bgSolid: 'bg-fuchsia-500',
    border: 'border-fuchsia-200 dark:border-fuchsia-800',
    badge:
      'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300',
    accent: '#D946EF'
  },
  analytics: {
    primary: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    bgSolid: 'bg-pink-500',
    border: 'border-pink-200 dark:border-pink-800',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    accent: '#EC4899'
  },

  // Documents
  documents: {
    primary: 'text-lime-600 dark:text-lime-400',
    bg: 'bg-lime-50 dark:bg-lime-950/30',
    bgSolid: 'bg-lime-500',
    border: 'border-lime-200 dark:border-lime-800',
    badge: 'bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-300',
    accent: '#84CC16'
  },

  // Parents
  parents: {
    primary: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    bgSolid: 'bg-red-500',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    accent: '#EF4444'
  },

  // Dashboard
  dashboard: {
    primary: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-950/30',
    bgSolid: 'bg-slate-500',
    border: 'border-slate-200 dark:border-slate-800',
    badge:
      'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300',
    accent: '#64748B'
  }
} as const;

export type ModuleName = keyof typeof moduleColors;

// Solar icon mappings (duotone variants)
export const moduleIcons = {
  students: 'solar:graduation-cap-bold-duotone',
  teachers: 'solar:user-speak-bold-duotone',
  classes: 'solar:book-bookmark-bold-duotone',
  assessments: 'solar:document-text-bold-duotone',
  grades: 'solar:star-bold-duotone',
  fees: 'solar:wallet-bold-duotone',
  payments: 'solar:card-bold-duotone',
  invoices: 'solar:bill-list-bold-duotone',
  attendance: 'solar:calendar-mark-bold-duotone',
  calendar: 'solar:calendar-bold-duotone',
  messages: 'solar:chat-round-dots-bold-duotone',
  alerts: 'solar:bell-bold-duotone',
  settings: 'solar:settings-bold-duotone',
  reports: 'solar:chart-2-bold-duotone',
  analytics: 'solar:graph-bold-duotone',
  documents: 'solar:folder-open-bold-duotone',
  parents: 'solar:users-group-two-rounded-bold-duotone',
  dashboard: 'solar:widget-2-bold-duotone',
  profile: 'solar:user-circle-bold-duotone',
  help: 'solar:question-circle-bold-duotone',
  logout: 'solar:logout-2-bold-duotone',
  search: 'solar:magnifer-bold-duotone',
  add: 'solar:add-circle-bold-duotone',
  edit: 'solar:pen-bold-duotone',
  delete: 'solar:trash-bin-trash-bold-duotone',
  view: 'solar:eye-bold-duotone',
  download: 'solar:download-bold-duotone',
  upload: 'solar:upload-bold-duotone',
  filter: 'solar:filter-bold-duotone',
  sort: 'solar:sort-bold-duotone',
  more: 'solar:menu-dots-bold',
  close: 'solar:close-circle-bold-duotone',
  check: 'solar:check-circle-bold-duotone',
  warning: 'solar:danger-triangle-bold-duotone',
  info: 'solar:info-circle-bold-duotone',
  error: 'solar:close-circle-bold-duotone',
  success: 'solar:check-circle-bold-duotone'
} as const;

// Module icon component with color support
interface ModuleIconProps {
  module: keyof typeof moduleIcons;
  className?: string;
  size?: number | string;
  colored?: boolean;
}

export function ModuleIcon({
  module,
  className,
  size = 24,
  colored = true
}: ModuleIconProps) {
  const iconName = moduleIcons[module];
  const colors =
    module in moduleColors ? moduleColors[module as ModuleName] : undefined;

  return (
    <Icon
      icon={iconName}
      className={cn(colored && colors?.primary, className)}
      width={size}
      height={size}
    />
  );
}

// Wrapper for sidebar navigation items with module colors
interface ModuleNavItemProps {
  module: ModuleName;
  label: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ModuleNavIcon({
  module,
  className,
  isActive = false
}: {
  module: ModuleName;
  className?: string;
  isActive?: boolean;
}) {
  const colors = moduleColors[module];
  const iconName = moduleIcons[module];

  return (
    <div
      className={cn(
        'rounded-lg p-1.5 transition-colors',
        isActive ? colors.bgSolid + ' text-white' : colors.bg,
        className
      )}
    >
      <Icon
        icon={iconName}
        className={cn(isActive ? 'text-white' : colors.primary)}
        width={20}
        height={20}
      />
    </div>
  );
}

// Get module color scheme
export function getModuleColors(module: ModuleName) {
  return moduleColors[module];
}

// Export Icon for direct use
export { Icon };
