import { UserRole, RolePermissions } from '@/types/user';

export const USER_ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
  COUNSELOR: 'counselor',
  ACCOUNTANT: 'accountant',
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: 'Super Admin',
  admin: 'School Admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
  counselor: 'Counselor',
  accountant: 'Accountant',
};

export const ROLE_PERMISSIONS: RolePermissions = {
  superadmin: [
    { resource: '*', actions: ['*'] }, // Full access to everything
  ],
  admin: [
    { resource: 'students', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'teachers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'classes', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'assessments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'attendance', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'alerts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'parents', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'fees', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'documents', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'update'] }, // Limited user management
  ],
  teacher: [
    { resource: 'students', actions: ['read'] },
    { resource: 'classes', actions: ['read'] },
    { resource: 'assessments', actions: ['create', 'read', 'update'] },
    { resource: 'attendance', actions: ['create', 'read', 'update'] },
    { resource: 'grades', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'messages', actions: ['create', 'read'] },
  ],
  parent: [
    { resource: 'children', actions: ['read'] },
    { resource: 'grades', actions: ['read'] },
    { resource: 'attendance', actions: ['read'] },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'reports', actions: ['read'] },
  ],
  student: [
    { resource: 'profile', actions: ['read', 'update'] },
    { resource: 'courses', actions: ['read'] },
    { resource: 'grades', actions: ['read'] },
    { resource: 'attendance', actions: ['read'] },
    { resource: 'assignments', actions: ['read', 'update'] },
    { resource: 'messages', actions: ['create', 'read'] },
  ],
  counselor: [
    { resource: 'students', actions: ['read'] },
    { resource: 'counseling', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'interventions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['read'] },
  ],
  accountant: [
    { resource: 'fees', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'payments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'invoices', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'financial_reports', actions: ['create', 'read', 'update'] },
  ],
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superadmin: 100,
  admin: 80,
  counselor: 70,
  accountant: 70,
  teacher: 60,
  parent: 40,
  student: 20,
};