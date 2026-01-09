'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import {
  DashboardHero,
  MetricCard,
  SectionCard,
  ListItem,
  ScheduleItem,
  QuickActionGrid,
  DashboardLoading
} from '@/components/dashboard/dashboard-primitives';
import { Card, CardContent } from '@/components/ui/card';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { AreaGraph } from '@/features/overview/components/area-graph';
import { PieGraph } from '@/features/overview/components/pie-graph';
import { RecentPayments } from '@/features/overview/components/recent-payments';
import { Progress } from '@/components/ui/progress';

interface AdminDashboardStats {
  totalStudents: number | null;
  totalTeachers: number | null;
  totalClasses: number | null;
  activeAssessments: number | null;
  attendanceRate: number | null;
  pendingAlerts: number | null;
  revenue?: number;
  revenueTrend?: number;
  studentTrend?: number;
  error?: string;
}

const MOCK_STATS: AdminDashboardStats = {
  totalStudents: 1250,
  totalTeachers: 48,
  totalClasses: 32,
  activeAssessments: 12,
  attendanceRate: 94.5,
  pendingAlerts: 3,
  revenue: 45200,
  revenueTrend: 12.5,
  studentTrend: 5.2
};

const QUICK_ACTIONS = [
  {
    icon: 'solar:user-plus-duotone',
    label: 'Enroll Student',
    href: '/dashboard/students/enroll'
  },
  {
    icon: 'solar:medal-ribbons-star-duotone',
    label: 'Assign Grades',
    href: '/dashboard/grading'
  },
  {
    icon: 'solar:bell-bing-duotone',
    label: 'Post Notice',
    href: '/dashboard/messages'
  },
  {
    icon: 'solar:chart-square-duotone',
    label: 'Generate Report',
    href: '/dashboard/reports'
  }
];

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Mid-Term Examinations',
    time: '09:00 AM',
    subtitle: 'Main Hall',
    isHighlighted: true
  },
  {
    id: '2',
    title: 'Staff Meeting',
    time: '02:30 PM',
    subtitle: 'Conference Room'
  },
  {
    id: '3',
    title: 'School Sports Day',
    time: '08:00 AM',
    subtitle: 'Outdoor Stadium'
  }
];

const MOCK_ACTIVITY = [
  {
    id: '1',
    title: 'New student enrolled',
    subtitle: 'John Doe (Grade 10-A)',
    time: '2 hours ago',
    icon: 'solar:user-plus-duotone',
    type: 'success'
  },
  {
    id: '2',
    title: 'Payment received',
    subtitle: 'Tuition Fee for Sarah Smith',
    time: '4 hours ago',
    icon: 'solar:wad-of-money-duotone',
    type: 'info'
  },
  {
    id: '3',
    title: 'Low attendance alert',
    subtitle: 'Class 12-C requires attention',
    time: '6 hours ago',
    icon: 'solar:danger-triangle-duotone',
    type: 'warning'
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/admin-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(MOCK_STATS);
        }
      } catch (err) {
        console.error('Failed to fetch admin dashboard:', err);
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
          icon='solar:buildings-duotone'
          title='Loading school dashboard'
          description='Gathering the latest school metrics...'
        />
      </PageContainer>
    );
  }

  const data = stats || MOCK_STATS;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-600 bg-emerald-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <PageContainer scrollable>
      <div className='flex flex-col gap-8 pb-8'>
        {/* Hero Section */}
        <DashboardHero
          badge={{ icon: 'solar:buildings-linear', text: 'School Admin' }}
          title='Welcome to your School Hub'
          subtitle='Everything you need to manage your school efficiently. Track enrollment, monitor attendance, and keep operations running smoothly.'
          actions={[
            {
              label: 'Enroll Student',
              href: '/dashboard/students/enroll',
              icon: 'solar:user-plus-duotone'
            },
            {
              label: 'View Reports',
              href: '/dashboard/reports',
              icon: 'solar:chart-2-duotone',
              variant: 'outline'
            }
          ]}
          backgroundIcon='solar:buildings-bold-duotone'
        />

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <MetricCard
            icon='solar:users-group-rounded-duotone'
            iconColor='text-blue-600'
            iconBgColor='bg-blue-100'
            value={data.totalStudents?.toLocaleString() || '0'}
            label='Total Students'
            trend={
              data.studentTrend
                ? { value: data.studentTrend, isPositive: true }
                : undefined
            }
          />
          <MetricCard
            icon='solar:banknote-2-duotone'
            iconColor='text-emerald-600'
            iconBgColor='bg-emerald-100'
            value={`$${(data.revenue || 0).toLocaleString()}`}
            label='Revenue'
            trend={
              data.revenueTrend
                ? { value: data.revenueTrend, isPositive: true }
                : undefined
            }
          />
          <MetricCard
            icon='solar:calendar-check-duotone'
            iconColor='text-violet-600'
            iconBgColor='bg-violet-100'
            value={`${data.attendanceRate || 0}%`}
            label='Attendance Rate'
            trend={{ value: 1.2, isPositive: true }}
          />
          <MetricCard
            icon='solar:danger-triangle-duotone'
            iconColor={
              data.pendingAlerts && data.pendingAlerts > 0
                ? 'text-red-600'
                : 'text-emerald-600'
            }
            iconBgColor={
              data.pendingAlerts && data.pendingAlerts > 0
                ? 'bg-red-100'
                : 'bg-emerald-100'
            }
            value={data.pendingAlerts?.toString() || '0'}
            label='Pending Alerts'
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Staff Overview */}
            <Card className='overflow-hidden'>
              <div className='h-1 bg-gradient-to-r from-blue-500 to-violet-500' />
              <CardContent className='p-6'>
                <div className='mb-6 flex items-center justify-between'>
                  <div>
                    <h3 className='flex items-center gap-2 font-semibold'>
                      <Icon
                        icon='solar:users-group-two-rounded-duotone'
                        className='text-primary size-5'
                      />
                      School Overview
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Staff and class distribution
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {[
                    {
                      label: 'Teachers',
                      value: data.totalTeachers || 0,
                      icon: 'solar:square-academic-cap-duotone',
                      color: 'text-blue-600'
                    },
                    {
                      label: 'Classes',
                      value: data.totalClasses || 0,
                      icon: 'solar:presentation-graph-duotone',
                      color: 'text-violet-600'
                    },
                    {
                      label: 'Assessments',
                      value: data.activeAssessments || 0,
                      icon: 'solar:clipboard-list-duotone',
                      color: 'text-emerald-600'
                    },
                    {
                      label: 'Ratio',
                      value: `1:${Math.round((data.totalStudents || 0) / (data.totalTeachers || 1))}`,
                      icon: 'solar:users-group-rounded-duotone',
                      color: 'text-orange-600'
                    }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className='bg-muted/50 rounded-xl p-4 text-center'
                    >
                      <Icon
                        icon={item.icon}
                        className={cn('mx-auto mb-2 size-8', item.color)}
                      />
                      <p className='text-xl font-bold'>{item.value}</p>
                      <p className='text-muted-foreground text-xs'>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visual Analytics Row */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <BarGraph />
              <PieGraph />
            </div>

            <AreaGraph />

            {/* Recent Payments Table */}
            <SectionCard
              title='Recent Payments'
              titleIcon='solar:wad-of-money-duotone'
              description='Latest financial transactions'
              viewAllHref='/dashboard/fees'
            >
              <RecentPayments />
            </SectionCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className='space-y-8'>
            {/* Quick Actions */}
            <SectionCard title='Quick Actions' titleIcon='solar:bolt-duotone'>
              <QuickActionGrid actions={QUICK_ACTIONS} />
            </SectionCard>

            {/* Upcoming Events */}
            <SectionCard
              title='Upcoming Events'
              titleIcon='solar:calendar-duotone'
              viewAllHref='/dashboard/calendar'
            >
              <div className='space-y-2'>
                {MOCK_EVENTS.map((event) => (
                  <ScheduleItem
                    key={event.id}
                    time={event.time}
                    title={event.title}
                    subtitle={event.subtitle}
                    isHighlighted={event.isHighlighted}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Recent Activity */}
            <SectionCard
              title='Recent Activity'
              titleIcon='solar:history-duotone'
              viewAllHref='/dashboard/audit'
            >
              <div className='space-y-3'>
                {MOCK_ACTIVITY.map((item) => (
                  <ListItem
                    key={item.id}
                    icon={item.icon}
                    iconClassName={getActivityIcon(item.type)}
                    title={item.title}
                    subtitle={item.subtitle}
                    meta={item.time}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Storage Usage */}
            <SectionCard
              title='Cloud Storage'
              titleIcon='solar:database-duotone'
            >
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Used Storage</span>
                    <span className='font-medium'>4.2 GB / 10 GB</span>
                  </div>
                  <Progress value={42} className='h-2' />
                </div>
                <div className='grid grid-cols-3 gap-2 text-center'>
                  {[
                    {
                      label: 'Documents',
                      value: '2.1 GB',
                      icon: 'solar:document-duotone'
                    },
                    {
                      label: 'Media',
                      value: '1.5 GB',
                      icon: 'solar:gallery-duotone'
                    },
                    {
                      label: 'Other',
                      value: '0.6 GB',
                      icon: 'solar:folder-duotone'
                    }
                  ].map((item, i) => (
                    <div key={i} className='bg-muted/50 rounded-lg p-2'>
                      <Icon
                        icon={item.icon}
                        className='text-muted-foreground mx-auto mb-1 size-5'
                      />
                      <p className='text-xs font-medium'>{item.value}</p>
                      <p className='text-muted-foreground text-[10px]'>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant='outline' size='sm' className='w-full' asChild>
                  <a href='/dashboard/documents'>Manage Storage</a>
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
