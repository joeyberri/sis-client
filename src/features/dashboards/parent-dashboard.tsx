'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import {
  DashboardHero,
  MetricCard,
  SectionCard,
  ListItem,
  QuickActionGrid,
  DashboardLoading
} from '@/components/dashboard/dashboard-primitives';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

interface ParentDashboardStats {
  childrenCount: number;
  averageGPA: number;
  attendanceRate: number;
  pendingFees: number;
  upcomingEvents: number;
  unreadMessages: number;
}

const MOCK_STATS: ParentDashboardStats = {
  childrenCount: 2,
  averageGPA: 3.65,
  attendanceRate: 96,
  pendingFees: 2,
  upcomingEvents: 5,
  unreadMessages: 3
};

const MOCK_CHILDREN = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: null,
    grade: 'Grade 10-A',
    gpa: 3.8,
    attendance: 98,
    recentGrade: 'A-',
    status: 'excellent',
    subjects: [
      { name: 'Mathematics', grade: 'A', trend: 'up' },
      { name: 'Physics', grade: 'A-', trend: 'stable' },
      { name: 'English', grade: 'B+', trend: 'up' }
    ]
  },
  {
    id: '2',
    name: 'Michael Johnson',
    avatar: null,
    grade: 'Grade 8-B',
    gpa: 3.5,
    attendance: 94,
    recentGrade: 'B+',
    status: 'good',
    subjects: [
      { name: 'Mathematics', grade: 'B+', trend: 'up' },
      { name: 'Science', grade: 'A-', trend: 'up' },
      { name: 'History', grade: 'B', trend: 'stable' }
    ]
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'grade',
    title: 'New Grade Posted',
    message: 'Sarah received an A on Math Quiz',
    time: '2 hours ago'
  },
  {
    id: '2',
    type: 'event',
    title: 'School Event',
    message: 'Parent-Teacher Conference on March 15',
    time: '5 hours ago'
  },
  {
    id: '3',
    type: 'attendance',
    title: 'Attendance Alert',
    message: 'Michael was marked late today',
    time: '1 day ago'
  },
  {
    id: '4',
    type: 'fee',
    title: 'Payment Reminder',
    message: 'Term 2 fees due in 5 days',
    time: '2 days ago'
  }
];

const QUICK_ACTIONS = [
  {
    icon: 'solar:document-text-duotone',
    label: 'View Grades',
    href: '/dashboard/grades'
  },
  { icon: 'solar:wallet-duotone', label: 'Pay Fees', href: '/dashboard/fees' },
  {
    icon: 'solar:letter-duotone',
    label: 'Message Teacher',
    href: '/dashboard/messages'
  },
  {
    icon: 'solar:chart-2-duotone',
    label: 'Progress Report',
    href: '/dashboard/reports'
  }
];

export default function ParentDashboard() {
  const [stats, setStats] = useState<ParentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/parent-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(MOCK_STATS);
        }
      } catch (err) {
        console.error('Failed to fetch parent dashboard:', err);
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
          icon='solar:users-group-two-rounded-bold-duotone'
          title='Loading your family portal'
          description="Gathering your children's latest updates..."
        />
      </PageContainer>
    );
  }

  const data = stats || MOCK_STATS;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'needs-attention':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'grade':
        return {
          icon: 'solar:medal-star-duotone',
          color: 'text-emerald-600 bg-emerald-100'
        };
      case 'event':
        return {
          icon: 'solar:calendar-date-duotone',
          color: 'text-blue-600 bg-blue-100'
        };
      case 'attendance':
        return {
          icon: 'solar:alarm-duotone',
          color: 'text-orange-600 bg-orange-100'
        };
      case 'fee':
        return {
          icon: 'solar:wallet-duotone',
          color: 'text-violet-600 bg-violet-100'
        };
      default:
        return {
          icon: 'solar:bell-duotone',
          color: 'text-primary bg-primary/10'
        };
    }
  };

  return (
    <PageContainer scrollable>
      <div className='flex flex-col gap-8 pb-8'>
        {/* Hero Section */}
        <DashboardHero
          badge={{
            icon: 'solar:users-group-two-rounded-linear',
            text: 'Parent Portal'
          }}
          title='Welcome to your Family Hub'
          subtitle="Stay connected with your children's education. Track progress, manage payments, and communicate with teachers."
          actions={[
            {
              label: 'View All Children',
              href: '/dashboard/children',
              icon: 'solar:user-heart-duotone'
            },
            {
              label: 'School Calendar',
              href: '/dashboard/calendar',
              icon: 'solar:calendar-date-duotone',
              variant: 'outline'
            }
          ]}
          backgroundIcon='solar:users-group-two-rounded-bold-duotone'
        />

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <MetricCard
            icon='solar:user-heart-duotone'
            iconColor='text-blue-600'
            iconBgColor='bg-blue-100'
            value={data.childrenCount}
            label='My Children'
          />
          <MetricCard
            icon='solar:graph-up-duotone'
            iconColor='text-emerald-600'
            iconBgColor='bg-emerald-100'
            value={data.averageGPA.toFixed(2)}
            label='Average GPA'
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            icon='solar:calendar-check-duotone'
            iconColor='text-violet-600'
            iconBgColor='bg-violet-100'
            value={`${data.attendanceRate}%`}
            label='Attendance Rate'
          />
          <MetricCard
            icon='solar:wallet-duotone'
            iconColor={
              data.pendingFees > 0 ? 'text-orange-600' : 'text-emerald-600'
            }
            iconBgColor={
              data.pendingFees > 0 ? 'bg-orange-100' : 'bg-emerald-100'
            }
            value={data.pendingFees}
            label='Pending Payments'
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Children Overview */}
            <SectionCard
              title='My Children'
              titleIcon='solar:user-heart-duotone'
              description='Academic overview for each child'
              viewAllHref='/dashboard/children'
            >
              <div className='space-y-6'>
                {MOCK_CHILDREN.map((child) => (
                  <Card key={child.id} className='overflow-hidden'>
                    <div
                      className={cn(
                        'h-1 bg-gradient-to-r',
                        child.status === 'excellent'
                          ? 'from-emerald-500 to-emerald-600'
                          : 'from-blue-500 to-blue-600'
                      )}
                    />
                    <CardContent className='p-5'>
                      <div className='mb-4 flex items-start justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='from-primary/20 to-primary/10 flex size-12 items-center justify-center rounded-full bg-gradient-to-br'>
                            <Icon
                              icon='solar:user-rounded-duotone'
                              className='text-primary size-6'
                            />
                          </div>
                          <div>
                            <h4 className='font-semibold'>{child.name}</h4>
                            <p className='text-muted-foreground text-sm'>
                              {child.grade}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(child.status)}>
                          {child.status === 'excellent'
                            ? 'Excellent'
                            : 'Good Standing'}
                        </Badge>
                      </div>

                      <div className='mb-4 grid grid-cols-3 gap-4'>
                        <div className='bg-muted/50 rounded-lg p-3 text-center'>
                          <p className='text-primary text-2xl font-bold'>
                            {child.gpa}
                          </p>
                          <p className='text-muted-foreground text-xs'>GPA</p>
                        </div>
                        <div className='bg-muted/50 rounded-lg p-3 text-center'>
                          <p className='text-2xl font-bold text-emerald-600'>
                            {child.attendance}%
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            Attendance
                          </p>
                        </div>
                        <div className='bg-muted/50 rounded-lg p-3 text-center'>
                          <p className='text-2xl font-bold text-blue-600'>
                            {child.recentGrade}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            Latest
                          </p>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <p className='text-muted-foreground text-sm font-medium'>
                          Subject Performance
                        </p>
                        <div className='grid grid-cols-3 gap-2'>
                          {child.subjects.map((subject, i) => (
                            <div
                              key={i}
                              className='flex items-center justify-between rounded-lg border p-2'
                            >
                              <span className='truncate text-xs font-medium'>
                                {subject.name}
                              </span>
                              <div className='flex items-center gap-1'>
                                <span className='text-xs font-bold'>
                                  {subject.grade}
                                </span>
                                <Icon
                                  icon={
                                    subject.trend === 'up'
                                      ? 'solar:arrow-up-linear'
                                      : 'solar:arrow-right-linear'
                                  }
                                  className={cn(
                                    'size-3',
                                    subject.trend === 'up'
                                      ? 'text-emerald-500'
                                      : 'text-muted-foreground'
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionCard>

            {/* Upcoming Events & Deadlines */}
            <SectionCard
              title='Upcoming Events'
              titleIcon='solar:calendar-date-duotone'
              description='School events and important dates'
              viewAllHref='/dashboard/calendar'
            >
              <div className='space-y-3'>
                {[
                  {
                    title: 'Parent-Teacher Conference',
                    date: 'Mar 15',
                    time: '2:00 PM',
                    type: 'meeting'
                  },
                  {
                    title: 'Science Fair',
                    date: 'Mar 20',
                    time: '9:00 AM',
                    type: 'event'
                  },
                  {
                    title: 'Term 2 Fees Due',
                    date: 'Mar 25',
                    time: '',
                    type: 'deadline'
                  },
                  {
                    title: 'Spring Break Begins',
                    date: 'Apr 1',
                    time: '',
                    type: 'holiday'
                  }
                ].map((event, i) => (
                  <ListItem
                    key={i}
                    icon={
                      event.type === 'meeting'
                        ? 'solar:users-group-rounded-duotone'
                        : event.type === 'event'
                          ? 'solar:star-duotone'
                          : event.type === 'deadline'
                            ? 'solar:alarm-duotone'
                            : 'solar:sun-duotone'
                    }
                    iconClassName={
                      event.type === 'meeting'
                        ? 'text-blue-600 bg-blue-100'
                        : event.type === 'event'
                          ? 'text-violet-600 bg-violet-100'
                          : event.type === 'deadline'
                            ? 'text-orange-600 bg-orange-100'
                            : 'text-emerald-600 bg-emerald-100'
                    }
                    title={event.title}
                    subtitle={event.time || 'All day'}
                    badge={{ text: event.date }}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className='space-y-8'>
            {/* Notifications */}
            <SectionCard
              title='Notifications'
              titleIcon='solar:bell-bing-duotone'
              viewAllHref='/dashboard/notifications'
            >
              <div className='space-y-3'>
                {MOCK_NOTIFICATIONS.map((notif) => {
                  const iconData = getNotificationIcon(notif.type);
                  return (
                    <ListItem
                      key={notif.id}
                      icon={iconData.icon}
                      iconClassName={iconData.color}
                      title={notif.title}
                      subtitle={notif.message}
                      meta={notif.time}
                    />
                  );
                })}
              </div>
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title='Quick Actions' titleIcon='solar:bolt-duotone'>
              <QuickActionGrid actions={QUICK_ACTIONS} />
            </SectionCard>

            {/* Fee Summary */}
            <SectionCard
              title='Fee Summary'
              titleIcon='solar:wallet-duotone'
              viewAllHref='/dashboard/fees'
            >
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Total Due
                  </span>
                  <span className='text-lg font-bold'>$2,450</span>
                </div>
                <Progress value={65} className='h-2' />
                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>$4,550 paid</span>
                  <span>65% complete</span>
                </div>
                <div className='space-y-2 pt-2'>
                  {[
                    {
                      label: 'Term 2 Tuition',
                      amount: '$1,800',
                      due: 'Mar 25'
                    },
                    { label: 'Activity Fee', amount: '$650', due: 'Apr 1' }
                  ].map((fee, i) => (
                    <div
                      key={i}
                      className='bg-muted/50 flex items-center justify-between rounded-lg p-2'
                    >
                      <div>
                        <p className='text-sm font-medium'>{fee.label}</p>
                        <p className='text-muted-foreground text-xs'>
                          Due {fee.due}
                        </p>
                      </div>
                      <Badge variant='outline'>{fee.amount}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
