/**
 * Client-side authentication utilities for Clerk Organizations
 * Use these hooks in Client Components
 */

'use client';

import { useAuth, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useMemo, useCallback } from 'react';
import { ROLE_PERMISSIONS } from './types';

// ============================================
// Primary Auth Hook
// ============================================

/**
 * Hook to get current user's organization role and permissions
 * with convenient helper functions
 */
export function useOrgAuth() {
  const { userId, orgId, orgRole, orgPermissions, has, isLoaded, isSignedIn } = useAuth();
  const { organization, membership, isLoaded: orgLoaded } = useOrganization();
  
  // Type-safe role
  const role = orgRole as SISRole | null;
  
  // Type-safe permissions array
  const permissions = useMemo(() => 
    (orgPermissions || []) as Permission[], 
    [orgPermissions]
  );
  
  // Permission check helper
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!orgId) return false;
    return has?.({ permission }) ?? false;
  }, [orgId, has]);
  
  // Role check helper
  const hasRole = useCallback((checkRole: SISRole): boolean => {
    if (!orgId || !role) return false;
    return role === checkRole || role === 'org:admin';
  }, [orgId, role]);
  
  // Check any of the specified roles
  const hasAnyRole = useCallback((roles: SISRole[]): boolean => {
    if (!orgId || !role) return false;
    if (role === 'org:admin') return true;
    return roles.includes(role);
  }, [orgId, role]);
  
  // Check all specified permissions
  const hasAllPermissions = useCallback((perms: Permission[]): boolean => {
    if (!orgId) return false;
    return perms.every(p => has?.({ permission: p }) ?? false);
  }, [orgId, has]);
  
  // Check any of the specified permissions
  const hasAnyPermission = useCallback((perms: Permission[]): boolean => {
    if (!orgId) return false;
    return perms.some(p => has?.({ permission: p }) ?? false);
  }, [orgId, has]);
  
  // Get user's display name
  const displayName = useMemo(() => {
    if (!membership) return null;
    const first = membership.publicUserData?.firstName || '';
    const last = membership.publicUserData?.lastName || '';
    return `${first} ${last}`.trim() || membership.publicUserData?.identifier || 'User';
  }, [membership]);
  
  return {
    // Auth state
    userId,
    orgId,
    orgRole: role,
    orgSlug: organization?.slug || null,
    orgPermissions: permissions,
    isLoaded: isLoaded && orgLoaded,
    isSignedIn: isSignedIn ?? false,
    isInOrganization: !!orgId,
    
    // Organization data
    organization,
    membership,
    displayName,
    
    // Permission helpers
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
    hasAnyPermission,
    
    // Convenience checks
    isAdmin: role === 'org:admin',
    isTeacher: role === 'org:teacher' || role === 'org:admin',
    isStudent: role === 'org:student',
    isParent: role === 'org:parent',
    isCounselor: role === 'org:counselor',
    isAccountant: role === 'org:accountant',
  };
}

// ============================================
// Organization List Hook
// ============================================

/**
 * Hook to get all organizations the user belongs to
 */
export function useUserOrganizations() {
  const { userMemberships, isLoaded, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  
  const organizations = useMemo(() => {
    if (!userMemberships.data) return [];
    return userMemberships.data.map(m => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      imageUrl: m.organization.imageUrl,
      role: m.role as SISRole,
      createdAt: m.createdAt,
      publicMetadata: m.organization.publicMetadata as SchoolPublicMetadata,
    }));
  }, [userMemberships.data]);
  
  const switchOrganization = useCallback(async (orgId: string) => {
    await setActive?.({ organization: orgId });
  }, [setActive]);
  
  return {
    organizations,
    isLoaded,
    hasMultipleOrgs: organizations.length > 1,
    switchOrganization,
  };
}

// ============================================
// Permission-Based Visibility Hooks
// ============================================

/**
 * Hook for components that should only show for specific permissions
 */
export function useCanAccess(permission: Permission): boolean {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  if (!isLoaded || !isInOrganization) return false;
  return hasPermission(permission);
}

/**
 * Hook for components that should only show for specific roles
 */
export function useCanAccessRole(role: SISRole): boolean {
  const { hasRole, isLoaded, isInOrganization } = useOrgAuth();
  
  if (!isLoaded || !isInOrganization) return false;
  return hasRole(role);
}

// ============================================
// Feature-Specific Hooks
// ============================================

/**
 * Hook for grade-related permissions
 */
export function useGradePermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canRead: isInOrganization && hasPermission('org:grades:read'),
    canManage: isInOrganization && hasPermission('org:grades:manage'),
  };
}

/**
 * Hook for attendance-related permissions
 */
export function useAttendancePermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canRead: isInOrganization && hasPermission('org:attendance:read'),
    canManage: isInOrganization && hasPermission('org:attendance:manage'),
  };
}

/**
 * Hook for class-related permissions
 */
export function useClassPermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canRead: isInOrganization && hasPermission('org:classes:read'),
    canManage: isInOrganization && hasPermission('org:classes:manage'),
  };
}

/**
 * Hook for assessment-related permissions
 */
export function useAssessmentPermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canRead: isInOrganization && hasPermission('org:assessments:read'),
    canCreate: isInOrganization && hasPermission('org:assessments:create'),
    canGrade: isInOrganization && hasPermission('org:assessments:grade'),
  };
}

/**
 * Hook for financial permissions
 */
export function useFinancePermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canReadFees: isInOrganization && hasPermission('org:fees:read'),
    canManageFees: isInOrganization && hasPermission('org:fees:manage'),
    canManagePayments: isInOrganization && hasPermission('org:payments:manage'),
    canReadReports: isInOrganization && hasPermission('org:financial_reports:read'),
  };
}

/**
 * Hook for counselor permissions
 */
export function useCounselorPermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canReadNotes: isInOrganization && hasPermission('org:counselor_notes:read'),
    canManageNotes: isInOrganization && hasPermission('org:counselor_notes:manage'),
    canReadBehavioral: isInOrganization && hasPermission('org:behavioral:read'),
    canManageBehavioral: isInOrganization && hasPermission('org:behavioral:manage'),
  };
}

/**
 * Hook for report/analytics permissions
 */
export function useReportPermissions() {
  const { hasPermission, isLoaded, isInOrganization } = useOrgAuth();
  
  return {
    isLoaded,
    canViewAcademicReports: isInOrganization && hasPermission('org:academic_reports:read'),
    canGenerateReportCards: isInOrganization && hasPermission('org:report_cards:generate'),
    canViewAnalytics: isInOrganization && hasPermission('org:analytics:read'),
  };
}

// ============================================
// Role Permissions Reference
// ============================================

/**
 * Get all permissions for the current user's role
 */
export function useRolePermissions(): Permission[] {
  const { orgRole } = useOrgAuth();
  
  return useMemo(() => {
    if (!orgRole) return [];
    return ROLE_PERMISSIONS[orgRole] || [];
  }, [orgRole]);
}

/**
 * Get human-readable role name
 */
export function useRoleDisplayName(): string {
  const { orgRole } = useOrgAuth();
  
  const displayNames: Record<SISRole, string> = {
    'org:admin': 'Administrator',
    'org:teacher': 'Teacher',
    'org:student': 'Student',
    'org:parent': 'Parent / Guardian',
    'org:counselor': 'Counselor',
    'org:accountant': 'Accountant',
    'org:member': 'Member',
  };
  
  return orgRole ? displayNames[orgRole] : 'Guest';
}
