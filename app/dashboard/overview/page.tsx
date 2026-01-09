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
import { Icon } from '@iconify/react';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { moduleColors } from '@/lib/module-colors';
import { Icons } from '@/components/icons';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendanceRate: number;
  pendingFees: number;
  activeAlerts: number;
  activeExams: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    status?: 'success' | 'warning' | 'error' | 'info';
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
        todayAttendanceRate: 98.2, // Mock for now until API is ready
        pendingFees: 12450,
        activeAlerts: 3,
        activeExams: 2,
        recentActivity: [
          {
            id: '1',
            type: 'student',
            message: 'New student enrolled in Grade 10-A',
            timestamp: '10 mins ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'attendance',
            message: 'Attendance report for Grade 8-C completed',
            timestamp: '45 mins ago',
            status: 'info'
          },
          {
            id: '3',
            type: 'fee',
            message: 'Payment failure for invoice #1204',
            timestamp: '2 hours ago',
            status: 'error'
          }
        ]
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
    icon: solarIcon,
    description,
    href,
    module = 'students',
    trend = 0
  }: {
    title: string;
    value: string | number;
    icon: string;
    description?: string;
    href?: string;
    module?: keyof typeof moduleColors;
    trend?: number;
  }) => {
    const colors = (moduleColors as any)[module] || moduleColors.students;

    const content = (
      <Card
        className={cn(
          'group bg-background relative overflow-hidden border-none transition-all duration-300 hover:shadow-lg',
          href ? 'cursor-pointer' : ''
        )}
      >
        <div
          className={cn(
            'absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]',
            colors.bgSolid
          )}
        />
        <CardContent className='p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <div
              className={cn('rounded-xl p-2.5 transition-colors', colors.bg)}
            >
              <Icon
                icon={solarIcon}
                className={cn('h-6 w-6', colors.primary)}
              />
            </div>
            {trend !== 0 && (
              <Badge
                variant='outline'
                className={cn(
                  'border-none px-2 font-medium',
                  trend > 0
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
                )}
              >
                {trend > 0 ? '+' : ''}
                {trend}%
              </Badge>
            )}
          </div>
          <div>
            <p className='text-muted-foreground mb-1 text-sm font-medium'>
              {title}
            </p>
            <div className='flex items-end gap-2'>
              <div className='text-3xl font-bold tracking-tight'>{value}</div>
              {description && (
                <p className='text-muted-foreground mb-1.5 text-xs'>
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        {href && (
          <div
            className={cn(
              'absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full',
              colors.bgSolid
            )}
          />
        )}
      </Card>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  };

  const getDashboardContent = () => {
    if (isAdmin) {
      return (
        <div className='animate-in fade-in space-y-8 duration-500'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              title='Total Students'
              value={stats?.totalStudents ?? 0}
              icon='solar:users-group-two-rounded-duotone'
              description='Active scholars'
              href='/dashboard/students'
              module='students'
              trend={12}
            />
            <StatCard
              title='Total Teachers'
              value={stats?.totalTeachers ?? 0}
              icon='solar:user-hand-up-duotone'
              description='Teaching staff'
              href='/dashboard/teachers'
              module='teachers'
              trend={4}
            />
            <StatCard
              title='Active Classes'
              value={stats?.totalClasses ?? 0}
              icon='solar:clapperboard-edit-duotone'
              description='Today'
              href='/dashboard/classes'
              module='classes'
            />
            <StatCard
              title='Attendance'
              value={
                stats?.todayAttendanceRate
                  ? `${stats.todayAttendanceRate}%`
                  : '—'
              }
              icon='solar:calendar-date-duotone'
              description='Daily check-in'
              href='/dashboard/attendance'
              module='attendance'
              trend={2}
            />
          </div>

          <div className='grid gap-8 lg:grid-cols-7'>
            {/* Main Content Area */}
            <div className='space-y-8 lg:col-span-4'>
              <Card className='from-background via-background to-primary/5 overflow-hidden border-none bg-gradient-to-br shadow-sm'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 text-primary rounded-lg p-2'>
                      <Icon icon='solar:history-duotone' className='h-5 w-5' />
                    </div>
                    <div>
                      <CardTitle className='text-xl'>System Audit</CardTitle>
                      <CardDescription>
                        Latest updates across the school infrastructure
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    asChild
                    className='rounded-full'
                  >
                    <Link
                      href='/dashboard/reports'
                      className='text-xs font-medium'
                    >
                      View all logs{' '}
                      <Icons.chevronRight className='ml-1 h-4 w-4' />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4 pt-2'>
                    {stats?.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className='group hover:bg-muted/50 hover:border-border flex items-center gap-4 rounded-xl border border-transparent p-3 transition-all'
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                            activity.status === 'success'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : activity.status === 'error'
                                ? 'bg-rose-500/10 text-rose-600'
                                : activity.status === 'warning'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-blue-500/10 text-blue-600'
                          )}
                        >
                          <Icon
                            icon={
                              activity.type === 'student'
                                ? 'solar:user-plus-duotone'
                                : activity.type === 'fee'
                                  ? 'solar:bill-list-duotone'
                                  : 'solar:notes-duotone'
                            }
                            className='h-5 w-5'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='group-hover:text-primary truncate text-sm font-semibold transition-colors'>
                            {activity.message}
                          </p>
                          <p className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                            <Icon
                              icon='solar:clock-circle-duotone'
                              className='h-3 w-3'
                            />
                            {activity.timestamp}
                          </p>
                        </div>
                        <Badge
                          variant='outline'
                          className='opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          Details
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className='grid gap-6 md:grid-cols-2'>
                <Card className='bg-background/50 border-none shadow-sm backdrop-blur-sm'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-muted-foreground text-sm font-semibold tracking-wider uppercase'>
                      Financial Health
                    </CardTitle>
                    <Icon
                      icon='solar:round-transfer-horizontal-duotone'
                      className='text-primary h-4 w-4'
                    />
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-end justify-between'>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-xs'>
                            Pending Collections
                          </p>
                          <p className='font-mono text-3xl font-bold tracking-tight'>
                            ${stats?.pendingFees.toLocaleString()}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='flex items-center justify-end text-xs font-bold text-rose-500'>
                            <Icon
                              icon='solar:graph-down-bold'
                              className='mr-1 h-3 w-3'
                            />
                            8.2%
                          </p>
                          <p className='text-muted-foreground text-[10px]'>
                            vs last month
                          </p>
                        </div>
                      </div>
                      <div className='bg-muted/50 h-2 w-full overflow-hidden rounded-full'>
                        <div className='bg-primary h-full w-3/4 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]'></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-background/50 border-none shadow-sm backdrop-blur-sm'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-muted-foreground text-sm font-semibold tracking-wider uppercase'>
                      Campus Density
                    </CardTitle>
                    <Icon
                      icon='solar:buildings-duotone'
                      className='h-4 w-4 text-emerald-500'
                    />
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-end justify-between'>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-xs'>
                            Active Capacity
                          </p>
                          <p className='font-mono text-3xl font-bold tracking-tight'>
                            {stats?.totalStudents}
                            <span className='text-muted-foreground text-sm font-normal'>
                              {' '}
                              / 1200
                            </span>
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='flex items-center justify-end text-xs font-bold text-emerald-500'>
                            <Icon
                              icon='solar:graph-up-bold'
                              className='mr-1 h-3 w-3'
                            />
                            14%
                          </p>
                          <p className='text-muted-foreground text-[10px]'>
                            availability
                          </p>
                        </div>
                      </div>
                      <div className='bg-muted/50 h-2 w-full overflow-hidden rounded-full'>
                        <div className='h-full w-[85%] rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar Content Area */}
            <div className='space-y-8 lg:col-span-3'>
              <Card className='border-none shadow-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Icon
                      icon='solar:calendar-minimalistic-duotone'
                      className='text-primary h-5 w-5'
                    />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='bg-muted/30 group hover:bg-muted/50 hover:border-border flex cursor-pointer items-center gap-4 rounded-2xl border border-transparent p-4 transition-all'>
                    <div className='bg-background text-primary border-border flex h-14 w-12 flex-col items-center justify-center rounded-xl border shadow-sm transition-transform group-hover:scale-105'>
                      <span className='text-[10px] font-black uppercase'>
                        Jan
                      </span>
                      <span className='text-xl leading-none font-black'>
                        15
                      </span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-bold'>Faculty Orientation</p>
                      <p className='text-muted-foreground text-xs'>
                        Main Auditorium • 09:00 AM
                      </p>
                    </div>
                    <Icon
                      icon='solar:alt-arrow-right-bold'
                      className='text-muted-foreground/0 group-hover:text-muted-foreground/100 mr-1 h-4 w-4 transition-all'
                    />
                  </div>
                  <div className='bg-primary/5 group hover:bg-primary/10 border-primary/10 flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all'>
                    <div className='bg-primary text-primary-foreground shadow-primary/20 flex h-14 w-12 flex-col items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105'>
                      <span className='text-[10px] font-black uppercase'>
                        Jan
                      </span>
                      <span className='text-xl leading-none font-black'>
                        22
                      </span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-primary text-sm font-bold'>
                        Math Finals (G12)
                      </p>
                      <p className='text-primary/70 text-xs'>
                        Block C • All Day
                      </p>
                    </div>
                    <Icon
                      icon='solar:star-bold-duotone'
                      className='text-primary h-5 w-5'
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className='group relative overflow-hidden border-none bg-slate-950 text-white shadow-md'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' />
                <Icon
                  icon='solar:cup-first-duotone'
                  className='absolute -right-6 -bottom-6 h-32 w-32 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12'
                />
                <CardHeader>
                  <Badge
                    variant='outline'
                    className='w-fit border-slate-800 text-[10px] font-bold tracking-widest text-slate-400 uppercase'
                  >
                    Performance
                  </Badge>
                  <CardTitle className='mt-2 text-xl'>
                    Global Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent className='relative space-y-6'>
                  <p className='text-sm leading-relaxed text-slate-400'>
                    The current cohort has achieved a{' '}
                    <span className='font-bold text-white'>98.2%</span> passing
                    rate. This is 4% higher than last academic year.
                  </p>
                  <div className='flex items-center gap-2 font-mono text-xs text-slate-500'>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className='bg-primary h-1 w-4 rounded-full'
                        />
                      ))}
                    </div>
                    <span>LIVE METRIC</span>
                  </div>
                  <Button
                    variant='secondary'
                    size='sm'
                    className='w-full bg-white font-bold text-slate-950 transition-colors hover:bg-slate-200'
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* System Health Widget */}
              <Card className='bg-muted/20 border-none shadow-sm'>
                <CardHeader className='px-4 py-3'>
                  <CardTitle className='text-muted-foreground flex items-center justify-between text-[10px] font-black tracking-[0.2em] uppercase'>
                    System Health
                    <span className='flex h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 px-4 pt-0 pb-4'>
                  <div className='flex items-center justify-between font-mono text-[11px]'>
                    <span className='text-muted-foreground'>SERVER UPTIME</span>
                    <span className='text-foreground'>99.98%</span>
                  </div>
                  <div className='flex items-center justify-between font-mono text-[11px]'>
                    <span className='text-muted-foreground'>LATENCY</span>
                    <span className='text-foreground'>42ms</span>
                  </div>
                  <div className='mt-2 grid grid-cols-4 gap-1'>
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-4 rounded-sm',
                          i > 8 ? 'bg-muted' : 'bg-emerald-500/40'
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (isTeacher) {
      return (
        <div className='animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500'>
          <div className='grid gap-6 md:grid-cols-3'>
            <StatCard
              title='Current Classes'
              value={stats?.totalClasses ?? 0}
              icon='solar:blackhole-duotone'
              href='/dashboard/classes'
              module='classes'
              description='Assigned courses'
            />
            <StatCard
              title='Total Students'
              value={stats?.totalStudents ?? 0}
              icon='solar:users-group-two-rounded-duotone'
              module='students'
              description='Under supervision'
            />
            <StatCard
              title='Attendance Rate'
              value='96.4%'
              icon='solar:verified-check-duotone'
              module='attendance'
              trend={2.1}
              description='Term average'
            />
          </div>

          <div className='grid gap-8 lg:grid-cols-12'>
            {/* Class Schedule and Attendance */}
            <div className='space-y-6 lg:col-span-8'>
              <Card className='bg-background overflow-hidden border-none shadow-sm'>
                <CardHeader className='flex flex-row items-center justify-between pb-4'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <Icon
                        icon='solar:calendar-mark-duotone'
                        className='text-primary h-5 w-5'
                      />
                      Class Schedule
                    </CardTitle>
                    <CardDescription>Your roadmap for today</CardDescription>
                  </div>
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/dashboard/classes/timetable'>
                      Full Timetable
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[
                      {
                        time: '08:30 AM',
                        class: 'Grade 10-A',
                        subject: 'Advanced Mathematics',
                        room: 'Room 302',
                        duration: '90m',
                        status: 'completed'
                      },
                      {
                        time: '10:15 AM',
                        class: 'Grade 11-B',
                        subject: 'Calculus I',
                        room: 'Lab 1',
                        duration: '60m',
                        status: 'in-progress'
                      },
                      {
                        time: '01:45 PM',
                        class: 'Grade 10-C',
                        subject: 'Geometry',
                        room: 'Room 304',
                        duration: '60m',
                        status: 'upcoming'
                      }
                    ].map((session, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-4 rounded-2xl border p-4 transition-all',
                          session.status === 'in-progress'
                            ? 'bg-primary/5 border-primary/20 shadow-sm'
                            : 'bg-muted/10 hover:border-border border-transparent'
                        )}
                      >
                        <div className='bg-background border-border flex size-14 flex-col items-center justify-center rounded-xl border text-center shadow-sm'>
                          <span className='text-muted-foreground text-[10px] font-bold uppercase'>
                            {session.time.split(' ')[1]}
                          </span>
                          <span className='text-sm leading-none font-bold'>
                            {session.time.split(' ')[0]}
                          </span>
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <h4 className='text-sm font-bold tracking-tight'>
                              {session.subject}
                            </h4>
                            {session.status === 'in-progress' && (
                              <Badge className='animate-pulse bg-emerald-500 text-[10px]'>
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <p className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
                            <span className='flex items-center gap-1'>
                              <Icon
                                icon='solar:users-group-rounded-duotone'
                                className='size-3'
                              />{' '}
                              {session.class}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Icon
                                icon='solar:map-point-duotone'
                                className='size-3'
                              />{' '}
                              {session.room}
                            </span>
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-muted-foreground text-[10px] font-bold uppercase'>
                            {session.duration}
                          </p>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8 rounded-full'
                          >
                            <Icon
                              icon='solar:menu-dots-bold'
                              className='size-4'
                            />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className='grid gap-6 md:grid-cols-2'>
                <Card className='from-background border-none bg-gradient-to-br to-amber-500/[0.05] shadow-sm'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-bold tracking-widest text-amber-600 uppercase'>
                      Action Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3'>
                      <Icon
                        icon='solar:danger-triangle-duotone'
                        className='size-5 text-amber-600'
                      />
                      <div className='flex-1'>
                        <p className='text-xs font-bold text-amber-900'>
                          3 Ungraded Assessments
                        </p>
                        <p className='text-[10px] text-amber-700'>
                          Due by end of week
                        </p>
                      </div>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-7 text-[10px] font-bold'
                      >
                        FIX
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className='from-background border-none bg-gradient-to-br to-blue-500/[0.05] shadow-sm'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-bold tracking-widest text-blue-600 uppercase'>
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-2 gap-2'>
                    <Button
                      variant='outline'
                      className='flex h-14 flex-col items-center justify-center gap-1 rounded-xl'
                      asChild
                    >
                      <Link href='/dashboard/attendance'>
                        <Icon
                          icon='solar:user-check-rounded-duotone'
                          className='size-4'
                        />
                        <span className='text-[10px] font-bold'>
                          Attendance
                        </span>
                      </Link>
                    </Button>
                    <Button
                      variant='outline'
                      className='flex h-14 flex-col items-center justify-center gap-1 rounded-xl'
                      asChild
                    >
                      <Link href='/dashboard/assessments/gradebook'>
                        <Icon
                          icon='solar:pen-new-square-duotone'
                          className='size-4'
                        />
                        <span className='text-[10px] font-bold'>Gradebook</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar Notifications & Suggestions */}
            <div className='space-y-6 lg:col-span-4'>
              <Card className='border-none shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-lg'>Student Insight</CardTitle>
                  <CardDescription>Attention recommended</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {[
                    {
                      name: 'Marcus Wong',
                      issue: 'Missing 3 assignments',
                      avatar: 'MW',
                      color: 'bg-rose-100 text-rose-600'
                    },
                    {
                      name: 'Sarah Jenkins',
                      issue: 'Attendance dropped 12%',
                      avatar: 'SJ',
                      color: 'bg-amber-100 text-amber-600'
                    }
                  ].map((insight, i) => (
                    <div
                      key={i}
                      className='hover:bg-muted/50 flex items-center gap-3 rounded-xl p-3 transition-colors'
                    >
                      <div
                        className={cn(
                          'flex size-10 items-center justify-center rounded-full text-xs font-bold',
                          insight.color
                        )}
                      >
                        {insight.avatar}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-bold'>{insight.name}</p>
                        <p className='text-muted-foreground text-[10px] uppercase'>
                          {insight.issue}
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 rounded-full'
                      >
                        <Icon
                          icon='solar:chat-line-duotone'
                          className='size-4'
                        />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className='bg-primary text-primary-foreground group relative overflow-hidden border-none shadow-md'>
                <Icon
                  icon='solar:rocket-duotone'
                  className='absolute -right-4 -bottom-4 size-24 opacity-10 transition-transform group-hover:scale-110'
                />
                <CardHeader>
                  <CardTitle>AI Teacher Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-xs leading-relaxed opacity-80'>
                    I've analyzed Grade 10-A's performance. They are struggling
                    with Quadratic Equations. Should I generate a remedial
                    worksheet?
                  </p>
                  <Button
                    variant='secondary'
                    size='sm'
                    className='w-full font-bold'
                  >
                    Generate Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (isStudent) {
      return (
        <div className='animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500'>
          <div className='grid gap-6 md:grid-cols-4'>
            <StatCard
              title='Avg. Grade'
              value='A-'
              icon='solar:star-fall-duotone'
              module='dashboard'
              description='Term performance'
              trend={4.2}
            />
            <StatCard
              title='Attendance'
              value='98.5%'
              icon='solar:calendar-check-duotone'
              module='attendance'
            />
            <StatCard
              title='Courses'
              value='6'
              icon='solar:book-2-duotone'
              module='classes'
            />
            <StatCard
              title='Live Alerts'
              value='2'
              icon='solar:bell-bing-duotone'
              module='alerts'
              description='Unread notifications'
            />
          </div>

          <div className='grid gap-8 lg:grid-cols-12'>
            <div className='space-y-8 lg:col-span-8'>
              <Card className='from-background to-primary/5 border-none bg-gradient-to-br shadow-sm'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <div>
                    <CardTitle className='flex items-center gap-2 text-xl'>
                      <Icon
                        icon='solar:pen-new-square-duotone'
                        className='text-primary h-5 w-5'
                      />
                      Upcoming Assignments
                    </CardTitle>
                    <CardDescription>Don't fall behind!</CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs font-bold tracking-tighter uppercase'
                  >
                    View Calendar
                  </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {[
                    {
                      title: 'Calculus Problem Set 4',
                      subject: 'Mathematics',
                      due: 'Tomorrow, 11:59 PM',
                      urgency: 'high',
                      points: 100
                    },
                    {
                      title: 'The Great Gatsby Essay',
                      subject: 'English Literature',
                      due: 'Jan 18, 2026',
                      urgency: 'medium',
                      points: 50
                    },
                    {
                      title: 'Lab Report: Photosynthesis',
                      subject: 'Biology',
                      due: 'Jan 20, 2026',
                      urgency: 'low',
                      points: 25
                    }
                  ].map((task, i) => (
                    <div
                      key={i}
                      className='group bg-background border-border/50 hover:border-primary/30 relative flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-md'
                    >
                      <div
                        className={cn(
                          'absolute top-1/2 left-3 size-2 -translate-y-1/2 rounded-full',
                          task.urgency === 'high'
                            ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                            : task.urgency === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        )}
                      />
                      <div className='ml-4 min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <h4 className='group-hover:text-primary truncate text-sm font-bold transition-colors'>
                            {task.title}
                          </h4>
                          <Badge
                            variant='outline'
                            className='h-4 px-1.5 py-0 text-[9px] font-black uppercase'
                          >
                            {task.subject}
                          </Badge>
                        </div>
                        <p className='text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs font-medium'>
                          <Icon
                            icon='solar:clock-square-duotone'
                            className='text-muted-foreground/50 size-3'
                          />
                          Due: {task.due}
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='text-primary text-sm font-black'>
                          {task.points}
                        </div>
                        <div className='text-muted-foreground text-[10px] font-bold uppercase'>
                          PTS
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100'
                      >
                        <Icon
                          icon='solar:alt-arrow-right-bold'
                          className='size-4'
                        />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className='grid gap-6 md:grid-cols-2'>
                <Card className='overflow-hidden border-none bg-slate-900 text-white shadow-sm'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.2),transparent)]' />
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-bold tracking-widest text-blue-400 uppercase'>
                      Next Class
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='relative space-y-4'>
                    <div>
                      <h3 className='text-2xl font-black'>
                        Grade 11-B Calculus
                      </h3>
                      <p className='mt-1 flex items-center gap-2 text-xs text-slate-400'>
                        <Icon
                          icon='solar:map-point-duotone'
                          className='size-3'
                        />{' '}
                        Block C, Room 204
                      </p>
                    </div>
                    <div className='flex items-center justify-between pt-2'>
                      <div className='flex items-center gap-2'>
                        <div className='size-1.5 animate-pulse rounded-full bg-blue-500' />
                        <span className='font-mono text-[10px] text-blue-400'>
                          STARTS IN 15 MINS
                        </span>
                      </div>
                      <Button
                        size='sm'
                        className='h-8 rounded-full border-none bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-500'
                      >
                        JOIN ROOM
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-none shadow-sm'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-muted-foreground text-sm font-bold tracking-widest uppercase'>
                      My Library
                    </CardTitle>
                    <Icon
                      icon='solar:globus-duotone'
                      className='text-primary size-4'
                    />
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='bg-muted/30 flex items-center gap-3 rounded-xl p-3'>
                      <div className='bg-background border-border flex size-8 items-center justify-center rounded-lg border'>
                        <Icon
                          icon='solar:document-text-duotone'
                          className='text-muted-foreground size-4'
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs font-bold'>Bio Textbook Vol 2</p>
                        <p className='text-muted-foreground text-[10px]'>
                          Updated 2 days ago
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className='space-y-8 lg:col-span-4'>
              <Card className='overflow-hidden border-none shadow-sm'>
                <CardHeader>
                  <CardTitle>Attendance Streak</CardTitle>
                  <CardDescription>You are on fire! 🔥</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex h-12 justify-between gap-1'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex-1 rounded-sm',
                          i < 10
                            ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]'
                            : 'bg-muted'
                        )}
                      />
                    ))}
                  </div>
                  <div className='text-muted-foreground mt-2 flex justify-between text-[10px] font-bold uppercase'>
                    <span>Jan 1</span>
                    <span>JAN 12 (TODAY)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Icon icon='solar:cup-bold-duotone' className='size-5' />
                    Achiever Rank
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex items-center gap-4'>
                    <div className='flex size-16 rotate-3 items-center justify-center rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md transition-transform group-hover:rotate-0'>
                      <Icon
                        icon='solar:medal-ribbons-star-duotone'
                        className='size-10'
                      />
                    </div>
                    <div className='flex-1'>
                      <p className='text-2xl font-black'>
                        #4{' '}
                        <span className='text-xs font-normal opacity-70'>
                          on Leaderboard
                        </span>
                      </p>
                      <p className='mt-1 text-[10px] font-bold tracking-widest uppercase opacity-80'>
                        942 XP Gained
                      </p>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-xs font-bold'>
                      <span>Level 14</span>
                      <span>Next Level: 58 XP</span>
                    </div>
                    <div className='h-1.5 w-full overflow-hidden rounded-full bg-white/20'>
                      <div className='h-full w-3/4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (isParent) {
      return (
        <div className='animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500'>
          <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
            <div>
              <h2 className='text-2xl font-black tracking-tight'>
                Family Overview
              </h2>
              <p className='text-muted-foreground text-sm'>
                Monitoring 2 students in Redevise Academy
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='outline'
                className='bg-background rounded-full font-bold shadow-sm'
              >
                <Icon
                  icon='solar:chat-round-line-duotone'
                  className='text-primary mr-2 h-4 w-4'
                />
                Contact Teachers
              </Button>
            </div>
          </div>

          <div className='grid gap-8 lg:grid-cols-12'>
            {/* Left Column: Children Status */}
            <div className='space-y-8 lg:col-span-8'>
              {[
                {
                  name: 'Alex Thompson',
                  grade: 'Grade 10-A',
                  status: 'In Class (Room 302)',
                  performance: 'Excellent',
                  gpa: '3.8',
                  attendance: '98%',
                  avatar: 'AT',
                  color: 'from-blue-500/20 to-indigo-500/20'
                },
                {
                  name: 'Maya Thompson',
                  grade: 'Grade 7-C',
                  status: 'At Lunch',
                  performance: 'Good',
                  gpa: '3.2',
                  attendance: '94%',
                  avatar: 'MT',
                  color: 'from-emerald-500/20 to-teal-500/20'
                }
              ].map((child, i) => (
                <Card
                  key={i}
                  className='bg-background group overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-lg'
                >
                  <div
                    className={cn(
                      'h-1.5 w-full bg-gradient-to-r',
                      child.color.replace('from-', 'bg-').replace('to-', 'bg-')
                    )}
                  />
                  <CardContent className='p-6'>
                    <div className='flex flex-col items-start gap-6 md:flex-row md:items-center'>
                      <div className='flex flex-1 items-center gap-4'>
                        <div className='bg-muted border-border group-hover:bg-primary/5 group-hover:border-primary/20 flex size-16 items-center justify-center rounded-2xl border text-xl font-black transition-colors'>
                          {child.avatar}
                        </div>
                        <div>
                          <h3 className='text-xl font-black tracking-tight'>
                            {child.name}
                          </h3>
                          <p className='text-muted-foreground text-sm font-medium'>
                            {child.grade}
                          </p>
                          <div className='mt-2 flex items-center gap-2'>
                            <Badge
                              variant='outline'
                              className='h-5 border-none bg-emerald-50 text-[10px] text-emerald-600'
                            >
                              {child.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className='grid shrink-0 grid-cols-2 gap-8 md:gap-12 lg:grid-cols-3'>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-[10px] font-black tracking-wider uppercase'>
                            GPA
                          </p>
                          <p className='font-mono text-2xl font-black'>
                            {child.gpa}
                          </p>
                        </div>
                        <div className='space-y-1'>
                          <p className='text-muted-foreground text-[10px] font-black tracking-wider uppercase'>
                            ATTENDANCE
                          </p>
                          <p className='font-mono text-2xl font-black'>
                            {child.attendance}
                          </p>
                        </div>
                        <div className='hidden space-y-1 lg:block'>
                          <p className='text-muted-foreground text-[10px] font-black tracking-wider uppercase'>
                            OUTLOOK
                          </p>
                          <Badge className='bg-primary/10 text-primary border-none font-bold'>
                            {child.performance}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='hover:bg-muted rounded-full'
                        asChild
                      >
                        <Link href={`/dashboard/students/`}>
                          <Icon
                            icon='solar:arrow-right-up-bold-duotone'
                            className='text-muted-foreground/30 group-hover:text-primary size-6 transition-colors'
                          />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Column: Financial & Notifications */}
            <div className='space-y-8 lg:col-span-4'>
              <Card className='relative overflow-hidden border-none bg-slate-950 text-white shadow-sm'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.15),transparent)]' />
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <Icon
                      icon='solar:bill-list-duotone'
                      className='size-5 text-indigo-400'
                    />
                    Fees & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className='relative space-y-6'>
                  <div className='space-y-1'>
                    <p className='text-xs font-bold tracking-widest text-slate-400 uppercase'>
                      Amount Due
                    </p>
                    <p className='font-mono text-4xl font-black'>$1,240.50</p>
                    <p className='mt-1 text-[10px] font-bold text-rose-400 uppercase'>
                      DUE IN 4 DAYS
                    </p>
                  </div>
                  <Button className='h-12 w-full bg-white font-black text-slate-950 shadow-xl shadow-indigo-500/10 hover:bg-slate-200'>
                    PAY NOW
                  </Button>
                </CardContent>
              </Card>

              <Card className='h-full border-none shadow-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    Recent Feedback
                    <Badge variant='outline' className='h-5 text-[10px]'>
                      NEW
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {[
                    {
                      teacher: 'Mr. Harris',
                      student: 'Alex',
                      comment: 'Exceeded expectations in Physics quiz.',
                      date: 'Today'
                    },
                    {
                      teacher: 'Ms. Davila',
                      student: 'Maya',
                      comment: 'Reminder: Geography project due tomorrow.',
                      date: 'Yesterday'
                    }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className='bg-muted/20 border-border/50 rounded-xl border p-3 text-sm'
                    >
                      <div className='mb-1 flex items-center justify-between'>
                        <span className='text-primary text-xs font-bold'>
                          {item.teacher}
                        </span>
                        <span className='text-muted-foreground font-mono text-[10px]'>
                          {item.date}
                        </span>
                      </div>
                      <p className='text-sm leading-relaxed font-medium italic'>
                        "{item.comment}"
                      </p>
                      <p className='text-muted-foreground mt-2 text-[10px] font-bold tracking-tighter uppercase'>
                        Subject: {item.student}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
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
