import { ModuleConfig, ModuleName, SchoolPackage } from '@/types/modules';

export const MODULES: Record<ModuleName, ModuleConfig> = {
  students: {
    name: 'students',
    displayName: 'Student Management',
    description: 'Manage student records, enrollment, and profiles',
    icon: 'Users',
    enabled: true,
    tier: ['basic', 'standard', 'premium', 'enterprise'],
    route: '/dashboard/students'
  },
  teachers: {
    name: 'teachers',
    displayName: 'Teacher Management',
    description: 'Manage teacher records, assignments, and profiles',
    icon: 'GraduationCap',
    enabled: true,
    tier: ['basic', 'standard', 'premium', 'enterprise'],
    route: '/dashboard/teachers'
  },
  parents: {
    name: 'parents',
    displayName: 'Parent Portal',
    description: 'Parent communication and engagement',
    icon: 'UserCircle',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise'],
    route: '/dashboard/parents'
  },
  classes: {
    name: 'classes',
    displayName: 'Class Management',
    description: 'Organize and manage classes and sections',
    icon: 'School',
    enabled: true,
    tier: ['basic', 'standard', 'premium', 'enterprise'],
    route: '/dashboard/classes'
  },
  attendance: {
    name: 'attendance',
    displayName: 'Attendance Tracking',
    description: 'Track and manage student attendance',
    icon: 'CheckCircle',
    enabled: true,
    tier: ['basic', 'standard', 'premium', 'enterprise'],
    route: '/dashboard/attendance',
    dependencies: ['students', 'classes']
  },
  grades: {
    name: 'grades',
    displayName: 'Grading System',
    description: 'Manage grades and academic performance',
    icon: 'Award',
    enabled: true,
    tier: ['basic', 'standard', 'premium', 'enterprise'],
    dependencies: ['students', 'classes']
  },
  assessments: {
    name: 'assessments',
    displayName: 'Assessments',
    description: 'Create and manage assessments and exams',
    icon: 'FileText',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise'],
    route: '/dashboard/assessments',
    dependencies: ['students', 'classes']
  },
  fees: {
    name: 'fees',
    displayName: 'Fee Management',
    description: 'Manage fee structures and billing',
    icon: 'DollarSign',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise'],
    route: '/dashboard/fees',
    dependencies: ['students']
  },
  payments: {
    name: 'payments',
    displayName: 'Payment Processing',
    description: 'Process and track payments',
    icon: 'CreditCard',
    enabled: true,
    tier: ['premium', 'enterprise'],
    route: '/dashboard/payments',
    dependencies: ['fees']
  },
  documents: {
    name: 'documents',
    displayName: 'Document Management',
    description: 'Store and manage school documents',
    icon: 'FolderOpen',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise'],
    route: '/dashboard/documents'
  },
  reports: {
    name: 'reports',
    displayName: 'Reports & Analytics',
    description: 'Generate comprehensive reports',
    icon: 'BarChart',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise'],
    route: '/dashboard/reports'
  },
  analytics: {
    name: 'analytics',
    displayName: 'Advanced Analytics',
    description: 'Advanced data analytics and insights',
    icon: 'TrendingUp',
    enabled: true,
    tier: ['premium', 'enterprise'],
    route: '/dashboard/analytics'
  },
  support: {
    name: 'support',
    displayName: 'Support Tickets',
    description: 'Support and help desk system',
    icon: 'Headphones',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise'],
    route: '/dashboard/support'
  },
  announcements: {
    name: 'announcements',
    displayName: 'Announcements',
    description: 'School-wide announcements and notifications',
    icon: 'Megaphone',
    enabled: true,
    tier: ['basic', 'standard', 'premium', 'enterprise']
  },
  events: {
    name: 'events',
    displayName: 'Event Management',
    description: 'Manage school events and calendar',
    icon: 'Calendar',
    enabled: true,
    tier: ['standard', 'premium', 'enterprise']
  },
  library: {
    name: 'library',
    displayName: 'Library Management',
    description: 'Manage library resources and lending',
    icon: 'BookOpen',
    enabled: true,
    tier: ['premium', 'enterprise']
  },
  transportation: {
    name: 'transportation',
    displayName: 'Transportation',
    description: 'Manage school transportation and routes',
    icon: 'Bus',
    enabled: true,
    tier: ['premium', 'enterprise']
  },
  cafeteria: {
    name: 'cafeteria',
    displayName: 'Cafeteria Management',
    description: 'Manage cafeteria and meal planning',
    icon: 'Utensils',
    enabled: true,
    tier: ['premium', 'enterprise']
  }
};

export const PACKAGES: Record<string, SchoolPackage> = {
  basic: {
    tier: 'basic',
    displayName: 'Basic Package',
    includedModules: [
      'students',
      'teachers',
      'classes',
      'attendance',
      'grades',
      'announcements'
    ],
    maxStudents: 200,
    maxTeachers: 20,
    maxAdmins: 2,
    features: [
      'Student & Teacher Management',
      'Class Organization',
      'Attendance Tracking',
      'Basic Grading',
      'Announcements',
      'Email Support'
    ],
    price: 99
  },
  standard: {
    tier: 'standard',
    displayName: 'Standard Package',
    includedModules: [
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
    maxStudents: 500,
    maxTeachers: 50,
    maxAdmins: 5,
    features: [
      'All Basic Features',
      'Parent Portal',
      'Assessment Management',
      'Fee Management',
      'Document Storage (50GB)',
      'Reports & Analytics',
      'Support Tickets',
      'Event Management',
      'Priority Support'
    ],
    price: 299
  },
  premium: {
    tier: 'premium',
    displayName: 'Premium Package',
    includedModules: [
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
    maxStudents: 2000,
    maxTeachers: 200,
    maxAdmins: 15,
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
      '24/7 Priority Support'
    ],
    price: 799
  },
  enterprise: {
    tier: 'enterprise',
    displayName: 'Enterprise Package',
    includedModules: [
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
    maxStudents: -1, // Unlimited
    maxTeachers: -1, // Unlimited
    maxAdmins: -1, // Unlimited
    features: [
      'All Premium Features',
      'Unlimited Users',
      'Unlimited Storage',
      'Multi-Campus Support',
      'Custom Module Development',
      'Dedicated Account Manager',
      'On-Premise Deployment Option',
      'SLA Guarantee',
      'Custom Integrations',
      'White-Label Solution'
    ],
    price: 0 // Custom pricing
  }
};
