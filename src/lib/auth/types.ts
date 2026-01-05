/**
 * Shared types and constants for authentication
 */

// ============================================
// Role-Permission Mapping
// ============================================

/**
 * Defines which permissions each role has by default
 * This should match the configuration in Clerk Dashboard
 */
export const ROLE_PERMISSIONS: Record<SISRole, Permission[]> = {
  'org:admin': [
    // Classes
    'org:classes_read',
    'org:classes_manage',
    // Grades
    'org:grades_read',
    'org:grades_manage',
    // Attendance
    'org:attendance_read',
    'org:attendance_manage',
    // Assessments
    'org:assessments_read',
    'org:assessments_create',
    'org:assessments_grade',
    // Finance
    'org:fees_read',
    'org:fees_manage',
    'org:payments_manage',
    'org:financial_reports_read',
    // Counselor
    'org:counselor_notes_read',
    // Behavioral
    'org:behavioral_read',
    'org:behavioral_manage',
    // Reports
    'org:analytics_read',
    'org:academic_reports_read',
    'org:report_cards_generate',
    // People
    'org:students_read',
    'org:students_manage',
    'org:teachers_read',
    'org:teachers_manage',
    'org:parents_read',
    'org:parents_manage',
  ],
  
  'org:teacher': [
    // Classes
    'org:classes_read',
    // Grades
    'org:grades_read',
    'org:grades_manage',
    // Attendance
    'org:attendance_read',
    'org:attendance_manage',
    // Assessments
    'org:assessments_read',
    'org:assessments_create',
    'org:assessments_grade',
    // Behavioral
    'org:behavioral_read',
    'org:behavioral_manage',
    // Reports
    'org:academic_reports_read',
    'org:report_cards_generate',
    // Students (read only)
    'org:students_read',
  ],
  
  'org:student': [
    // Own grades
    'org:grades_read',
    // Own attendance
    'org:attendance_read',
    // Own assessments
    'org:assessments_read',
  ],
  
  'org:parent': [
    // Child's grades
    'org:grades_read',
    // Child's attendance
    'org:attendance_read',
    // Child's assessments
    'org:assessments_read',
    // Fee viewing
    'org:fees_read',
    // Behavioral records
    'org:behavioral_read',
    // Academic reports
    'org:academic_reports_read',
  ],
  
  'org:counselor': [
    // Classes (read)
    'org:classes_read',
    // Grades (read)
    'org:grades_read',
    // Attendance (read)
    'org:attendance_read',
    // Counselor notes
    'org:counselor_notes_read',
    'org:counselor_notes_manage',
    // Behavioral
    'org:behavioral_read',
    'org:behavioral_manage',
    // Students (read)
    'org:students_read',
  ],
  
  'org:accountant': [
    // Finance full access
    'org:fees_read',
    'org:fees_manage',
    'org:payments_manage',
    'org:financial_reports_read',
    // Students (read for billing)
    'org:students_read',
    // Parents (read for billing)
    'org:parents_read',
  ],
  
  'org:member': [
    // Default member has minimal permissions
    // Usually assigned before proper role is set
  ],
};

// ============================================
// Role Display Configuration
// ============================================

/**
 * Human-readable names for roles
 */
export const ROLE_DISPLAY_NAMES: Record<SISRole, string> = {
  'org:admin': 'Administrator',
  'org:teacher': 'Teacher',
  'org:student': 'Student',
  'org:parent': 'Parent / Guardian',
  'org:counselor': 'Counselor',
  'org:accountant': 'Accountant',
  'org:member': 'Member',
};

/**
 * Role colors for badges and UI
 */
export const ROLE_COLORS: Record<SISRole, { bg: string; text: string; border: string }> = {
  'org:admin': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  'org:teacher': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'org:student': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  'org:parent': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'org:counselor': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'org:accountant': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  'org:member': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
};

/**
 * Role icons (Lucide icon names)
 */
export const ROLE_ICONS: Record<SISRole, string> = {
  'org:admin': 'Shield',
  'org:teacher': 'GraduationCap',
  'org:student': 'BookOpen',
  'org:parent': 'Users',
  'org:counselor': 'Heart',
  'org:accountant': 'Calculator',
  'org:member': 'User',
};

// ============================================
// Dashboard Routes
// ============================================

/**
 * Maps roles to their primary dashboard routes
 */
export const ROLE_DASHBOARD_ROUTES: Record<SISRole, DashboardRoute> = {
  'org:admin': '/dashboard/admin',
  'org:teacher': '/dashboard/teacher',
  'org:student': '/dashboard/student',
  'org:parent': '/dashboard/parent',
  'org:counselor': '/dashboard/counselor',
  'org:accountant': '/dashboard/accountant',
  'org:member': '/dashboard/admin', // Fallback
};

// ============================================
// Permission Groups
// ============================================

/**
 * Group permissions by feature for UI organization
 */
export const PERMISSION_GROUPS = {
  academic: [
    'org:classes:read',
    'org:classes:manage',
    'org:grades:read',
    'org:grades:manage',
    'org:attendance:read',
    'org:attendance:manage',
  ],
  assessments: [
    'org:assessments:read',
    'org:assessments:create',
    'org:assessments:grade',
  ],
  finance: [
    'org:fees:read',
    'org:fees:manage',
    'org:payments:manage',
    'org:financial_reports:read',
  ],
  support: [
    'org:counselor_notes:read',
    'org:counselor_notes:manage',
    'org:behavioral:read',
    'org:behavioral:manage',
  ],
  reports: [
    'org:academic_reports:read',
    'org:report_cards:generate',
    'org:analytics:read',
  ],
  people: [
    'org:students:read',
    'org:students:manage',
    'org:teachers:read',
    'org:teachers:manage',
    'org:parents:read',
    'org:parents:manage',
  ],
} as const;

/**
 * Human-readable names for permissions
 */
export const PERMISSION_DISPLAY_NAMES: Partial<Record<Permission, string>> = {
  'org:classes_read': 'View Classes',
  'org:classes_manage': 'Manage Classes',
  'org:grades_read': 'View Grades',
  'org:grades_manage': 'Manage Grades',
  'org:attendance_read': 'View Attendance',
  'org:attendance_manage': 'Manage Attendance',
  'org:assessments_read': 'View Assessments',
  'org:assessments_create': 'Create Assessments',
  'org:assessments_grade': 'Grade Assessments',
  'org:fees_read': 'View Fees',
  'org:fees_manage': 'Manage Fees',
  'org:payments_manage': 'Process Payments',
  'org:financial_reports_read': 'View Financial Reports',
  'org:counselor_notes_read': 'View Counselor Notes',
  'org:counselor_notes_manage': 'Manage Counselor Notes',
  'org:behavioral_read': 'View Behavioral Records',
  'org:behavioral_manage': 'Manage Behavioral Records',
  'org:academic_reports_read': 'View Academic Reports',
  'org:report_cards_generate': 'Generate Report Cards',
  'org:analytics_read': 'View Analytics',
  'org:students_read': 'View Students',
  'org:students_manage': 'Manage Students',
  'org:teachers_read': 'View Teachers',
  'org:teachers_manage': 'Manage Teachers',
  'org:parents_read': 'View Parents',
  'org:parents_manage': 'Manage Parents',
};

// ============================================
// Type Guards
// ============================================

/**
 * Check if a string is a valid SIS role
 */
export function isValidRole(role: string): role is SISRole {
  return [
    'org:admin',
    'org:teacher',
    'org:student',
    'org:parent',
    'org:counselor',
    'org:accountant',
    'org:member',
  ].includes(role);
}

/**
 * Check if a string is a valid permission
 */
export function isValidPermission(permission: string): permission is Permission {
  // Check if it matches the pattern org:<feature>:<action>
  const pattern = /^org:[a-z_]+:[a-z_]+$/;
  return pattern.test(permission);
}
