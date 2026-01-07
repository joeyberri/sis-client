import type {
  School,
  SupportTicket,
  PlatformStats,
  AuditLog,
  SystemHealth,
  ClerkUserData,
  ClerkOrganization,
  TicketMessage
} from '@/types/superadmin';

// Base API URL - configure based on environment
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// School Management
// ============================================

export async function getSchools(params?: {
  status?: string;
  tier?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ schools: School[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.tier) searchParams.set('tier', params.tier);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  return apiRequest(`/superadmin/schools?${searchParams.toString()}`);
}

export async function getSchool(id: string): Promise<School> {
  return apiRequest(`/superadmin/schools/${id}`);
}

export async function createSchool(data: Partial<School>): Promise<School> {
  return apiRequest('/superadmin/schools', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateSchool(
  id: string,
  data: Partial<School>
): Promise<School> {
  return apiRequest(`/superadmin/schools/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function deleteSchool(id: string): Promise<void> {
  return apiRequest(`/superadmin/schools/${id}`, {
    method: 'DELETE'
  });
}

export async function suspendSchool(
  id: string,
  reason: string
): Promise<School> {
  return apiRequest(`/superadmin/schools/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
}

export async function activateSchool(id: string): Promise<School> {
  return apiRequest(`/superadmin/schools/${id}/activate`, {
    method: 'POST'
  });
}

// ============================================
// Subscription Management
// ============================================

export async function updateSubscription(
  schoolId: string,
  data: {
    tier: string;
    billingCycle?: 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
  }
): Promise<School> {
  return apiRequest(`/superadmin/schools/${schoolId}/subscription`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function extendTrial(
  schoolId: string,
  days: number
): Promise<School> {
  return apiRequest(`/superadmin/schools/${schoolId}/extend-trial`, {
    method: 'POST',
    body: JSON.stringify({ days })
  });
}

// ============================================
// Support Ticket Management
// ============================================

export async function getTickets(params?: {
  status?: string;
  priority?: string;
  category?: string;
  schoolId?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ tickets: SupportTicket[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.priority) searchParams.set('priority', params.priority);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.schoolId) searchParams.set('schoolId', params.schoolId);
  if (params?.assignedTo) searchParams.set('assignedTo', params.assignedTo);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  return apiRequest(`/superadmin/tickets?${searchParams.toString()}`);
}

export async function getTicket(id: string): Promise<SupportTicket> {
  return apiRequest(`/superadmin/tickets/${id}`);
}

export async function createTicket(
  data: Partial<SupportTicket>
): Promise<SupportTicket> {
  return apiRequest('/superadmin/tickets', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTicket(
  id: string,
  data: Partial<SupportTicket>
): Promise<SupportTicket> {
  return apiRequest(`/superadmin/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function addTicketMessage(
  ticketId: string,
  data: { content: string; attachments?: string[] }
): Promise<TicketMessage> {
  return apiRequest(`/superadmin/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function assignTicket(
  ticketId: string,
  assigneeId: string
): Promise<SupportTicket> {
  return apiRequest(`/superadmin/tickets/${ticketId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ assigneeId })
  });
}

export async function resolveTicket(
  ticketId: string,
  resolution: string
): Promise<SupportTicket> {
  return apiRequest(`/superadmin/tickets/${ticketId}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ resolution })
  });
}

export async function closeTicket(ticketId: string): Promise<SupportTicket> {
  return apiRequest(`/superadmin/tickets/${ticketId}/close`, {
    method: 'POST'
  });
}

export async function reopenTicket(ticketId: string): Promise<SupportTicket> {
  return apiRequest(`/superadmin/tickets/${ticketId}/reopen`, {
    method: 'POST'
  });
}

// ============================================
// Platform Statistics
// ============================================

export async function getPlatformStats(): Promise<PlatformStats> {
  return apiRequest('/superadmin/stats');
}

export async function getRevenueStats(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<{
  data: Array<{ date: string; revenue: number; count: number }>;
  total: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);
  if (params?.groupBy) searchParams.set('groupBy', params.groupBy);

  return apiRequest(`/superadmin/stats/revenue?${searchParams.toString()}`);
}

export async function getGrowthStats(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<{
  schools: { current: number; previous: number; growth: number };
  users: { current: number; previous: number; growth: number };
  students: { current: number; previous: number; growth: number };
}> {
  const searchParams = new URLSearchParams();
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);

  return apiRequest(`/superadmin/stats/growth?${searchParams.toString()}`);
}

// ============================================
// Audit Logs
// ============================================

export async function getAuditLogs(params?: {
  action?: string;
  userId?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{ logs: AuditLog[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.action) searchParams.set('action', params.action);
  if (params?.userId) searchParams.set('userId', params.userId);
  if (params?.resourceType)
    searchParams.set('resourceType', params.resourceType);
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  return apiRequest(`/superadmin/audit-logs?${searchParams.toString()}`);
}

// ============================================
// System Health
// ============================================

export async function getSystemHealth(): Promise<SystemHealth> {
  return apiRequest('/superadmin/health');
}

// ============================================
// Clerk Integration - Users
// ============================================

export async function getClerkUsers(params?: {
  limit?: number;
  offset?: number;
  orderBy?: string;
}): Promise<{ users: ClerkUserData[]; totalCount: number }> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());
  if (params?.orderBy) searchParams.set('orderBy', params.orderBy);

  return apiRequest(`/superadmin/clerk/users?${searchParams.toString()}`);
}

export async function getClerkUser(userId: string): Promise<ClerkUserData> {
  return apiRequest(`/superadmin/clerk/users/${userId}`);
}

export async function updateClerkUserMetadata(
  userId: string,
  metadata: {
    publicMetadata?: Record<string, unknown>;
    privateMetadata?: Record<string, unknown>;
  }
): Promise<ClerkUserData> {
  return apiRequest(`/superadmin/clerk/users/${userId}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify(metadata)
  });
}

export async function banClerkUser(userId: string): Promise<ClerkUserData> {
  return apiRequest(`/superadmin/clerk/users/${userId}/ban`, {
    method: 'POST'
  });
}

export async function unbanClerkUser(userId: string): Promise<ClerkUserData> {
  return apiRequest(`/superadmin/clerk/users/${userId}/unban`, {
    method: 'POST'
  });
}

export async function deleteClerkUser(userId: string): Promise<void> {
  return apiRequest(`/superadmin/clerk/users/${userId}`, {
    method: 'DELETE'
  });
}

// ============================================
// Clerk Integration - Organizations
// ============================================

export async function getClerkOrganizations(params?: {
  limit?: number;
  offset?: number;
  query?: string;
}): Promise<{ organizations: ClerkOrganization[]; totalCount: number }> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());
  if (params?.query) searchParams.set('query', params.query);

  return apiRequest(
    `/superadmin/clerk/organizations?${searchParams.toString()}`
  );
}

export async function getClerkOrganization(
  orgId: string
): Promise<ClerkOrganization> {
  return apiRequest(`/superadmin/clerk/organizations/${orgId}`);
}

export async function updateClerkOrganization(
  orgId: string,
  data: Partial<ClerkOrganization>
): Promise<ClerkOrganization> {
  return apiRequest(`/superadmin/clerk/organizations/${orgId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function getClerkOrganizationMembers(orgId: string): Promise<{
  members: Array<{
    id: string;
    userId: string;
    role: string;
    user: ClerkUserData;
  }>;
}> {
  return apiRequest(`/superadmin/clerk/organizations/${orgId}/members`);
}

// ============================================
// Clerk Integration - Sessions & Security
// ============================================

export async function getClerkActiveSessions(): Promise<{
  sessions: Array<{
    id: string;
    userId: string;
    clientId: string;
    status: string;
    lastActiveAt: string;
    expireAt: string;
  }>;
}> {
  return apiRequest('/superadmin/clerk/sessions');
}

export async function revokeUserSessions(userId: string): Promise<void> {
  return apiRequest(`/superadmin/clerk/users/${userId}/sessions`, {
    method: 'DELETE'
  });
}

// ============================================
// Bulk Operations
// ============================================

export async function bulkUpdateSchools(
  schoolIds: string[],
  data: Partial<School>
): Promise<{ updated: number; failed: string[] }> {
  return apiRequest('/superadmin/schools/bulk-update', {
    method: 'POST',
    body: JSON.stringify({ schoolIds, data })
  });
}

export async function bulkSendNotification(
  schoolIds: string[],
  notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
  }
): Promise<{ sent: number; failed: string[] }> {
  return apiRequest('/superadmin/notifications/bulk-send', {
    method: 'POST',
    body: JSON.stringify({ schoolIds, notification })
  });
}

// ============================================
// Export & Reports
// ============================================

export async function exportSchoolsReport(params?: {
  format?: 'csv' | 'xlsx' | 'pdf';
  status?: string;
  tier?: string;
}): Promise<Blob> {
  const searchParams = new URLSearchParams();
  if (params?.format) searchParams.set('format', params.format);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.tier) searchParams.set('tier', params.tier);

  const response = await fetch(
    `${API_BASE}/superadmin/reports/schools?${searchParams.toString()}`
  );
  if (!response.ok) throw new Error('Export failed');
  return response.blob();
}

export async function exportTicketsReport(params?: {
  format?: 'csv' | 'xlsx' | 'pdf';
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Blob> {
  const searchParams = new URLSearchParams();
  if (params?.format) searchParams.set('format', params.format);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);

  const response = await fetch(
    `${API_BASE}/superadmin/reports/tickets?${searchParams.toString()}`
  );
  if (!response.ok) throw new Error('Export failed');
  return response.blob();
}
