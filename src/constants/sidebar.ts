import { UserRole } from '@/types/user';

export interface SidebarItem {
  title: string;
  href?: string;
  icon?: string;
  children?: SidebarItem[];
  badge?: string;
  disabled?: boolean;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarConfig {
  mainNav: SidebarItem[];
  sidebarGroups: SidebarGroup[];
}

export const SIDEBAR_CONFIGS: Record<UserRole, SidebarConfig> = {
  superadmin: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'School Management',
        items: [
          {
            title: 'Tenants (Schools)',
            icon: 'Building2',
            children: [
              { title: 'All Schools', href: '/dashboard/tenants' },
              { title: 'Onboarding Queue', href: '/dashboard/tenants/onboarding' },
            ],
          },
          {
            title: 'Users',
            icon: 'Users',
            children: [
              { title: 'All Users', href: '/dashboard/users' },
              { title: 'Invite User', href: '/dashboard/users/invite' },
            ],
          },
        ],
      },
      {
        title: 'System',
        items: [
          { title: 'Billing & Plans', href: '/dashboard/billing', icon: 'CreditCard' },
          { title: 'Global Settings', href: '/dashboard/settings', icon: 'Settings' },
          { title: 'Audit Logs', href: '/dashboard/audit', icon: 'FileText' },
          { title: 'Health & Monitoring', href: '/dashboard/health', icon: 'Activity' },
          { title: 'Support & Tickets', href: '/dashboard/support', icon: 'HelpCircle' },
          { title: 'Integrations', href: '/dashboard/integrations', icon: 'Plug' },
          { title: 'Release Notes', href: '/dashboard/releases', icon: 'Bell' },
        ],
      },
    ],
  },

  admin: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        ],
      },
      {
        title: 'Academic Management',
        items: [
          {
            title: 'Students',
            icon: 'UserCheck',
            children: [
              { title: 'All Students', href: '/dashboard/students' },
              { title: 'Enroll Student', href: '/dashboard/students/enroll' },
              { title: 'Promotions', href: '/dashboard/students/promotions' },
            ],
          },
          {
            title: 'Teachers',
            icon: 'GraduationCap',
            children: [
              { title: 'All Teachers', href: '/dashboard/teachers' },
            ],
          },
          {
            title: 'Classes',
            icon: 'BookOpen',
            children: [
              { title: 'All Classes', href: '/dashboard/classes' },
            ],
          },
        ],
      },
      {
        title: 'Assessment & Grading',
        items: [
          {
            title: 'Assessments',
            icon: 'FileText',
            children: [
              { title: 'All Assessments', href: '/dashboard/assessments' },
              { title: 'Create Assessment', href: '/dashboard/assessments/create' },
              { title: 'Grade Configs', href: '/dashboard/assessments/configs' },
            ],
          },
          { title: 'Gradebook', href: '/dashboard/classes/gradebook', icon: 'BarChart2' },
          { title: 'Attendance', href: '/dashboard/attendance', icon: 'Calendar' },
        ],
      },
      {
        title: 'Reports & Analytics',
        items: [
          {
            title: 'Reports',
            icon: 'BarChart3',
            children: [
              { title: 'Overview', href: '/dashboard/reports' },
              { title: 'Report Cards', href: '/dashboard/reports/cards' },
              { title: 'Scheduled Reports', href: '/dashboard/reports/scheduled' },
            ],
          },
          { title: 'Analytics', href: '/dashboard/analytics', icon: 'TrendingUp' },
        ],
      },
      {
        title: 'Operations',
        items: [
          { title: 'Documents', href: '/dashboard/documents', icon: 'File' },
          { title: 'Payments', href: '/dashboard/payments', icon: 'CreditCard' },
          { title: 'Saved Views', href: '/dashboard/views', icon: 'Bookmark' },
        ],
      },
      {
        title: 'Settings',
        items: [
          {
            title: 'School Settings',
            icon: 'Settings',
            children: [
              { title: 'Users & Permissions', href: '/dashboard/settings/users' },
              { title: 'Integrations', href: '/dashboard/settings/integrations' },
            ],
          },
          { title: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        ],
      },
    ],
  },

  teacher: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        ],
      },
      {
        title: 'Teaching',
        items: [
          { title: 'Student Profiles', href: '/dashboard/students', icon: 'UserCheck' },
          { title: 'Assessments', href: '/dashboard/assessments', icon: 'FileText' },
          { title: 'Gradebook', href: '/dashboard/classes/gradebook', icon: 'BarChart2' },
          { title: 'Attendance', href: '/dashboard/attendance', icon: 'Calendar' },
        ],
      },
      {
        title: 'Tools',
        items: [
          { title: 'Analytics', href: '/dashboard/analytics', icon: 'TrendingUp' },
          { title: 'Saved Views', href: '/dashboard/views', icon: 'Bookmark' },
          { title: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        ],
      },
    ],
  },

  parent: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        ],
      },
      {
        title: 'Family',
        items: [
          { title: 'My Children', href: '/dashboard/students', icon: 'Users' },
          { title: 'Payments', href: '/dashboard/payments', icon: 'CreditCard' },
        ],
      },
      {
        title: 'Account',
        items: [
          { title: 'Profile', href: '/dashboard/profile', icon: 'User' },
          { title: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        ],
      },
    ],
  },

  student: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        ],
      },
      {
        title: 'Academic',
        items: [
          { title: 'My Courses', href: '/dashboard/analytics', icon: 'BookOpen' },
          { title: 'Attendance', href: '/dashboard/attendance', icon: 'Calendar' },
        ],
      },
      {
        title: 'Account',
        items: [
          { title: 'Profile', href: '/dashboard/profile', icon: 'User' },
          { title: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        ],
      },
    ],
  },

  counselor: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        ],
      },
      {
        title: 'Student Support',
        items: [
          { title: 'Student Profiles', href: '/dashboard/students', icon: 'UserCheck' },
          { title: 'Reports', href: '/dashboard/reports', icon: 'BarChart3' },
        ],
      },
      {
        title: 'Tools',
        items: [
          { title: 'Saved Views', href: '/dashboard/views', icon: 'Bookmark' },
          { title: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        ],
      },
    ],
  },

  accountant: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        ],
      },
      {
        title: 'Finance',
        items: [
          { title: 'Invoices', href: '/dashboard/invoices', icon: 'FileText' },
          { title: 'Payments', href: '/dashboard/payments', icon: 'CreditCard' },
          { title: 'Reports', href: '/dashboard/reports', icon: 'BarChart3' },
        ],
      },
      {
        title: 'Support',
        items: [
          { title: 'Support', href: '/dashboard/support', icon: 'HelpCircle' },
        ],
      },
    ],
  },
};