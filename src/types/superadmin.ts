// SuperAdmin Types for Platform Management

export interface SchoolSubscription {
  tier: PackageTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  billingCycle?: 'monthly' | 'yearly';
  price?: number;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending' | 'trial';
  subscription?: SchoolSubscription;
  adminEmail?: string;
  adminName?: string;
  studentCount?: number;
  teacherCount?: number;
  adminCount?: number;
  lastActiveAt?: string;
  clerkOrgId?: string;
  // Legacy fields (for backward compatibility)
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  packageTier?: PackageTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  maxStudents?: number;
  maxTeachers?: number;
  currentStudents?: number;
  currentTeachers?: number;
  enabledModules?: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export type PackageTier =
  | 'basic'
  | 'standard'
  | 'premium'
  | 'enterprise'
  | 'trial';

export type SubscriptionStatus =
  | 'active'
  | 'trial'
  | 'expired'
  | 'cancelled'
  | 'suspended';

export interface PackagePricing {
  tier: PackageTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxStudents: number;
  maxTeachers: number;
  maxAdmins: number;
  modules: string[];
  supportLevel: 'email' | 'priority' | 'dedicated' | '24/7';
  customBranding: boolean;
  apiAccess: boolean;
  dataExport: boolean;
  advancedAnalytics: boolean;
  whiteLabel: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber?: string;
  schoolId: string;
  schoolName: string;
  // Support both naming conventions
  userId?: string;
  userName?: string;
  userEmail?: string;
  createdBy?: string;
  createdByName?: string;
  createdByEmail?: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: TicketMessage[];
  tags?: string[];
}

export type TicketCategory =
  | 'technical'
  | 'billing'
  | 'feature_request'
  | 'bug_report'
  | 'account'
  | 'general';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_on_customer'
  | 'resolved'
  | 'closed';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId?: string;
  senderName?: string;
  senderRole?: 'customer' | 'support' | 'admin' | 'agent';
  userId?: string;
  userName?: string;
  userRole?: 'customer' | 'support' | 'admin' | 'agent';
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface PlatformStats {
  totalSchools: number;
  activeSchools: number;
  totalUsers: number;
  activeUsersToday: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  openTickets: number;
  resolvedTicketsThisMonth: number;
  avgResponseTime: number; // in hours
  systemUptime: number; // percentage
  storageUsed: number; // in GB
  apiRequestsToday: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  schoolId?: string;
  schoolName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  services: ServiceStatus[];
  lastChecked: string;
}

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  latency: number; // in ms
  lastChecked: string;
  message?: string;
}

export interface ClerkUserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: string;
  lastSignInAt?: string;
  publicMetadata: Record<string, any>;
  privateMetadata?: Record<string, any>;
  organizationMemberships?: ClerkOrgMembership[];
}

export interface ClerkOrgMembership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
}

export interface ClerkOrganization {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  publicMetadata: Record<string, any>;
  membersCount: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
