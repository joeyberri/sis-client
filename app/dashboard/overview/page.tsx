'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BookOpen,
  Clock,
  ChevronRight
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import Link from 'next/link';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendanceRate: number;
  pendingFees: number;
  activeAlerts: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function DashboardOverview() {
  const { user, role, isAdmin, isTeacher, isStudent, isParent } = useUser();
  const { getToken } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Set auth token
  useEffect(() => {
    const setToken = async () => {
      const token = await getToken();
      if (token) {
        apiClient.setAuthToken(token);
      }
    };
    setToken();
  }, [getToken]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch real data from multiple endpoints
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        apiClient.getStudents().catch(() => ({ data: [] })),
        apiClient.getTeachers().catch(() => ({ data: [] })),
        apiClient.getClassesList().catch(() => ({ data: [] }))
      ]);

      const totalStudents = studentsRes.data?.length || 0;
      const totalTeachers = teachersRes.data?.length || 0;
      const totalClasses = classesRes.data?.length || 0;

      setStats({
        totalStudents,
        totalTeachers,
        totalClasses,
        todayAttendanceRate: 0, // Will be calculated from attendance API
        pendingFees: 0,
        activeAlerts: 0,
        recentActivity: []
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    href
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    href?: string;
  }) => {
    const content = (
      <Card
        className={
          href ? 'hover:bg-muted/50 cursor-pointer transition-colors' : ''
        }
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Icon className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className='h-8 w-20' />
          ) : (
            <>
              <div className='text-2xl font-bold'>{value}</div>
              {description && (
                <p className='text-muted-foreground text-xs'>{description}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  };

  const getDashboardContent = () => {
    if (isAdmin) {
      return (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
            <Badge variant='secondary'>School Administration</Badge>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              title='Total Students'
              value={stats?.totalStudents ?? 0}
              icon={Users}
              description='Enrolled students'
              href='/dashboard/students'
            />
            <StatCard
              title='Total Teachers'
              value={stats?.totalTeachers ?? 0}
              icon={GraduationCap}
              description='Teaching staff'
              href='/dashboard/teachers'
            />
            <StatCard
              title='Active Classes'
              value={stats?.totalClasses ?? 0}
              icon={BookOpen}
              description='Current term'
              href='/dashboard/classes'
            />
            <StatCard
              title='Attendance Today'
              value={
                stats?.todayAttendanceRate
                  ? `${stats.todayAttendanceRate}%`
                  : '—'
              }
              icon={Calendar}
              description='Mark attendance'
              href='/dashboard/attendance'
            />
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Link href='/dashboard/students'>
                  <Button className='w-full justify-start' variant='outline'>
                    <Users className='mr-2 h-4 w-4' />
                    Manage Students
                    <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </Link>
                <Link href='/dashboard/classes'>
                  <Button className='w-full justify-start' variant='outline'>
                    <GraduationCap className='mr-2 h-4 w-4' />
                    Manage Classes
                    <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </Link>
                <Link href='/dashboard/classes/enrollment'>
                  <Button className='w-full justify-start' variant='outline'>
                    <Users className='mr-2 h-4 w-4' />
                    Manage Enrollment
                    <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </Link>
                <Link href='/dashboard/attendance'>
                  <Button className='w-full justify-start' variant='outline'>
                    <Calendar className='mr-2 h-4 w-4' />
                    Mark Attendance
                    <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </Link>
                <Link href='/dashboard/fees'>
                  <Button className='w-full justify-start' variant='outline'>
                    <DollarSign className='mr-2 h-4 w-4' />
                    Fee Management
                    <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current school overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <div className='h-2 w-2 rounded-full bg-green-500'></div>
                      <span className='text-sm'>Students enrolled</span>
                    </div>
                    <span className='font-semibold'>
                      {stats?.totalStudents ?? 0}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                      <span className='text-sm'>Teachers on staff</span>
                    </div>
                    <span className='font-semibold'>
                      {stats?.totalTeachers ?? 0}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                      <span className='text-sm'>Active classes</span>
                    </div>
                    <span className='font-semibold'>
                      {stats?.totalClasses ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (isTeacher) {
      return (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Teacher Dashboard</h1>
            <Badge variant='secondary'>Teaching Staff</Badge>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            <StatCard
              title='My Classes'
              value={stats?.totalClasses ?? 0}
              icon={BookOpen}
              href='/dashboard/classes'
            />
            <StatCard
              title='Total Students'
              value={stats?.totalStudents ?? 0}
              icon={Users}
            />
            <StatCard
              title="Today's Schedule"
              value='View'
              icon={Clock}
              href='/dashboard/classes/timetable'
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Link href='/dashboard/attendance'>
                <Button className='w-full justify-start' variant='outline'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Mark Attendance
                  <ChevronRight className='ml-auto h-4 w-4' />
                </Button>
              </Link>
              <Link href='/dashboard/assessments/gradebook'>
                <Button className='w-full justify-start' variant='outline'>
                  <TrendingUp className='mr-2 h-4 w-4' />
                  Enter Grades
                  <ChevronRight className='ml-auto h-4 w-4' />
                </Button>
              </Link>
              <Link href='/dashboard/classes/timetable'>
                <Button className='w-full justify-start' variant='outline'>
                  <Clock className='mr-2 h-4 w-4' />
                  View Timetable
                  <ChevronRight className='ml-auto h-4 w-4' />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isStudent) {
      return (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Student Dashboard</h1>
            <Badge variant='secondary'>Student Portal</Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Your enrolled courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                View your enrolled classes, grades, and attendance.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isParent) {
      return (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Parent Dashboard</h1>
            <Badge variant='secondary'>Parent Portal</Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>My Children</CardTitle>
              <CardDescription>
                Monitor your children's progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                View your children's attendance, grades, and fee status.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <Badge variant='secondary'>{role}</Badge>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to SIS</CardTitle>
            <CardDescription>
              School Information System Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              Your role ({role}) dashboard is being configured. Please check
              back soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className='text-muted-foreground'>
            Here's what's happening in your school today.
          </p>
        </div>
      </div>

      {getDashboardContent()}
    </div>
  );
}
