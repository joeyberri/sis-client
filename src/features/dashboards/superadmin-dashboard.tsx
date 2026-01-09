'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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

interface SuperAdminDashboardStats {
  totalSchools: number;
  activeUsers: number;
  totalStudents: number;
  systemHealth: number;
  uptime: number;
  criticalAlerts: number;
  openTickets?: number;
  monthlyRevenue?: number;
}

const MOCK_STATS: SuperAdminDashboardStats = {
  totalSchools: 12,
  activeUsers: 2450,
  totalStudents: 8500,
  systemHealth: 98,
  uptime: 99.9,
  criticalAlerts: 2,
  openTickets: 5,
  monthlyRevenue: 24500
};

const MOCK_SCHOOLS = [
  {
    id: '1',
    name: 'Springfield High School',
    students: 850,
    status: 'active',
    plan: 'Premium'
  },
  {
    id: '2',
    name: 'Central Academy',
    students: 1200,
    status: 'active',
    plan: 'Enterprise'
  },
  {
    id: '3',
    name: 'Westside International',
    students: 650,
    status: 'onboarding',
    plan: 'Standard'
  },
  {
    id: '4',
    name: 'Riverside Prep',
    students: 480,
    status: 'active',
    plan: 'Premium'
  }
];

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'critical',
    message: 'Database connection issues on School #12',
    time: '15 min ago'
  },
  {
    id: '2',
    type: 'warning',
    message: 'API rate limiting detected',
    time: '1 hour ago'
  },
  {
    id: '3',
    type: 'info',
    message: 'System maintenance scheduled for Sunday',
    time: '2 hours ago'
  }
];

const QUICK_ACTIONS = [
  {
    icon: 'solar:buildings-2-duotone',
    label: 'Manage Schools',
    href: '/dashboard/superadmin-overview/schools'
  },
  {
    icon: 'solar:headphones-round-duotone',
    label: 'Support Tickets',
    href: '/dashboard/superadmin-overview/tickets'
  },
  {
    icon: 'solar:tag-price-duotone',
    label: 'Pricing Plans',
    href: '/dashboard/superadmin-overview/pricing'
  },
  {
    icon: 'solar:settings-duotone',
    label: 'System Settings',
    href: '/dashboard/settings'
  }
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/superadmin-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(MOCK_STATS);
        }
      } catch (err) {
        console.error('Failed to fetch superadmin dashboard:', err);
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
          icon='solar:shield-bold-duotone'
          title='Loading system dashboard'
          description='Gathering platform-wide metrics...'
        />
      </PageContainer>
    );
  }

  const data = stats || MOCK_STATS;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          icon: 'solar:danger-circle-duotone',
          color: 'text-red-600 bg-red-100'
        };
      case 'warning':
        return {
          icon: 'solar:danger-triangle-duotone',
          color: 'text-orange-600 bg-orange-100'
        };
      default:
        return {
          icon: 'solar:info-circle-duotone',
          color: 'text-blue-600 bg-blue-100'
        };
    }
  };

  return (
    <PageContainer scrollable>
      <div className='flex flex-col gap-8 pb-8'>
        {/* Hero Section */}
        <DashboardHero
          badge={{ icon: 'solar:shield-linear', text: 'Super Admin' }}
          title='Platform Command Center'
          subtitle='Monitor system health, manage schools, and oversee all platform operations from one place.'
          actions={[
            {
              label: 'Add School',
              href: '/dashboard/superadmin-overview/schools/create',
              icon: 'solar:add-circle-duotone'
            },
            {
              label: 'View Analytics',
              href: '/dashboard/analytics',
              icon: 'solar:chart-2-duotone',
              variant: 'outline'
            }
          ]}
          backgroundIcon='solar:shield-bold-duotone'
        />

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <MetricCard
            icon='solar:buildings-2-duotone'
            iconColor='text-blue-600'
            iconBgColor='bg-blue-100'
            value={data.totalSchools}
            label='Active Schools'
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            icon='solar:users-group-rounded-duotone'
            iconColor='text-emerald-600'
            iconBgColor='bg-emerald-100'
            value={data.activeUsers.toLocaleString()}
            label='Active Users'
          />
          <MetricCard
            icon='solar:heart-pulse-duotone'
            iconColor={
              data.systemHealth >= 95 ? 'text-emerald-600' : 'text-orange-600'
            }
            iconBgColor={
              data.systemHealth >= 95 ? 'bg-emerald-100' : 'bg-orange-100'
            }
            value={`${data.systemHealth}%`}
            label='System Health'
          />
          <MetricCard
            icon='solar:danger-triangle-duotone'
            iconColor={
              data.criticalAlerts > 0 ? 'text-red-600' : 'text-emerald-600'
            }
            iconBgColor={
              data.criticalAlerts > 0 ? 'bg-red-100' : 'bg-emerald-100'
            }
            value={data.criticalAlerts}
            label='Critical Alerts'
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='space-y-8 lg:col-span-2'>
            {/* System Overview */}
            <Card className='overflow-hidden'>
              <div className='h-1 bg-gradient-to-r from-blue-500 to-violet-500' />
              <CardContent className='p-6'>
                <div className='mb-6 flex items-center justify-between'>
                  <div>
                    <h3 className='flex items-center gap-2 font-semibold'>
                      <Icon
                        icon='solar:server-square-duotone'
                        className='text-primary size-5'
                      />
                      System Overview
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Real-time platform health
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className='border-emerald-200 bg-emerald-50 text-emerald-700'
                  >
                    {data.uptime}% uptime
                  </Badge>
                </div>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {[
                    {
                      label: 'Total Students',
                      value: data.totalStudents.toLocaleString(),
                      icon: 'solar:user-rounded-duotone',
                      color: 'text-blue-600'
                    },
                    {
                      label: 'Support Tickets',
                      value: data.openTickets || 0,
                      icon: 'solar:headphones-round-duotone',
                      color: 'text-violet-600'
                    },
                    {
                      label: 'Monthly Revenue',
                      value: `$${(data.monthlyRevenue || 0).toLocaleString()}`,
                      icon: 'solar:wallet-duotone',
                      color: 'text-emerald-600'
                    },
                    {
                      label: 'API Calls Today',
                      value: '125K',
                      icon: 'solar:bolt-duotone',
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

            {/* Schools List */}
            <SectionCard
              title='Enrolled Schools'
              titleIcon='solar:buildings-2-duotone'
              description='Manage all platform schools'
              viewAllHref='/dashboard/superadmin-overview/schools'
            >
              <div className='space-y-3'>
                {MOCK_SCHOOLS.map((school) => (
                  <div
                    key={school.id}
                    className='flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md'
                    onClick={() =>
                      router.push(
                        `/dashboard/superadmin-overview/schools/${school.id}`
                      )
                    }
                  >
                    <div className='flex size-10 items-center justify-center rounded-xl bg-blue-100'>
                      <Icon
                        icon='solar:buildings-duotone'
                        className='size-5 text-blue-600'
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='font-semibold'>{school.name}</h4>
                      <p className='text-muted-foreground text-sm'>
                        {school.students.toLocaleString()} students
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className={cn(
                          school.plan === 'Enterprise' &&
                            'border-violet-200 bg-violet-50 text-violet-700',
                          school.plan === 'Premium' &&
                            'border-blue-200 bg-blue-50 text-blue-700',
                          school.plan === 'Standard' &&
                            'bg-muted text-muted-foreground'
                        )}
                      >
                        {school.plan}
                      </Badge>
                      <Badge
                        variant='outline'
                        className={cn(
                          school.status === 'active' &&
                            'border-emerald-200 bg-emerald-50 text-emerald-700',
                          school.status === 'onboarding' &&
                            'border-orange-200 bg-orange-50 text-orange-700'
                        )}
                      >
                        {school.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Recent Activity */}
            <SectionCard
              title='Recent Activity'
              titleIcon='solar:history-duotone'
              description='Latest platform events'
              viewAllHref='/dashboard/audit'
            >
              <div className='space-y-3'>
                {[
                  {
                    action: 'New school registered',
                    details: 'Riverside Prep joined the platform',
                    time: '2 hours ago',
                    icon: 'solar:buildings-duotone'
                  },
                  {
                    action: 'System update deployed',
                    details: 'Version 2.5.1 successfully installed',
                    time: '5 hours ago',
                    icon: 'solar:refresh-circle-duotone'
                  },
                  {
                    action: 'User role updated',
                    details: 'Admin permissions changed for John Doe',
                    time: '1 day ago',
                    icon: 'solar:user-check-duotone'
                  }
                ].map((item, i) => (
                  <ListItem
                    key={i}
                    icon={item.icon}
                    iconClassName='text-primary bg-primary/10'
                    title={item.action}
                    subtitle={item.details}
                    meta={item.time}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className='space-y-8'>
            {/* System Alerts */}
            <SectionCard
              title='System Alerts'
              titleIcon='solar:bell-bing-duotone'
              viewAllHref='/dashboard/alerts'
            >
              <div className='space-y-3'>
                {MOCK_ALERTS.map((alert) => {
                  const iconData = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3',
                        alert.type === 'critical' && 'border-red-200 bg-red-50',
                        alert.type === 'warning' &&
                          'border-orange-200 bg-orange-50',
                        alert.type === 'info' && 'border-blue-200 bg-blue-50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-8 flex-shrink-0 items-center justify-center rounded-lg',
                          iconData.color
                        )}
                      >
                        <Icon icon={iconData.icon} className='size-4' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium'>{alert.message}</p>
                        <p className='text-muted-foreground mt-1 text-xs'>
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title='Quick Actions' titleIcon='solar:bolt-duotone'>
              <QuickActionGrid actions={QUICK_ACTIONS} />
            </SectionCard>

            {/* Resource Usage */}
            <SectionCard
              title='Resource Usage'
              titleIcon='solar:server-square-duotone'
            >
              <div className='space-y-4'>
                {[
                  { label: 'CPU Usage', value: 45, color: 'bg-blue-500' },
                  { label: 'Memory', value: 68, color: 'bg-violet-500' },
                  { label: 'Storage', value: 32, color: 'bg-emerald-500' },
                  { label: 'Bandwidth', value: 78, color: 'bg-orange-500' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className='mb-1 flex justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        {item.label}
                      </span>
                      <span className='font-medium'>{item.value}%</span>
                    </div>
                    <Progress
                      value={item.value}
                      className={cn('h-2', `[&>div]:${item.color}`)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Subscription Summary */}
            <SectionCard
              title='Subscriptions'
              titleIcon='solar:tag-price-duotone'
            >
              <div className='space-y-3'>
                {[
                  {
                    plan: 'Enterprise',
                    count: 2,
                    color: 'bg-violet-100 text-violet-700'
                  },
                  {
                    plan: 'Premium',
                    count: 5,
                    color: 'bg-blue-100 text-blue-700'
                  },
                  {
                    plan: 'Standard',
                    count: 5,
                    color: 'bg-muted text-muted-foreground'
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    className='bg-muted/50 flex items-center justify-between rounded-lg p-3'
                  >
                    <Badge className={item.color}>{item.plan}</Badge>
                    <span className='font-bold'>{item.count} schools</span>
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
