/**
 * Server-side authentication utilities for Clerk Organizations
 * Use these functions in Server Components, Server Actions, and Route Handlers
 */

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ROLE_PERMISSIONS } from './types';

// ============================================
// Core Auth Functions
// ============================================

/**
 * Get current auth state with properly typed fields
 */
export async function getAuth(): Promise<{
  userId: string | null;
  orgId: string | null;
  orgRole: SISRole | null;
  orgSlug: string | null;
  orgPermissions: Permission[];
  has: (params: { permission?: string; role?: string }) => boolean;
  protect: (params?: { permission?: string; role?: string }) => Promise<void>;
}> {
  const authObj = await auth();
  
  return {
    userId: authObj.userId,
    orgId: authObj.orgId,
    orgRole: authObj.orgRole as SISRole | null,
    orgSlug: authObj.orgSlug,
    orgPermissions: (authObj.orgPermissions || []) as Permission[],
    has: authObj.has,
    protect: authObj.protect,
  };
}

/**
 * Require authentication and optionally organization context
 * Redirects if requirements are not met
 */
export async function requireAuth(options?: { 
  requireOrg?: boolean;
  permission?: Permission;
  role?: SISRole;
  redirectTo?: string;
}): Promise<{ 
  userId: string; 
  orgId: string | null; 
  orgRole: SISRole | null;
}> {
  const { userId, orgId, orgRole, has } = await getAuth();
  
  // Must be logged in
  if (!userId) {
    redirect(options?.redirectTo || '/auth/sign-in');
  }
  
  // Must have organization context
  if (options?.requireOrg && !orgId) {
    redirect('/select-school');
  }
  
  // Must have specific permission
  if (options?.permission && !has({ permission: options.permission })) {
    redirect('/unauthorized');
  }
  
  // Must have specific role (admin can access all)
  if (options?.role && orgRole !== options.role && orgRole !== 'org:admin') {
    redirect('/unauthorized');
  }
  
  return { userId, orgId, orgRole };
}

/**
 * Require specific permission - throws error if not met
 * Use in Server Actions or API routes where redirect isn't appropriate
 */
export async function requirePermission(permission: Permission): Promise<void> {
  const { has, orgId } = await getAuth();
  
  if (!orgId) {
    throw new Error('No organization context. Please select a school.');
  }
  
  if (!has({ permission })) {
    throw new Error(`Missing permission: ${permission}`);
  }
}

/**
 * Require any of the specified roles - throws error if not met
 */
export async function requireAnyRole(roles: SISRole[]): Promise<SISRole> {
  const { orgRole, orgId } = await getAuth();
  
  if (!orgId) {
    throw new Error('No organization context. Please select a school.');
  }
  
  if (!orgRole) {
    throw new Error('No role assigned in this organization.');
  }
  
  // Admin can access everything
  if (orgRole === 'org:admin') {
    return orgRole;
  }
  
  if (!roles.includes(orgRole)) {
    throw new Error(`Access denied. Required roles: ${roles.join(', ')}`);
  }
  
  return orgRole;
}

// ============================================
// Permission Checking Functions
// ============================================

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const { has, orgId } = await getAuth();
  if (!orgId) return false;
  return has({ permission });
}

/**
 * Check if user has ALL of the specified permissions
 */
export async function hasAllPermissions(permissions: Permission[]): Promise<boolean> {
  const { has, orgId } = await getAuth();
  if (!orgId) return false;
  return permissions.every(p => has({ permission: p }));
}

/**
 * Check if user has ANY of the specified permissions
 */
export async function hasAnyPermission(permissions: Permission[]): Promise<boolean> {
  const { has, orgId } = await getAuth();
  if (!orgId) return false;
  return permissions.some(p => has({ permission: p }));
}

// ============================================
// Role Checking Functions
// ============================================

/**
 * Check if user has a specific role
 */
export async function hasRole(role: SISRole): Promise<boolean> {
  const { orgRole, orgId } = await getAuth();
  if (!orgId) return false;
  return orgRole === role || orgRole === 'org:admin';
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: SISRole[]): Promise<boolean> {
  const { orgRole, orgId } = await getAuth();
  if (!orgId) return false;
  if (orgRole === 'org:admin') return true;
  return roles.includes(orgRole as SISRole);
}

/**
 * Get all permissions for a given role
 */
export function getPermissionsForRole(role: SISRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// ============================================
// Dashboard Routing
// ============================================

/**
 * Get the appropriate dashboard route for a role
 */
export function getDashboardRouteForRole(role: SISRole | null): DashboardRoute {
  const routes: Record<SISRole, DashboardRoute> = {
    'org:admin': '/dashboard/admin',
    'org:teacher': '/dashboard/teacher',
    'org:student': '/dashboard/student',
    'org:parent': '/dashboard/parent',
    'org:counselor': '/dashboard/counselor',
    'org:accountant': '/dashboard/accountant',
    'org:member': '/dashboard/admin', // Fallback for default Clerk role
  };
  
  return role ? routes[role] : '/dashboard/admin';
}

/**
 * Redirect to appropriate dashboard based on user's role
 */
export async function redirectToDashboard(): Promise<never> {
  const { orgRole, orgId } = await getAuth();
  
  if (!orgId) {
    redirect('/select-school');
  }
  
  const dashboardRoute = getDashboardRouteForRole(orgRole);
  redirect(dashboardRoute);
}

// ============================================
// Resource Access Helpers
// ============================================

/**
 * Check if user can access grades (read or write)
 */
export async function canAccessGrades(): Promise<boolean> {
  return hasAnyPermission(['org:grades:read', 'org:grades:manage']);
}

/**
 * Check if user can manage grades (write access)
 */
export async function canManageGrades(): Promise<boolean> {
  return hasPermission('org:grades:manage');
}

/**
 * Check if user can access attendance
 */
export async function canAccessAttendance(): Promise<boolean> {
  return hasAnyPermission(['org:attendance:read', 'org:attendance:manage']);
}

/**
 * Check if user can manage attendance
 */
export async function canManageAttendance(): Promise<boolean> {
  return hasPermission('org:attendance:manage');
}

/**
 * Check if user can access financial data
 */
export async function canAccessFinances(): Promise<boolean> {
  return hasAnyPermission(['org:fees:read', 'org:fees:manage', 'org:financial_reports:read']);
}

/**
 * Check if user can manage fees and payments
 */
export async function canManageFinances(): Promise<boolean> {
  return hasAllPermissions(['org:fees:manage', 'org:payments:manage']);
}

/**
 * Check if user can access counselor features
 */
export async function canAccessCounseling(): Promise<boolean> {
  return hasAnyPermission(['org:counselor_notes:read', 'org:counselor_notes:manage']);
}

/**
 * Check if user can view analytics (admin only by default)
 */
export async function canViewAnalytics(): Promise<boolean> {
  return hasPermission('org:analytics:read');
}
