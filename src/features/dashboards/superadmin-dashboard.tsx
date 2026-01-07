'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  Settings,
  HeadphonesIcon,
  CreditCard,
  UserCog,
  BarChart3,
  Shield,
  FileText
} from 'lucide-react';

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
          // Use fallback data for demonstration
          setStats({
            totalSchools: 12,
            activeUsers: 2450,
            totalStudents: 8500,
            systemHealth: 98,
            uptime: 99.9,
            criticalAlerts: 2,
            openTickets: 5,
            monthlyRevenue: 24500
          });
        }
      } catch (err) {
        console.error('Failed to fetch superadmin dashboard:', err);
        // Use fallback data
        setStats({
          totalSchools: 12,
          activeUsers: 2450,
          totalStudents: 8500,
          systemHealth: 98,
          uptime: 99.9,
          criticalAlerts: 2,
          openTickets: 5,
          monthlyRevenue: 24500
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <LoadingState
        title='Loading Dashboard...'
        description='Preparing your system overview...'
      />
    );
  }

  if (!stats) {
    return (
      <LoadingState
        title='Loading Dashboard...'
        description='Preparing your system overview...'
      />
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold'>
            System Administration Dashboard
          </h1>
          <p className='text-muted-foreground mt-1'>
            Platform-wide overview and management
          </p>
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Schools Card */}
          <Card className='transition-shadow hover:shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Enrolled Schools
                  </p>
                  <p className='text-3xl font-bold'>{stats.totalSchools}</p>
                  <p className='text-xs font-medium text-green-600'>
                    ↑ 5 new this quarter
                  </p>
                </div>
                <div className='rounded-lg bg-blue-100 p-3'>
                  <Building2 className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users Card */}
          <Card className='transition-shadow hover:shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Active Users
                  </p>
                  <p className='text-3xl font-bold'>
                    {stats.activeUsers.toLocaleString()}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Across all schools
                  </p>
                </div>
                <div className='rounded-lg bg-green-100 p-3'>
                  <Users className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students Card */}
          <Card className='transition-shadow hover:shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Students
                  </p>
                  <p className='text-3xl font-bold'>
                    {stats.totalStudents.toLocaleString()}
                  </p>
                  <p className='text-muted-foreground text-xs'>Platform-wide</p>
                </div>
                <div className='rounded-lg bg-purple-100 p-3'>
                  <Users className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card className='border-green-200 transition-shadow hover:shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm font-medium'>
                    System Health
                  </p>
                  <p className='text-3xl font-bold text-green-600'>
                    {stats.systemHealth}%
                  </p>
                  <p className='text-xs font-medium text-green-600'>
                    Excellent
                  </p>
                </div>
                <div className='rounded-lg bg-green-100 p-3'>
                  <Activity className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uptime Card */}
          <Card className='transition-shadow hover:shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Platform Uptime
                  </p>
                  <p className='text-3xl font-bold'>{stats.uptime}%</p>
                  <p className='text-muted-foreground text-xs'>Last 30 days</p>
                </div>
                <div className='rounded-lg bg-cyan-100 p-3'>
                  <Activity className='h-6 w-6 text-cyan-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts Card */}
          <Card className='border-red-200 transition-shadow hover:shadow-lg'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Critical Alerts
                  </p>
                  <p className='text-3xl font-bold text-red-600'>
                    {stats.criticalAlerts}
                  </p>
                  <p className='text-xs font-medium text-red-600'>
                    Require attention
                  </p>
                </div>
                <div className='rounded-lg bg-red-100 p-3'>
                  <AlertTriangle className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
              <Button
                variant='outline'
                className='h-auto justify-start px-4 py-4'
                onClick={() =>
                  router.push('/dashboard/superadmin-overview/schools')
                }
              >
                <Building2 className='mr-3 h-5 w-5 text-blue-600' />
                <div className='text-left'>
                  <p className='text-sm font-medium'>Manage Schools</p>
                  <p className='text-muted-foreground text-xs'>
                    View & manage all schools
                  </p>
                </div>
              </Button>
              <Button
                variant='outline'
                className='h-auto justify-start px-4 py-4'
                onClick={() =>
                  router.push('/dashboard/superadmin-overview/tickets')
                }
              >
                <HeadphonesIcon className='mr-3 h-5 w-5 text-purple-600' />
                <div className='text-left'>
                  <p className='text-sm font-medium'>Support Tickets</p>
                  <p className='text-muted-foreground text-xs'>
                    {stats.openTickets || 0} open tickets
                  </p>
                </div>
              </Button>
              <Button
                variant='outline'
                className='h-auto justify-start px-4 py-4'
                onClick={() =>
                  router.push('/dashboard/superadmin-overview/pricing')
                }
              >
                <CreditCard className='mr-3 h-5 w-5 text-green-600' />
                <div className='text-left'>
                  <p className='text-sm font-medium'>Pricing & Plans</p>
                  <p className='text-muted-foreground text-xs'>
                    Manage subscriptions
                  </p>
                </div>
              </Button>
              <Button
                variant='outline'
                className='h-auto justify-start px-4 py-4'
                onClick={() => router.push('/dashboard/settings')}
              >
                <Settings className='mr-3 h-5 w-5 text-gray-600' />
                <div className='text-left'>
                  <p className='text-sm font-medium'>System Settings</p>
                  <p className='text-muted-foreground text-xs'>
                    Platform configuration
                  </p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Schools */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>
              Recently Onboarded Schools
            </CardTitle>
            <CardDescription>Latest additions to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[
                {
                  name: 'Springfield High School',
                  students: 850,
                  staff: 65,
                  status: 'Active'
                },
                {
                  name: 'Central Academy',
                  students: 1200,
                  staff: 90,
                  status: 'Active'
                },
                {
                  name: 'Westside International',
                  students: 650,
                  staff: 50,
                  status: 'Onboarding'
                }
              ].map((school, i) => (
                <div
                  key={i}
                  className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3'
                >
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{school.name}</p>
                    <p className='text-muted-foreground text-xs'>
                      {school.students} students • {school.staff} staff
                    </p>
                  </div>
                  <Badge variant='outline'>{school.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>System Alerts</CardTitle>
            <CardDescription>Important system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[
                {
                  type: 'Warning',
                  message: 'Database backup scheduled for tonight'
                },
                {
                  type: 'Alert',
                  message: 'API rate limiting detected on School #12'
                },
                {
                  type: 'Info',
                  message: 'System maintenance window next Sunday'
                }
              ].map((alert, i) => (
                <div
                  key={i}
                  className='hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-3'
                >
                  <div className='mt-1'>
                    {alert.type === 'Alert' && (
                      <AlertTriangle className='h-4 w-4 text-red-500' />
                    )}
                    {alert.type === 'Warning' && (
                      <AlertTriangle className='h-4 w-4 text-yellow-500' />
                    )}
                    {alert.type === 'Info' && (
                      <Activity className='h-4 w-4 text-blue-500' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{alert.message}</p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      1 hour ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
