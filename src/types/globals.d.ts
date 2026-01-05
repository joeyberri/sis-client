// TypeScript type declarations for Clerk Organizations
// This file extends Clerk's types with our custom SIS-specific roles and permissions

export {};

declare global {
  // ============================================
  // SIS Custom Features
  // ============================================
  
  /**
   * Features represent logical groupings of permissions in the SIS
   * These map to features created in Clerk Dashboard
   */
  type SISFeature = 
    | 'classes' 
    | 'grades' 
    | 'attendance' 
    | 'assessments' 
    | 'fees' 
    | 'payments'
    | 'counselor_notes'
    | 'behavioral'
    | 'academic_reports'
    | 'report_cards'
    | 'analytics'
    | 'financial_reports'
    | 'students'
    | 'teachers'
    | 'parents';

  /**
   * Actions that can be performed on features
   */
  type SISAction = 'read' | 'manage' | 'create' | 'update' | 'delete' | 'grade' | 'generate' | 'export';

  /**
   * Custom Permission format: org:<feature>_<action>
   * These are included in session claims and can be checked with has()
   */
  type SISPermission = `org:${SISFeature}_${SISAction}`;

  // ============================================
  // Clerk System Permissions
  // ============================================
  
  /**
   * Built-in Clerk system permissions
   * WARNING: These are NOT included in session claims
   * To check these server-side, check the Role instead
   */
  type ClerkSystemPermission =
    | 'org:sys_profile:manage'
    | 'org:sys_profile:delete'
    | 'org:sys_memberships:read'
    | 'org:sys_memberships:manage'
    | 'org:sys_domains:read'
    | 'org:sys_domains:manage'
    | 'org:sys_billing:read'
    | 'org:sys_billing:manage';

  /**
   * All permission types combined
   */
  type Permission = SISPermission | ClerkSystemPermission;

  // ============================================
  // Organization Roles
  // ============================================
  
  /**
   * SIS-specific organization roles
   * Format: org:<role_name>
   */
  type SISRole = 
    | 'org:admin' 
    | 'org:teacher' 
    | 'org:student' 
    | 'org:parent' 
    | 'org:counselor' 
    | 'org:accountant'
    | 'org:member'; // Default Clerk role

  // ============================================
  // Organization Metadata Types
  // ============================================
  
  /**
   * Public metadata stored on Organization
   * Accessible from frontend via organization.publicMetadata
   */
  interface SchoolPublicMetadata {
    schoolType?: 'primary' | 'secondary' | 'combined' | 'university' | 'vocational';
    country?: string;
    educationLevel?: string;
    templateId?: string;
    academicYear?: string;
    currentTerm?: string;
    studentCount?: number;
    teacherCount?: number;
    establishedYear?: number;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    motto?: string;
    timezone?: string;
    currency?: string;
    locale?: string;
  }

  /**
   * Private metadata stored on Organization
   * Only accessible from backend
   */
  interface SchoolPrivateMetadata {
    subscriptionTier?: 'free' | 'basic' | 'premium' | 'enterprise';
    subscriptionExpiry?: string;
    subscriptionId?: string;
    customDomain?: string;
    smsCredits?: number;
    emailQuota?: number;
    storageUsedMB?: number;
    storageQuotaMB?: number;
    internalNotes?: string;
    billingEmail?: string;
    billingAddress?: string;
  }

  /**
   * Public metadata stored on OrganizationMembership
   * Role-specific data for a user in an organization
   */
  interface MembershipPublicMetadata {
    // For teachers
    department?: string;
    subjects?: string[];
    classesAssigned?: string[];
    employeeId?: string;
    
    // For students
    studentId?: string;
    classId?: string;
    enrollmentDate?: string;
    guardianIds?: string[];
    
    // For parents
    childrenIds?: string[];
    relationship?: 'father' | 'mother' | 'guardian' | 'other';
    
    // Common
    joinedAt?: string;
    status?: 'active' | 'inactive' | 'suspended';
  }

  // ============================================
  // Auth Object Types
  // ============================================
  
  /**
   * Clerk authorization parameters for has() helper
   */
  interface ClerkAuthorization {
    permission?: Permission;
    role?: SISRole;
  }

  /**
   * Extended auth result with SIS types
   */
  interface SISAuthResult {
    userId: string | null;
    sessionId: string | null;
    orgId: string | null;
    orgRole: SISRole | null;
    orgSlug: string | null;
    orgPermissions: Permission[];
    isAuthenticated: boolean;
    isInOrganization: boolean;
  }

  // ============================================
  // Role-Permission Mapping
  // ============================================
  
  /**
   * Maps each role to its default permissions
   */
  type RolePermissions = Record<SISRole, Permission[]>;

  // ============================================
  // Dashboard Types
  // ============================================
  
  /**
   * Role-specific dashboard routes
   */
  type DashboardRoute = 
    | '/dashboard/admin'
    | '/dashboard/teacher'
    | '/dashboard/student'
    | '/dashboard/parent'
    | '/dashboard/counselor'
    | '/dashboard/accountant'
    | '/dashboard/superadmin';

  /**
   * Map roles to their dashboard routes
   */
  type RoleDashboardMap = Record<SISRole, DashboardRoute>;
}

// ============================================
// Clerk Types Augmentation
// ============================================

declare module '@clerk/types' {
  /**
   * Extend Clerk's CustomJwtSessionClaims with our SIS claims
   * These can be configured in Clerk Dashboard > Sessions > Customize session token
   */
  interface CustomJwtSessionClaims {
    // Organization shortcuts
    org_school_name?: string;
    org_school_type?: string;
    org_academic_year?: string;
    org_current_term?: string;
    org_timezone?: string;
    
    // User shortcuts  
    user_display_name?: string;
    user_avatar?: string;
    user_role?: SISRole;
    
    // Membership shortcuts
    membership_status?: 'active' | 'inactive' | 'suspended';
    membership_joined_at?: string;
  }
}

// ============================================
// Webhook Event Types
// ============================================

declare global {
  /**
   * Clerk webhook event types we handle
   */
  type ClerkWebhookEventType =
    | 'user.created'
    | 'user.updated'
    | 'user.deleted'
    | 'organization.created'
    | 'organization.updated'
    | 'organization.deleted'
    | 'organizationMembership.created'
    | 'organizationMembership.updated'
    | 'organizationMembership.deleted'
    | 'organizationInvitation.created'
    | 'organizationInvitation.accepted'
    | 'organizationInvitation.revoked';
}
