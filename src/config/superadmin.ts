import { PackagePricing } from '@/types/superadmin';

export const PACKAGE_PRICING: Record<string, PackagePricing> = {
  trial: {
    tier: 'trial',
    name: 'Free Trial',
    description: 'Try all features free for 14 days',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Full platform access for 14 days',
      'Up to 50 students',
      'Email support',
      'Basic reporting'
    ],
    maxStudents: 50,
    maxTeachers: 5,
    maxAdmins: 1,
    modules: [
      'students',
      'teachers',
      'classes',
      'attendance',
      'grades',
      'announcements'
    ],
    supportLevel: 'email',
    customBranding: false,
    apiAccess: false,
    dataExport: false,
    advancedAnalytics: false,
    whiteLabel: false
  },
  basic: {
    tier: 'basic',
    name: 'Basic',
    description: 'Essential features for small schools',
    monthlyPrice: 99,
    yearlyPrice: 990, // 2 months free
    features: [
      'Student & Teacher Management',
      'Class Organization',
      'Attendance Tracking',
      'Basic Grading',
      'Announcements',
      'Email Support (48hr response)',
      'Basic Reporting',
      '10GB Storage'
    ],
    maxStudents: 200,
    maxTeachers: 20,
    maxAdmins: 2,
    modules: [
      'students',
      'teachers',
      'classes',
      'attendance',
      'grades',
      'announcements'
    ],
    supportLevel: 'email',
    customBranding: false,
    apiAccess: false,
    dataExport: true,
    advancedAnalytics: false,
    whiteLabel: false
  },
  standard: {
    tier: 'standard',
    name: 'Standard',
    description: 'Complete solution for growing schools',
    monthlyPrice: 299,
    yearlyPrice: 2990, // 2 months free
    features: [
      'All Basic Features',
      'Parent Portal',
      'Assessment Management',
      'Fee Management',
      'Document Storage (50GB)',
      'Reports & Analytics',
      'Support Ticket System',
      'Event Calendar',
      'Priority Support (24hr response)',
      'Data Export',
      'Custom Report Builder'
    ],
    maxStudents: 500,
    maxTeachers: 50,
    maxAdmins: 5,
    modules: [
      'students',
      'teachers',
      'parents',
      'classes',
      'attendance',
      'grades',
      'assessments',
      'fees',
      'documents',
      'reports',
      'support',
      'announcements',
      'events'
    ],
    supportLevel: 'priority',
    customBranding: false,
    apiAccess: true,
    dataExport: true,
    advancedAnalytics: true,
    whiteLabel: false
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    description: 'Advanced features for large institutions',
    monthlyPrice: 799,
    yearlyPrice: 7990, // 2 months free
    features: [
      'All Standard Features',
      'Online Payment Processing',
      'Advanced Analytics & AI Insights',
      'Library Management',
      'Transportation Management',
      'Cafeteria Management',
      'Document Storage (500GB)',
      'Custom Branding',
      'API Access',
      'Dedicated Support (4hr response)',
      'Custom Integrations',
      'Advanced Security Features',
      'Multi-Campus Support'
    ],
    maxStudents: 2000,
    maxTeachers: 200,
    maxAdmins: 15,
    modules: [
      'students',
      'teachers',
      'parents',
      'classes',
      'attendance',
      'grades',
      'assessments',
      'fees',
      'payments',
      'documents',
      'reports',
      'analytics',
      'support',
      'announcements',
      'events',
      'library',
      'transportation',
      'cafeteria'
    ],
    supportLevel: 'dedicated',
    customBranding: true,
    apiAccess: true,
    dataExport: true,
    advancedAnalytics: true,
    whiteLabel: false
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    monthlyPrice: 0, // Custom pricing
    yearlyPrice: 0, // Custom pricing
    features: [
      'All Premium Features',
      'Unlimited Users',
      'Unlimited Storage',
      'White-Label Solution',
      'Custom Module Development',
      'Dedicated Account Manager',
      'On-Premise Deployment Option',
      'SLA Guarantee (99.9% uptime)',
      'Custom Integrations',
      '24/7 Priority Support',
      'Security Audit & Compliance',
      'Custom Training & Onboarding',
      'Quarterly Business Reviews'
    ],
    maxStudents: -1, // Unlimited
    maxTeachers: -1, // Unlimited
    maxAdmins: -1, // Unlimited
    modules: [
      'students',
      'teachers',
      'parents',
      'classes',
      'attendance',
      'grades',
      'assessments',
      'fees',
      'payments',
      'documents',
      'reports',
      'analytics',
      'support',
      'announcements',
      'events',
      'library',
      'transportation',
      'cafeteria'
    ],
    supportLevel: '24/7',
    customBranding: true,
    apiAccess: true,
    dataExport: true,
    advancedAnalytics: true,
    whiteLabel: true
  }
};

export const TICKET_CATEGORIES = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'account', label: 'Account Management' },
  { value: 'general', label: 'General Inquiry' }
];

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export const TICKET_STATUSES = [
  { value: 'open', label: 'Open', color: 'bg-yellow-100 text-yellow-800' },
  {
    value: 'in_progress',
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'waiting_on_customer',
    label: 'Waiting on Customer',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    value: 'resolved',
    label: 'Resolved',
    color: 'bg-green-100 text-green-800'
  },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
];

export const SUBSCRIPTION_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'trial', label: 'Trial', color: 'bg-blue-100 text-blue-800' },
  { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' },
  {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    value: 'suspended',
    label: 'Suspended',
    color: 'bg-orange-100 text-orange-800'
  }
];
