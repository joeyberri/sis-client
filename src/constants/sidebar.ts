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
      {
        title: 'Dashboard',
        href: '/dashboard/superadmin-overview',
        icon: 'solar:widget-2-duotone'
      }
    ],
    sidebarGroups: [
      {
        title: 'Platform Management',
        items: [
          {
            title: 'Overview',
            href: '/dashboard/superadmin-overview',
            icon: 'solar:widget-2-duotone'
          },
          {
            title: 'Schools',
            icon: 'solar:city-duotone',
            children: [
              {
                title: 'All Schools',
                href: '/dashboard/superadmin-overview/schools'
              },
              {
                title: 'Onboarding Queue',
                href: '/dashboard/tenants/onboarding'
              }
            ]
          },
          {
            title: 'Users',
            icon: 'solar:users-group-rounded-duotone',
            children: [
              { title: 'All Users', href: '/dashboard/users' },
              { title: 'Invite User', href: '/dashboard/users/invite' }
            ]
          }
        ]
      },
      {
        title: 'Support & Billing',
        items: [
          {
            title: 'Support Tickets',
            href: '/dashboard/superadmin-overview/tickets',
            icon: 'solar:headphones-round-duotone'
          },
          {
            title: 'Pricing & Plans',
            href: '/dashboard/superadmin-overview/pricing',
            icon: 'solar:card-transfer-duotone'
          }
        ]
      },
      {
        title: 'System',
        items: [
          {
            title: 'Global Settings',
            href: '/dashboard/settings',
            icon: 'solar:settings-minimalistic-duotone'
          },
          {
            title: 'Audit Logs',
            href: '/dashboard/audit',
            icon: 'solar:document-text-duotone'
          },
          {
            title: 'Health & Monitoring',
            href: '/dashboard/health',
            icon: 'solar:pulse-2-duotone'
          },
          {
            title: 'Integrations',
            href: '/dashboard/integrations',
            icon: 'solar:plug-circle-duotone'
          },
          {
            title: 'Release Notes',
            href: '/dashboard/releases',
            icon: 'solar:bell-bing-duotone'
          }
        ]
      }
    ]
  },

  admin: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'solar:widget-2-duotone' }
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-duotone'
          }
        ]
      },
      {
        title: 'Academic Management',
        items: [
          {
            title: 'Students',
            icon: 'solar:user-plus-duotone',
            children: [
              { title: 'All Students', href: '/dashboard/students' },
              { title: 'Enroll Student', href: '/dashboard/students/enroll' },
              { title: 'Promotions', href: '/dashboard/students/promotions' }
            ]
          },
          {
            title: 'Teachers',
            icon: 'solar:user-hand-up-duotone',
            children: [{ title: 'All Teachers', href: '/dashboard/teachers' }]
          },
          {
            title: 'Classes',
            icon: 'solar:clapperboard-edit-duotone',
            children: [{ title: 'All Classes', href: '/dashboard/classes' }]
          }
        ]
      },
      {
        title: 'Assessment & Grading',
        items: [
          {
            title: 'Assessments',
            icon: 'solar:document-text-duotone',
            children: [
              { title: 'All Assessments', href: '/dashboard/assessments' },
              {
                title: 'Create Assessment',
                href: '/dashboard/assessments/create'
              },
              { title: 'Grade Configs', href: '/dashboard/assessments/configs' }
            ]
          },
          {
            title: 'Calendar',
            href: '/dashboard/calendar',
            icon: 'solar:calendar-date-duotone'
          },
          {
            title: 'Gradebook',
            href: '/dashboard/classes/gradebook',
            icon: 'solar:chart-2-duotone'
          },
          {
            title: 'Attendance',
            href: '/dashboard/attendance',
            icon: 'solar:user-check-rounded-duotone'
          }
        ]
      },
      {
        title: 'Reports & Analytics',
        items: [
          {
            title: 'Reports',
            icon: 'solar:graph-up-duotone',
            children: [
              { title: 'Overview', href: '/dashboard/reports' },
              { title: 'Report Cards', href: '/dashboard/reports/cards' },
              {
                title: 'Scheduled Reports',
                href: '/dashboard/reports/scheduled'
              }
            ]
          },
          {
            title: 'Analytics',
            href: '/dashboard/analytics',
            icon: 'solar:round-graph-duotone'
          }
        ]
      },
      {
        title: 'Operations',
        items: [
          {
            title: 'Documents',
            href: '/dashboard/documents',
            icon: 'solar:document-text-duotone'
          },
          {
            title: 'Payments',
            href: '/dashboard/payments',
            icon: 'solar:card-transfer-duotone'
          },
          {
            title: 'Saved Views',
            href: '/dashboard/views',
            icon: 'solar:bookmark-duotone'
          }
        ]
      },
      {
        title: 'Settings',
        items: [
          {
            title: 'School Settings',
            icon: 'solar:settings-minimalistic-duotone',
            children: [
              {
                title: 'Users & Permissions',
                href: '/dashboard/settings/users'
              },
              {
                title: 'Integrations',
                href: '/dashboard/settings/integrations'
              }
            ]
          },
          {
            title: 'Support',
            href: '/dashboard/support',
            icon: 'solar:question-square-duotone'
          }
        ]
      }
    ]
  },

  teacher: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'solar:widget-2-duotone' }
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-duotone'
          }
        ]
      },
      {
        title: 'Teaching',
        items: [
          {
            title: 'Student Profiles',
            href: '/dashboard/students',
            icon: 'solar:user-check-rounded-duotone'
          },
          {
            title: 'Assessments',
            href: '/dashboard/assessments',
            icon: 'solar:document-text-duotone'
          },
          {
            title: 'Calendar',
            href: '/dashboard/calendar',
            icon: 'solar:calendar-date-duotone'
          },
          {
            title: 'Gradebook',
            href: '/dashboard/classes/gradebook',
            icon: 'solar:chart-2-duotone'
          },
          {
            title: 'Attendance',
            href: '/dashboard/attendance',
            icon: 'solar:user-check-rounded-duotone'
          }
        ]
      },
      {
        title: 'Tools',
        items: [
          {
            title: 'Analytics',
            href: '/dashboard/analytics',
            icon: 'solar:graph-up-duotone'
          },
          {
            title: 'Saved Views',
            href: '/dashboard/views',
            icon: 'solar:bookmark-duotone'
          },
          {
            title: 'Support',
            href: '/dashboard/support',
            icon: 'solar:question-square-duotone'
          }
        ]
      }
    ]
  },

  parent: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'solar:widget-2-duotone' }
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-duotone'
          }
        ]
      },
      {
        title: 'Family',
        items: [
          {
            title: 'My Children',
            href: '/dashboard/students',
            icon: 'solar:users-group-rounded-duotone'
          },
          {
            title: 'Payments',
            href: '/dashboard/payments',
            icon: 'solar:card-transfer-duotone'
          }
        ]
      },
      {
        title: 'Account',
        items: [
          {
            title: 'Profile',
            href: '/dashboard/profile',
            icon: 'solar:user-circle-duotone'
          },
          {
            title: 'Support',
            href: '/dashboard/support',
            icon: 'solar:question-square-duotone'
          }
        ]
      }
    ]
  },

  student: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'solar:widget-2-duotone' }
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-duotone'
          }
        ]
      },
      {
        title: 'Academic',
        items: [
          {
            title: 'My Courses',
            href: '/dashboard/analytics',
            icon: 'solar:library-duotone'
          },
          {
            title: 'Calendar',
            href: '/dashboard/calendar',
            icon: 'solar:calendar-date-duotone'
          },
          {
            title: 'Attendance',
            href: '/dashboard/attendance',
            icon: 'solar:user-check-rounded-duotone'
          }
        ]
      },
      {
        title: 'Account',
        items: [
          {
            title: 'Profile',
            href: '/dashboard/profile',
            icon: 'solar:user-circle-duotone'
          },
          {
            title: 'Support',
            href: '/dashboard/support',
            icon: 'solar:question-square-duotone'
          }
        ]
      }
    ]
  },

  counselor: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'solar:widget-2-duotone' }
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-duotone'
          }
        ]
      },
      {
        title: 'Student Support',
        items: [
          {
            title: 'Student Profiles',
            href: '/dashboard/students',
            icon: 'solar:user-check-rounded-duotone'
          },
          {
            title: 'Reports',
            href: '/dashboard/reports',
            icon: 'solar:graph-up-duotone'
          }
        ]
      },
      {
        title: 'Tools',
        items: [
          {
            title: 'Saved Views',
            href: '/dashboard/views',
            icon: 'solar:bookmark-duotone'
          },
          {
            title: 'Support',
            href: '/dashboard/support',
            icon: 'solar:question-square-duotone'
          }
        ]
      }
    ]
  },

  accountant: {
    mainNav: [
      { title: 'Dashboard', href: '/dashboard', icon: 'solar:widget-2-duotone' }
    ],
    sidebarGroups: [
      {
        title: 'Overview',
        items: [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-duotone'
          }
        ]
      },
      {
        title: 'Finance',
        items: [
          {
            title: 'Invoices',
            href: '/dashboard/invoices',
            icon: 'solar:document-text-duotone'
          },
          {
            title: 'Payments',
            href: '/dashboard/payments',
            icon: 'solar:card-transfer-duotone'
          },
          {
            title: 'Reports',
            href: '/dashboard/reports',
            icon: 'solar:graph-up-duotone'
          }
        ]
      },
      {
        title: 'Support',
        items: [
          {
            title: 'Support',
            href: '/dashboard/support',
            icon: 'solar:question-square-duotone'
          }
        ]
      }
    ]
  }
};
