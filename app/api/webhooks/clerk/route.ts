import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import type { 
  UserJSON, 
  OrganizationJSON, 
  OrganizationMembershipJSON,
  OrganizationInvitationJSON,
} from '@clerk/nextjs/webhooks';

// ============================================
// Webhook Event Handler
// ============================================

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    
    const eventType = evt.type as ClerkWebhookEventType;
    const eventId = evt.data.id;
    
    console.log(`[Clerk Webhook] Received event: ${eventType} (ID: ${eventId})`);
    
    // Route to appropriate handler
    switch (eventType) {
      // ============ User Events ============
      case 'user.created':
        await handleUserCreated(evt.data as UserJSON);
        break;
        
      case 'user.updated':
        await handleUserUpdated(evt.data as UserJSON);
        break;
        
      case 'user.deleted':
        await handleUserDeleted(evt.data as { id: string; deleted: boolean });
        break;
        
      // ============ Organization Events ============
      case 'organization.created':
        await handleOrganizationCreated(evt.data as OrganizationJSON);
        break;
        
      case 'organization.updated':
        await handleOrganizationUpdated(evt.data as OrganizationJSON);
        break;
        
      case 'organization.deleted':
        await handleOrganizationDeleted(evt.data as { id: string; deleted: boolean });
        break;
        
      // ============ Membership Events ============
      case 'organizationMembership.created':
        await handleMembershipCreated(evt.data as OrganizationMembershipJSON);
        break;
        
      case 'organizationMembership.updated':
        await handleMembershipUpdated(evt.data as OrganizationMembershipJSON);
        break;
        
      case 'organizationMembership.deleted':
        await handleMembershipDeleted(evt.data as OrganizationMembershipJSON);
        break;
        
      // ============ Invitation Events ============
      case 'organizationInvitation.created':
        await handleInvitationCreated(evt.data as OrganizationInvitationJSON);
        break;
        
      case 'organizationInvitation.accepted':
        await handleInvitationAccepted(evt.data as OrganizationInvitationJSON);
        break;
        
      case 'organizationInvitation.revoked':
        await handleInvitationRevoked(evt.data as OrganizationInvitationJSON);
        break;
        
      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`);
    }
    
    return new Response(JSON.stringify({ success: true, eventType }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    console.error('[Clerk Webhook] Verification/Processing Error:', err);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ============================================
// User Event Handlers
// ============================================

async function handleUserCreated(user: UserJSON) {
  const userData = {
    clerkUserId: user.id,
    email: user.email_addresses[0]?.email_address || null,
    firstName: user.first_name,
    lastName: user.last_name,
    imageUrl: user.image_url,
    username: user.username,
    createdAt: new Date(user.created_at),
  };
  
  console.log('[Clerk Webhook] Processing user.created:', {
    userId: userData.clerkUserId,
    email: userData.email,
  });
  
  // TODO: Implement database sync
  // Example with Prisma:
  // await prisma.user.create({
  //   data: {
  //     clerkId: userData.clerkUserId,
  //     email: userData.email!,
  //     firstName: userData.firstName || '',
  //     lastName: userData.lastName || '',
  //     avatarUrl: userData.imageUrl,
  //   },
  // });
  
  // For now, call our backend API
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    await fetch(`${backendUrl}/api/webhooks/clerk/user-created`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.INTERNAL_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('[Clerk Webhook] Failed to sync user to backend:', error);
  }
}

async function handleUserUpdated(user: UserJSON) {
  const userData = {
    clerkUserId: user.id,
    email: user.email_addresses[0]?.email_address || null,
    firstName: user.first_name,
    lastName: user.last_name,
    imageUrl: user.image_url,
    username: user.username,
    updatedAt: new Date(user.updated_at),
  };
  
  console.log('[Clerk Webhook] Processing user.updated:', {
    userId: userData.clerkUserId,
  });
  
  // TODO: Implement database sync
  // await prisma.user.update({
  //   where: { clerkId: userData.clerkUserId },
  //   data: { ... },
  // });
}

async function handleUserDeleted(data: { id: string; deleted: boolean }) {
  console.log('[Clerk Webhook] Processing user.deleted:', {
    userId: data.id,
  });
  
  // TODO: Implement soft delete or cascade delete
  // await prisma.user.update({
  //   where: { clerkId: data.id },
  //   data: { deletedAt: new Date() },
  // });
}

// ============================================
// Organization Event Handlers
// ============================================

async function handleOrganizationCreated(org: OrganizationJSON) {
  const publicMetadata = org.public_metadata as SchoolPublicMetadata;
  
  const orgData = {
    clerkOrgId: org.id,
    name: org.name,
    slug: org.slug,
    imageUrl: org.image_url,
    createdAt: new Date(org.created_at),
    // From public metadata
    schoolType: publicMetadata?.schoolType,
    country: publicMetadata?.country,
    educationLevel: publicMetadata?.educationLevel,
    templateId: publicMetadata?.templateId,
    academicYear: publicMetadata?.academicYear,
  };
  
  console.log('[Clerk Webhook] Processing organization.created:', {
    orgId: orgData.clerkOrgId,
    name: orgData.name,
    slug: orgData.slug,
  });
  
  // TODO: Create school in database
  // await prisma.school.create({
  //   data: {
  //     clerkOrgId: orgData.clerkOrgId,
  //     name: orgData.name,
  //     slug: orgData.slug,
  //     ...
  //   },
  // });
  
  // Sync to backend
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    await fetch(`${backendUrl}/api/webhooks/clerk/organization-created`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.INTERNAL_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify(orgData),
    });
  } catch (error) {
    console.error('[Clerk Webhook] Failed to sync organization to backend:', error);
  }
}

async function handleOrganizationUpdated(org: OrganizationJSON) {
  const publicMetadata = org.public_metadata as SchoolPublicMetadata;
  
  const orgData = {
    clerkOrgId: org.id,
    name: org.name,
    slug: org.slug,
    imageUrl: org.image_url,
    updatedAt: new Date(org.updated_at),
    // From public metadata
    schoolType: publicMetadata?.schoolType,
    country: publicMetadata?.country,
    academicYear: publicMetadata?.academicYear,
  };
  
  console.log('[Clerk Webhook] Processing organization.updated:', {
    orgId: orgData.clerkOrgId,
    name: orgData.name,
  });
  
  // TODO: Update school in database
}

async function handleOrganizationDeleted(data: { id: string; deleted: boolean }) {
  console.log('[Clerk Webhook] Processing organization.deleted:', {
    orgId: data.id,
  });
  
  // TODO: Soft delete or archive school
  // This is a serious operation - typically soft delete
}

// ============================================
// Membership Event Handlers
// ============================================

async function handleMembershipCreated(membership: OrganizationMembershipJSON) {
  const membershipMetadata = membership.public_metadata as MembershipPublicMetadata;
  
  const memberData = {
    id: membership.id,
    clerkUserId: membership.public_user_data.user_id,
    clerkOrgId: membership.organization.id,
    role: membership.role as SISRole, // e.g., "org:admin", "org:teacher"
    createdAt: new Date(membership.created_at),
    // User info
    userEmail: membership.public_user_data.identifier,
    userFirstName: membership.public_user_data.first_name,
    userLastName: membership.public_user_data.last_name,
    userImageUrl: membership.public_user_data.image_url,
    // Membership metadata
    department: membershipMetadata?.department,
    employeeId: membershipMetadata?.employeeId,
    studentId: membershipMetadata?.studentId,
    classId: membershipMetadata?.classId,
  };
  
  console.log('[Clerk Webhook] Processing organizationMembership.created:', {
    membershipId: memberData.id,
    userId: memberData.clerkUserId,
    orgId: memberData.clerkOrgId,
    role: memberData.role,
  });
  
  // Create role-specific records based on the role
  await createRoleSpecificRecord(memberData);
}

async function handleMembershipUpdated(membership: OrganizationMembershipJSON) {
  const memberData = {
    id: membership.id,
    clerkUserId: membership.public_user_data.user_id,
    clerkOrgId: membership.organization.id,
    role: membership.role as SISRole,
    updatedAt: new Date(membership.updated_at),
  };
  
  console.log('[Clerk Webhook] Processing organizationMembership.updated:', {
    membershipId: memberData.id,
    newRole: memberData.role,
  });
  
  // Role changed - may need to update/create role-specific records
  // TODO: Handle role transitions (e.g., member promoted to admin)
}

async function handleMembershipDeleted(membership: OrganizationMembershipJSON) {
  console.log('[Clerk Webhook] Processing organizationMembership.deleted:', {
    membershipId: membership.id,
    userId: membership.public_user_data.user_id,
    orgId: membership.organization.id,
  });
  
  // TODO: Soft delete related records (teacher, student, etc.)
  // Don't cascade delete grades/attendance - just mark as inactive
}

// ============================================
// Invitation Event Handlers
// ============================================

async function handleInvitationCreated(invitation: OrganizationInvitationJSON) {
  console.log('[Clerk Webhook] Processing organizationInvitation.created:', {
    invitationId: invitation.id,
    email: invitation.email_address,
    orgId: invitation.organization_id,
    role: invitation.role,
  });
  
  // Optionally track pending invitations
  // Could send custom welcome email, track invitation source, etc.
}

async function handleInvitationAccepted(invitation: OrganizationInvitationJSON) {
  console.log('[Clerk Webhook] Processing organizationInvitation.accepted:', {
    invitationId: invitation.id,
    email: invitation.email_address,
    orgId: invitation.organization_id,
  });
  
  // Invitation accepted - membership.created will also fire
  // Could trigger welcome onboarding, send notification to admin, etc.
}

async function handleInvitationRevoked(invitation: OrganizationInvitationJSON) {
  console.log('[Clerk Webhook] Processing organizationInvitation.revoked:', {
    invitationId: invitation.id,
    email: invitation.email_address,
  });
  
  // Clean up any pending invitation records
}

// ============================================
// Helper Functions
// ============================================

interface MemberDataForRole {
  id: string;
  clerkUserId: string;
  clerkOrgId: string;
  role: SISRole;
  createdAt: Date;
  userEmail?: string;
  userFirstName?: string | null;
  userLastName?: string | null;
  userImageUrl?: string;
  department?: string;
  employeeId?: string;
  studentId?: string;
  classId?: string;
}

/**
 * Create role-specific database records when a user joins an organization
 */
async function createRoleSpecificRecord(memberData: MemberDataForRole) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const headers = { 
    'Content-Type': 'application/json',
    'X-Webhook-Secret': process.env.INTERNAL_WEBHOOK_SECRET || '',
  };
  
  try {
    switch (memberData.role) {
      case 'org:teacher':
        // Create Teacher record
        await fetch(`${backendUrl}/api/webhooks/clerk/teacher-created`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            clerkUserId: memberData.clerkUserId,
            clerkOrgId: memberData.clerkOrgId,
            email: memberData.userEmail,
            firstName: memberData.userFirstName,
            lastName: memberData.userLastName,
            department: memberData.department,
            employeeId: memberData.employeeId,
          }),
        });
        break;
        
      case 'org:student':
        // Create Student record
        await fetch(`${backendUrl}/api/webhooks/clerk/student-created`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            clerkUserId: memberData.clerkUserId,
            clerkOrgId: memberData.clerkOrgId,
            email: memberData.userEmail,
            firstName: memberData.userFirstName,
            lastName: memberData.userLastName,
            studentId: memberData.studentId,
            classId: memberData.classId,
          }),
        });
        break;
        
      case 'org:parent':
        // Create Parent/Guardian record
        await fetch(`${backendUrl}/api/webhooks/clerk/parent-created`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            clerkUserId: memberData.clerkUserId,
            clerkOrgId: memberData.clerkOrgId,
            email: memberData.userEmail,
            firstName: memberData.userFirstName,
            lastName: memberData.userLastName,
          }),
        });
        break;
        
      case 'org:counselor':
        // Create Counselor record
        await fetch(`${backendUrl}/api/webhooks/clerk/counselor-created`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            clerkUserId: memberData.clerkUserId,
            clerkOrgId: memberData.clerkOrgId,
            email: memberData.userEmail,
            firstName: memberData.userFirstName,
            lastName: memberData.userLastName,
          }),
        });
        break;
        
      case 'org:accountant':
        // Create Accountant record
        await fetch(`${backendUrl}/api/webhooks/clerk/accountant-created`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            clerkUserId: memberData.clerkUserId,
            clerkOrgId: memberData.clerkOrgId,
            email: memberData.userEmail,
            firstName: memberData.userFirstName,
            lastName: memberData.userLastName,
          }),
        });
        break;
        
      case 'org:admin':
        // Admin doesn't need separate record, just the membership
        console.log('[Clerk Webhook] Admin role - no additional record needed');
        break;
        
      default:
        console.log(`[Clerk Webhook] Unhandled role: ${memberData.role}`);
    }
  } catch (error) {
    console.error(`[Clerk Webhook] Failed to create role-specific record for ${memberData.role}:`, error);
    // Don't throw - webhook should still return 200 to prevent retries
  }
}
