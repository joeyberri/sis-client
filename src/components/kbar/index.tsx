'use client';
import { navItems } from '@/constants/data';
import { SIDEBAR_CONFIGS } from '@/constants/sidebar';
import { useUser } from '@/context/user/user-context';
import { Icons } from '../icons';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAdmin, isTeacher, isStudent, isParent } = useUser();

  // These action are for the navigation
  const actions = useMemo(() => {
    // Define navigateTo inside the useMemo callback to avoid dependency array issues
    const navigateTo = (url: string) => {
      router.push(url);
    };

    // Get role-based sidebar config
    const role = user?.role;
    const validRoles = Object.keys(SIDEBAR_CONFIGS) as Array<
      keyof typeof SIDEBAR_CONFIGS
    >;
    const config =
      role && validRoles.includes(role) ? SIDEBAR_CONFIGS[role] : undefined;

    // Use sidebarGroups if available, otherwise fall back to navItems
    const groupsToRender = config?.sidebarGroups || [
      {
        title: 'Navigation',
        items: navItems.map((n) => ({
          title: n.title,
          href: n.url,
          icon: n.icon,
          children: n.items?.map((i) => ({ title: i.title, href: i.url }))
        }))
      }
    ];

    // Base navigation actions from sidebar
    const navActions = groupsToRender.flatMap((group) => {
      return group.items.flatMap((item: any) => {
        // Resolve icon
        const IconComp =
          item.icon && (Icons as any)[item.icon]
            ? (Icons as any)[item.icon]
            : null;

        // Only include base action if the item has a real URL
        const baseAction =
          item.href && item.href !== '#'
            ? {
                id: `${item.title.toLowerCase().replace(/\s+/g, '-')}Action`,
                name: item.title,
                shortcut: item.shortcut,
                keywords: item.title.toLowerCase(),
                section: group.title,
                subtitle: `Go to ${item.title}`,
                icon: IconComp ? (
                  <IconComp className='size-4' />
                ) : (
                  <Icon icon='solar:round-alt-arrow-right-duotone' />
                ),
                perform: () => navigateTo(item.href)
              }
            : null;

        // Map child items into actions
        const childActions =
          item.children?.map((childItem: any) => ({
            id: `${childItem.title.toLowerCase().replace(/\s+/g, '-')}Action`,
            name: childItem.title,
            shortcut: childItem.shortcut,
            keywords: childItem.title.toLowerCase(),
            section: item.title,
            subtitle: `Go to ${childItem.title}`,
            icon: (
              <Icon
                icon='solar:subdirectory-right-duotone'
                className='size-4'
              />
            ),
            perform: () => navigateTo(childItem.href)
          })) ?? [];

        // Return only valid actions (ignoring null base actions for containers)
        return baseAction ? [baseAction, ...childActions] : childActions;
      });
    });

    // Quick Actions - Available to all users
    const quickActions = [
      {
        id: 'quick-dashboard',
        name: 'Go to Dashboard',
        shortcut: ['g', 'd'],
        keywords: 'home dashboard overview',
        section: 'Quick Actions',
        subtitle: 'Return to main dashboard',
        icon: <Icon icon='solar:widget-2-duotone' className='size-4' />,
        perform: () => navigateTo('/dashboard')
      },
      {
        id: 'quick-profile',
        name: 'View Profile',
        shortcut: ['g', 'p'],
        keywords: 'profile account me',
        section: 'Quick Actions',
        subtitle: 'View your profile settings',
        icon: <Icon icon='solar:user-circle-duotone' className='size-4' />,
        perform: () => navigateTo('/dashboard/profile')
      },
      {
        id: 'quick-documents-supabase',
        name: 'Cloud Storage (Supabase)',
        shortcut: ['g', 'f'],
        keywords: 'files storage documents cloud supabase',
        section: 'Quick Actions',
        subtitle: 'Manage files on Supabase Storage',
        icon: <Icon icon='solar:cloud-storage-duotone' className='size-4' />,
        perform: () => navigateTo('/dashboard/documents')
      },
      {
        id: 'quick-audit-logs',
        name: 'Audit Logs',
        shortcut: ['g', 'l'],
        keywords: 'logs audit activity history',
        section: 'System',
        subtitle: 'View system activity logs',
        icon: <Icon icon='solar:history-duotone' className='size-4' />,
        perform: () => navigateTo('/dashboard/reports')
      }
    ];

    // Admin-specific quick actions
    const adminActions = isAdmin
      ? [
          {
            id: 'admin-add-student',
            name: 'Add New Student',
            keywords: 'create student new enroll',
            section: 'Admin Actions',
            subtitle: 'Enroll a new student',
            icon: (
              <Icon
                icon='solar:user-plus-duotone'
                className='size-4 text-emerald-500'
              />
            ),
            perform: () => navigateTo('/dashboard/students/new')
          },
          {
            id: 'admin-add-teacher',
            name: 'Add New Teacher',
            keywords: 'create teacher new hire',
            section: 'Admin Actions',
            subtitle: 'Add a new teacher',
            icon: (
              <Icon
                icon='solar:user-hand-up-duotone'
                className='size-4 text-blue-500'
              />
            ),
            perform: () => navigateTo('/dashboard/teachers/new')
          },
          {
            id: 'admin-add-class',
            name: 'Create New Class',
            keywords: 'create class new section',
            section: 'Admin Actions',
            subtitle: 'Create a new class',
            icon: (
              <Icon
                icon='solar:clapperboard-edit-duotone'
                className='size-4 text-amber-500'
              />
            ),
            perform: () => navigateTo('/dashboard/classes/new')
          }
        ]
      : [];

    // Teacher-specific quick actions
    const teacherActions = isTeacher
      ? [
          {
            id: 'teacher-attendance',
            name: 'Take Attendance',
            keywords: 'attendance present absent',
            section: 'Teacher Actions',
            subtitle: 'Mark student attendance',
            icon: (
              <Icon
                icon='solar:user-check-rounded-duotone'
                className='size-4 text-emerald-500'
              />
            ),
            perform: () => navigateTo('/dashboard/attendance')
          },
          {
            id: 'teacher-gradebook',
            name: 'Open Gradebook',
            keywords: 'grades marks scores',
            section: 'Teacher Actions',
            subtitle: 'View and update grades',
            icon: (
              <Icon
                icon='solar:pen-new-square-duotone'
                className='text-primary size-4'
              />
            ),
            perform: () => navigateTo('/dashboard/assessments/gradebook')
          },
          {
            id: 'teacher-create-assessment',
            name: 'Create Assessment',
            keywords: 'quiz test exam assessment',
            section: 'Teacher Actions',
            subtitle: 'Create a new quiz or exam',
            icon: <Icon icon='solar:document-add-duotone' className='size-4' />,
            perform: () => navigateTo('/dashboard/assessments/create')
          },
          {
            id: 'teacher-my-classes',
            name: 'My Classes',
            keywords: 'classes courses sections',
            section: 'Teacher Actions',
            subtitle: 'View your assigned classes',
            icon: <Icon icon='solar:blackhole-duotone' className='size-4' />,
            perform: () => navigateTo('/dashboard/classes')
          }
        ]
      : [];

    // Student-specific quick actions
    const studentActions = isStudent
      ? [
          {
            id: 'student-my-grades',
            name: 'View My Grades',
            keywords: 'grades marks results',
            section: 'Student Actions',
            subtitle: 'Check your academic grades',
            icon: (
              <Icon
                icon='solar:star-fall-duotone'
                className='size-4 text-amber-500'
              />
            ),
            perform: () => navigateTo('/dashboard/grades')
          },
          {
            id: 'student-assignments',
            name: 'View Assignments',
            keywords: 'assignments homework tasks',
            section: 'Student Actions',
            subtitle: 'View pending assignments',
            icon: <Icon icon='solar:document-add-duotone' className='size-4' />,
            perform: () => navigateTo('/dashboard/assignments')
          },
          {
            id: 'student-timetable',
            name: 'My Timetable',
            keywords: 'timetable schedule classes',
            section: 'Student Actions',
            subtitle: 'View your class schedule',
            icon: (
              <Icon icon='solar:calendar-date-duotone' className='size-4' />
            ),
            perform: () => navigateTo('/dashboard/timetable')
          }
        ]
      : [];

    // Parent-specific quick actions
    const parentActions = isParent
      ? [
          {
            id: 'parent-children',
            name: 'View My Children',
            keywords: 'children kids students',
            section: 'Parent Actions',
            subtitle: "View your children's profiles",
            icon: (
              <Icon
                icon='solar:users-group-two-rounded-duotone'
                className='size-4 text-blue-500'
              />
            ),
            perform: () => navigateTo('/dashboard/students')
          },
          {
            id: 'parent-fees',
            name: 'Pay Fees',
            keywords: 'fees money payments tuition',
            section: 'Parent Actions',
            subtitle: 'Manage and pay school fees',
            icon: (
              <Icon
                icon='solar:bill-list-duotone'
                className='size-4 text-emerald-500'
              />
            ),
            perform: () => navigateTo('/dashboard/fees')
          },
          {
            id: 'parent-progress',
            name: 'View Academic Progress',
            keywords: 'progress grades performance',
            section: 'Parent Actions',
            subtitle: 'Check academic progress',
            icon: (
              <Icon
                icon='solar:chart-2-duotone'
                className='text-primary size-4'
              />
            ),
            perform: () => navigateTo('/dashboard/reports')
          }
        ]
      : [];

    return [
      ...navActions,
      ...quickActions,
      ...adminActions,
      ...teacherActions,
      ...studentActions,
      ...parentActions
    ];
  }, [router, user?.role, isAdmin, isTeacher, isStudent, isParent]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='animate-in fade-in fixed inset-0 z-[99999] bg-slate-950/40 backdrop-blur-md transition-all duration-300'>
          <KBarAnimator className='bg-background text-foreground border-muted/50 scale-in-center relative mt-32! w-full max-w-[640px] overflow-hidden rounded-2xl border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]'>
            <div className='bg-background border-muted group sticky top-0 z-10 border-b'>
              <div className='text-muted-foreground/50 group-focus-within:text-primary absolute top-1/2 left-6 -translate-y-1/2 transition-colors'>
                <Icon icon='solar:magnifer-duotone' className='size-5' />
              </div>
              <KBarSearch
                className='placeholder:text-muted-foreground/40 w-full border-none bg-transparent py-5 pr-6 pl-14 text-lg font-medium outline-none focus:ring-0'
                defaultPlaceholder='Execute a command or search...'
              />
              <div className='absolute top-1/2 right-6 -translate-y-1/2'>
                <Badge
                  variant='outline'
                  className='border-muted h-5 px-1.5 text-[10px] font-black opacity-50'
                >
                  ESC
                </Badge>
              </div>
            </div>
            <div className='scrollbar-thin scrollbar-thumb-muted max-h-[480px] overflow-y-auto'>
              <RenderResults />
            </div>
            <div className='bg-muted/5 border-muted text-muted-foreground/60 flex items-center gap-6 border-t px-6 py-3 text-[10px] font-bold tracking-widest uppercase'>
              <div className='flex items-center gap-2'>
                <kbd className='bg-muted border-muted-foreground/10 rounded border px-1.5 py-0.5 text-[9px]'>
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className='flex items-center gap-2'>
                <kbd className='bg-muted border-muted-foreground/10 rounded border px-1.5 py-0.5 text-[9px]'>
                  ENTER
                </kbd>
                <span>Execute</span>
              </div>
              <div className='ml-auto opacity-40'>
                REDEVISE COMMAND CENTER V1.0
              </div>
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
