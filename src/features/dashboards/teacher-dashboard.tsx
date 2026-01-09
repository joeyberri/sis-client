'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import {
  DashboardHero,
  MetricCard,
  SectionCard,
  ItemCard,
  ListItem,
  ScheduleItem,
  QuickActionGrid,
  DashboardLoading
} from '@/components/dashboard/dashboard-primitives';
import { apiClient } from '@/lib/api/client';

interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  pendingGradingCount: number;
  averageClassSize: number;
  upcomingClasses: number;
  classAverage?: number;
}

const MOCK_STATS: TeacherDashboardStats = {
  totalClasses: 6,
  totalStudents: 145,
  pendingAssignments: 4,
  pendingGradingCount: 23,
  averageClassSize: 24,
  upcomingClasses: 3,
  classAverage: 82
};

const MOCK_CLASSES = [
  {
    id: '1',
    name: 'Mathematics',
    section: 'Class 10-A',
    students: 32,
    nextClass: '09:00 AM',
    progress: 68
  },
  {
    id: '2',
    name: 'Physics',
    section: 'Class 10-B',
    students: 28,
    nextClass: '11:30 AM',
    progress: 72
  },
  {
    id: '3',
    name: 'Mathematics',
    section: 'Class 9-A',
    students: 30,
    nextClass: '02:00 PM',
    progress: 45
  },
  {
    id: '4',
    name: 'Physics',
    section: 'Class 9-B',
    students: 26,
    nextClass: 'Tomorrow',
    progress: 55
  }
];

const MOCK_ASSIGNMENTS = [
  {
    id: '1',
    title: 'Chapter 5 Quiz',
    subject: 'Mathematics',
    dueDate: '2 days',
    submissions: 28,
    total: 32,
    status: 'active'
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    subject: 'Physics',
    dueDate: '4 days',
    submissions: 12,
    total: 28,
    status: 'active'
  },
  {
    id: '3',
    title: 'Midterm Prep Exercise',
    subject: 'Mathematics',
    dueDate: 'Tomorrow',
    submissions: 30,
    total: 30,
    status: 'grading'
  }
];

const MOCK_SCHEDULE = [
  { time: '09:00 AM', title: 'Mathematics - Class 10-A', subtitle: 'Room 204' },
  {
    time: '11:30 AM',
    title: 'Physics - Class 10-B',
    subtitle: 'Lab 3',
    isHighlighted: true
  },
  { time: '02:00 PM', title: 'Mathematics - Class 9-A', subtitle: 'Room 201' },
  { time: '03:30 PM', title: 'Office Hours', subtitle: 'Staff Room' }
];

const QUICK_ACTIONS = [
  {
    icon: 'solar:document-add-duotone',
    label: 'Create Assignment',
    href: '/dashboard/assignments/create'
  },
  {
    icon: 'solar:checklist-minimalistic-duotone',
    label: 'Grade Work',
    href: '/dashboard/grading'
  },
  {
    icon: 'solar:letter-duotone',
    label: 'Message Class',
    href: '/dashboard/messages'
  },
  {
    icon: 'solar:notebook-duotone',
    label: 'View Gradebook',
    href: '/dashboard/gradebook'
  }
];

const ACCENT_COLORS = [
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600'
];

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/teacher-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(MOCK_STATS);
        }
      } catch (err) {
        console.error('Failed to fetch teacher dashboard:', err);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <DashboardLoading
          icon='solar:square-academic-cap-bold-duotone'
          title='Preparing your teaching hub'
          description='Loading classes, assignments, and schedule...'
        />
      </PageContainer>
    );
  }

  const data = stats || MOCK_STATS;

  return (
    <PageContainer scrollable>
      <div className='flex flex-col gap-8 pb-8'>
        {/* Hero Section */}
        <DashboardHero
          badge={{
            icon: 'solar:square-academic-cap-linear',
            text: 'Teacher Portal'
          }}
          title='Ready to inspire today?'
          subtitle='Manage your classes, track student progress, and create engaging learning experiences.'
          actions={[
            {
              label: 'Start Class',
              href: '/dashboard/classroom',
              icon: 'solar:play-circle-duotone'
            },
            {
              label: 'View Schedule',
              href: '/dashboard/calendar',
              icon: 'solar:calendar-date-duotone',
              variant: 'outline'
            }
          ]}
          backgroundIcon='solar:square-academic-cap-bold-duotone'
        />

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <MetricCard
            icon='solar:users-group-rounded-duotone'
            iconColor='text-blue-600'
            iconBgColor='bg-blue-100'
            value={data.totalClasses}
            label='My Classes'
          />
          <MetricCard
            icon='solar:user-rounded-duotone'
            iconColor='text-emerald-600'
            iconBgColor='bg-emerald-100'
            value={data.totalStudents}
            label='Total Students'
          />
          <MetricCard
            icon='solar:clipboard-check-duotone'
            iconColor='text-orange-600'
            iconBgColor='bg-orange-100'
            value={data.pendingGradingCount}
            label='To Grade'
          />
          <MetricCard
            icon='solar:graph-up-duotone'
            iconColor='text-violet-600'
            iconBgColor='bg-violet-100'
            value={`${data.classAverage || 82}%`}
            label='Class Average'
            trend={{ value: 3.2, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='space-y-8 lg:col-span-2'>
            {/* My Classes */}
            <SectionCard
              title='My Classes'
              titleIcon='solar:book-2-duotone'
              description='Your current teaching assignments'
              viewAllHref='/dashboard/classes'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {MOCK_CLASSES.map((cls, i) => (
                  <ItemCard
                    key={cls.id}
                    href={`/dashboard/classes/${cls.id}`}
                    accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                    title={cls.name}
                    subtitle={cls.section}
                    badge={{
                      text: `${cls.students} students`,
                      variant: 'secondary'
                    }}
                    progress={cls.progress}
                    meta={`Next: ${cls.nextClass}`}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Active Assignments */}
            <SectionCard
              title='Active Assignments'
              titleIcon='solar:document-text-duotone'
              description='Track submissions and deadlines'
              viewAllHref='/dashboard/assignments'
            >
              <div className='space-y-3'>
                {MOCK_ASSIGNMENTS.map((assignment) => {
                  const submissionRate = Math.round(
                    (assignment.submissions / assignment.total) * 100
                  );
                  const isUrgent =
                    assignment.dueDate.includes('Tomorrow') ||
                    assignment.dueDate.includes('1 day');

                  return (
                    <ListItem
                      key={assignment.id}
                      icon={
                        assignment.status === 'grading'
                          ? 'solar:checklist-minimalistic-duotone'
                          : 'solar:document-duotone'
                      }
                      iconClassName={
                        assignment.status === 'grading'
                          ? 'text-orange-600 bg-orange-100'
                          : 'text-primary bg-primary/10'
                      }
                      title={assignment.title}
                      subtitle={`${assignment.subject} • ${assignment.submissions}/${assignment.total} submitted`}
                      badge={{
                        text:
                          assignment.status === 'grading'
                            ? 'Needs Grading'
                            : assignment.dueDate,
                        className: cn(
                          isUrgent && 'border-red-200 text-red-600 bg-red-50',
                          assignment.status === 'grading' &&
                            'border-orange-200 text-orange-600 bg-orange-50'
                        )
                      }}
                      meta={`${submissionRate}% submitted`}
                    />
                  );
                })}
              </div>
            </SectionCard>

            {/* Recent Submissions */}
            <SectionCard
              title='Recent Submissions'
              titleIcon='solar:inbox-in-duotone'
              description='Latest student work to review'
              viewAllHref='/dashboard/grading'
            >
              <div className='space-y-3'>
                {[
                  {
                    student: 'Sarah Johnson',
                    assignment: 'Chapter 5 Quiz',
                    time: '2 hours ago',
                    score: null
                  },
                  {
                    student: 'Michael Chen',
                    assignment: 'Physics Lab Report',
                    time: '4 hours ago',
                    score: null
                  },
                  {
                    student: 'Emma Williams',
                    assignment: 'Chapter 5 Quiz',
                    time: '5 hours ago',
                    score: 85
                  }
                ].map((item, i) => (
                  <ListItem
                    key={i}
                    icon='solar:user-rounded-duotone'
                    iconClassName='text-blue-600 bg-blue-100'
                    title={item.student}
                    subtitle={item.assignment}
                    badge={
                      item.score
                        ? {
                            text: `${item.score}%`,
                            className:
                              'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }
                        : {
                            text: 'Pending',
                            className:
                              'bg-orange-100 text-orange-700 border-orange-200'
                          }
                    }
                    meta={item.time}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className='space-y-8'>
            {/* Today's Schedule */}
            <SectionCard
              title="Today's Schedule"
              titleIcon='solar:calendar-date-duotone'
              viewAllHref='/dashboard/calendar'
            >
              <div className='space-y-3'>
                {MOCK_SCHEDULE.map((item, i) => (
                  <ScheduleItem
                    key={i}
                    time={item.time}
                    title={item.title}
                    subtitle={item.subtitle}
                    isHighlighted={item.isHighlighted}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title='Quick Actions' titleIcon='solar:bolt-duotone'>
              <QuickActionGrid actions={QUICK_ACTIONS} />
            </SectionCard>

            {/* Upcoming Deadlines */}
            <SectionCard
              title='Upcoming Deadlines'
              titleIcon='solar:alarm-duotone'
            >
              <div className='space-y-2'>
                {[
                  {
                    task: 'Submit grades for Class 10-A',
                    due: 'Mar 15',
                    urgent: true
                  },
                  {
                    task: 'Midterm exam preparation',
                    due: 'Mar 18',
                    urgent: false
                  },
                  { task: 'Progress reports due', due: 'Mar 22', urgent: false }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center justify-between rounded-lg p-2 text-sm',
                      item.urgent && 'border border-red-100 bg-red-50'
                    )}
                  >
                    <span
                      className={cn(
                        'truncate font-medium',
                        item.urgent && 'text-red-700'
                      )}
                    >
                      {item.task}
                    </span>
                    <Badge
                      variant='outline'
                      className={cn(
                        'ml-2 flex-shrink-0',
                        item.urgent && 'border-red-200 text-red-600'
                      )}
                    >
                      {item.due}
                    </Badge>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Class Performance */}
            <SectionCard
              title='Class Performance'
              titleIcon='solar:chart-2-duotone'
              viewAllHref='/dashboard/analytics'
            >
              <div className='space-y-3'>
                {[
                  { class: 'Class 10-A', avg: 85, trend: 'up' },
                  { class: 'Class 10-B', avg: 78, trend: 'up' },
                  { class: 'Class 9-A', avg: 82, trend: 'down' },
                  { class: 'Class 9-B', avg: 74, trend: 'up' }
                ].map((item, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>{item.class}</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-bold'>{item.avg}%</span>
                      <Icon
                        icon={
                          item.trend === 'up'
                            ? 'solar:arrow-up-linear'
                            : 'solar:arrow-down-linear'
                        }
                        className={cn(
                          'size-4',
                          item.trend === 'up'
                            ? 'text-emerald-500'
                            : 'text-red-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
