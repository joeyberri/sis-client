export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'teacher'
  | 'parent'
  | 'student'
  | 'counselor'
  | 'accountant';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  tenantId?: string; // School ID for multi-tenant setup
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  // Role-specific metadata
  metadata?: {
    // Admin specific
    schoolName?: string;
    // Teacher specific
    subjects?: string[];
    // Parent specific
    childrenIds?: string[];
    // Student specific
    studentId?: string;
    classId?: string;
    grade?: string;
  };
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  [key: string]: Permission[];
}