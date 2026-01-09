'use client';

import { useEffect, useState } from 'react';
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
  ScheduleItem,
  QuickActionGrid,
  DashboardLoading
} from '@/components/dashboard/dashboard-primitives';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

interface CounselorDashboardStats {
  atRiskStudents: number;
  upcomingAppointments: number;
  completedInterventions: number;
  pendingFollowUps: number;
  studentsSeen: number;
  successRate: number;
}

const MOCK_STATS: CounselorDashboardStats = {
  atRiskStudents: 8,
  upcomingAppointments: 12,
  completedInterventions: 45,
  pendingFollowUps: 6,
  studentsSeen: 156,
  successRate: 87
};

const MOCK_AT_RISK_STUDENTS = [
  {
    id: '1',
    name: 'John Doe',
    grade: '10-A',
    reason: 'Low attendance',
    severity: 'high',
    status: 'in-progress',
    lastSeen: '2 days ago'
  },
  {
    id: '2',
    name: 'Jane Smith',
    grade: '9-B',
    reason: 'Academic decline',
    severity: 'high',
    status: 'new',
    lastSeen: 'Never'
  },
  {
    id: '3',
    name: 'Michael Brown',
    grade: '11-A',
    reason: 'Behavioral issues',
    severity: 'medium',
    status: 'follow-up',
    lastSeen: '1 week ago'
  },
  {
    id: '4',
    name: 'Emily Wilson',
    grade: '10-B',
    reason: 'Social difficulties',
    severity: 'medium',
    status: 'in-progress',
    lastSeen: '3 days ago'
  }
];

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    student: 'Sarah Johnson',
    type: 'Academic Planning',
    time: '10:00 AM',
    day: 'Today'
  },
  {
    id: '2',
    student: 'Robert Davis',
    type: 'Personal Counseling',
    time: '11:30 AM',
    day: 'Today'
  },
  {
    id: '3',
    student: 'Emily Wilson',
    type: 'Career Guidance',
    time: '2:00 PM',
    day: 'Today'
  },
  {
    id: '4',
    student: 'James Lee',
    type: 'Follow-up Session',
    time: '9:00 AM',
    day: 'Tomorrow'
  }
];

const QUICK_ACTIONS = [
  {
    icon: 'solar:calendar-add-duotone',
    label: 'Schedule Session',
    href: '/dashboard/appointments/new'
  },
  {
    icon: 'solar:danger-triangle-duotone',
    label: 'At-Risk Students',
    href: '/dashboard/students/at-risk'
  },
  {
    icon: 'solar:document-add-duotone',
    label: 'Add Notes',
    href: '/dashboard/notes'
  },
  {
    icon: 'solar:chart-2-duotone',
    label: 'View Reports',
    href: '/dashboard/reports'
  }
];

export default function CounselorDashboard() {
  const [stats, setStats] = useState<CounselorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/counselor-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(MOCK_STATS);
        }
      } catch (err) {
        console.error('Failed to fetch counselor dashboard:', err);
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
          icon='solar:heart-pulse-bold-duotone'
          title='Loading your counseling hub'
          description='Gathering student wellness data...'
        />
      </PageContainer>
    );
  }

  const data = stats || MOCK_STATS;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          badge: 'bg-red-100 text-red-700 border-red-200',
          dot: 'bg-red-500'
        };
      case 'medium':
        return {
          badge: 'bg-orange-100 text-orange-700 border-orange-200',
          dot: 'bg-orange-500'
        };
      case 'low':
        return {
          badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          dot: 'bg-yellow-500'
        };
      default:
        return {
          badge: 'bg-muted text-muted-foreground',
          dot: 'bg-muted-foreground'
        };
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'follow-up':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PageContainer scrollable>
      <div className='flex flex-col gap-8 pb-8'>
        {/* Hero Section */}
        <DashboardHero
          badge={{ icon: 'solar:heart-pulse-linear', text: 'Counselor Portal' }}
          title='Supporting Student Success'
          subtitle='Track at-risk students, manage interventions, and help students thrive academically and emotionally.'
          actions={[
            {
              label: 'View At-Risk',
              href: '/dashboard/students/at-risk',
              icon: 'solar:danger-triangle-duotone'
            },
            {
              label: 'Schedule Session',
              href: '/dashboard/appointments/new',
              icon: 'solar:calendar-add-duotone',
              variant: 'outline'
            }
          ]}
          backgroundIcon='solar:heart-pulse-bold-duotone'
        />

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <MetricCard
            icon='solar:danger-triangle-duotone'
            iconColor='text-red-600'
            iconBgColor='bg-red-100'
            value={data.atRiskStudents}
            label='At-Risk Students'
          />
          <MetricCard
            icon='solar:calendar-date-duotone'
            iconColor='text-blue-600'
            iconBgColor='bg-blue-100'
            value={data.upcomingAppointments}
            label='This Week'
          />
          <MetricCard
            icon='solar:clipboard-check-duotone'
            iconColor='text-orange-600'
            iconBgColor='bg-orange-100'
            value={data.pendingFollowUps}
            label='Follow-ups'
          />
          <MetricCard
            icon='solar:graph-up-duotone'
            iconColor='text-emerald-600'
            iconBgColor='bg-emerald-100'
            value={`${data.successRate}%`}
            label='Success Rate'
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='space-y-8 lg:col-span-2'>
            {/* At-Risk Students */}
            <SectionCard
              title='At-Risk Students'
              titleIcon='solar:danger-triangle-duotone'
              description='Students requiring immediate attention'
              viewAllHref='/dashboard/students/at-risk'
            >
              <div className='space-y-3'>
                {MOCK_AT_RISK_STUDENTS.map((student) => {
                  const severityStyles = getSeverityStyles(student.severity);
                  return (
                    <Card key={student.id} className='overflow-hidden'>
                      <div className={cn('h-1', severityStyles.dot)} />
                      <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div
                              className={cn(
                                'flex size-10 items-center justify-center rounded-full',
                                student.severity === 'high'
                                  ? 'bg-red-100'
                                  : 'bg-orange-100'
                              )}
                            >
                              <Icon
                                icon='solar:user-rounded-duotone'
                                className={cn(
                                  'size-5',
                                  student.severity === 'high'
                                    ? 'text-red-600'
                                    : 'text-orange-600'
                                )}
                              />
                            </div>
                            <div>
                              <h4 className='font-semibold'>{student.name}</h4>
                              <p className='text-muted-foreground text-xs'>
                                {student.grade} • {student.reason}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Badge className={severityStyles.badge}>
                              {student.severity.charAt(0).toUpperCase() +
                                student.severity.slice(1)}
                            </Badge>
                            <Badge
                              variant='outline'
                              className={getStatusStyles(student.status)}
                            >
                              {student.status === 'in-progress'
                                ? 'In Progress'
                                : student.status === 'follow-up'
                                  ? 'Follow-up'
                                  : 'New'}
                            </Badge>
                          </div>
                        </div>
                        <div className='text-muted-foreground mt-3 flex items-center justify-between text-xs'>
                          <span>Last session: {student.lastSeen}</span>
                          <button className='text-primary hover:underline'>
                            View Profile →
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </SectionCard>

            {/* Intervention Progress */}
            <SectionCard
              title='Intervention Progress'
              titleIcon='solar:target-duotone'
              description='Active intervention plans'
              viewAllHref='/dashboard/interventions'
            >
              <div className='space-y-4'>
                {[
                  {
                    student: 'John Doe',
                    plan: 'Academic Support',
                    progress: 65,
                    sessions: '6/10',
                    status: 'on-track'
                  },
                  {
                    student: 'Jane Smith',
                    plan: 'Social Integration',
                    progress: 30,
                    sessions: '2/8',
                    status: 'just-started'
                  },
                  {
                    student: 'Emily Wilson',
                    plan: 'Emotional Support',
                    progress: 85,
                    sessions: '8/10',
                    status: 'near-completion'
                  }
                ].map((item, i) => (
                  <div key={i} className='rounded-xl border p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium'>{item.student}</h4>
                        <p className='text-muted-foreground text-xs'>
                          {item.plan}
                        </p>
                      </div>
                      <Badge
                        variant='outline'
                        className={cn(
                          item.status === 'on-track' &&
                            'border-blue-200 bg-blue-50 text-blue-700',
                          item.status === 'just-started' &&
                            'border-violet-200 bg-violet-50 text-violet-700',
                          item.status === 'near-completion' &&
                            'border-emerald-200 bg-emerald-50 text-emerald-700'
                        )}
                      >
                        {item.sessions} sessions
                      </Badge>
                    </div>
                    <div className='space-y-1'>
                      <div className='flex justify-between text-xs'>
                        <span className='text-muted-foreground'>Progress</span>
                        <span className='font-medium'>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className='h-2' />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Recent Notes */}
            <SectionCard
              title='Recent Session Notes'
              titleIcon='solar:document-text-duotone'
              description='Latest counseling documentation'
              viewAllHref='/dashboard/notes'
            >
              <div className='space-y-3'>
                {[
                  {
                    student: 'Sarah Johnson',
                    type: 'Academic Planning',
                    excerpt: 'Discussed course selection for next semester...',
                    time: '2 hours ago'
                  },
                  {
                    student: 'Robert Davis',
                    type: 'Personal Counseling',
                    excerpt:
                      'Follow-up on family situation. Student showing improvement...',
                    time: '1 day ago'
                  },
                  {
                    student: 'Emily Wilson',
                    type: 'Career Guidance',
                    excerpt: 'Explored potential career paths in healthcare...',
                    time: '2 days ago'
                  }
                ].map((note, i) => (
                  <ListItem
                    key={i}
                    icon='solar:document-duotone'
                    iconClassName='text-violet-600 bg-violet-100'
                    title={note.student}
                    subtitle={note.type}
                    badge={{ text: note.time }}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className='space-y-8'>
            {/* Today's Appointments */}
            <SectionCard
              title="Today's Appointments"
              titleIcon='solar:calendar-date-duotone'
              viewAllHref='/dashboard/appointments'
            >
              <div className='space-y-3'>
                {MOCK_APPOINTMENTS.filter((a) => a.day === 'Today').map(
                  (apt) => (
                    <ScheduleItem
                      key={apt.id}
                      time={apt.time}
                      title={apt.student}
                      subtitle={apt.type}
                    />
                  )
                )}
              </div>
              <div className='mt-4 border-t pt-4'>
                <p className='text-muted-foreground mb-2 text-xs'>Tomorrow</p>
                {MOCK_APPOINTMENTS.filter((a) => a.day === 'Tomorrow').map(
                  (apt) => (
                    <ScheduleItem
                      key={apt.id}
                      time={apt.time}
                      title={apt.student}
                      subtitle={apt.type}
                    />
                  )
                )}
              </div>
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title='Quick Actions' titleIcon='solar:bolt-duotone'>
              <QuickActionGrid actions={QUICK_ACTIONS} />
            </SectionCard>

            {/* Metrics Overview */}
            <SectionCard title='This Term' titleIcon='solar:chart-2-duotone'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Students Seen
                  </span>
                  <span className='text-lg font-bold'>{data.studentsSeen}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Interventions
                  </span>
                  <span className='text-lg font-bold'>
                    {data.completedInterventions}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Success Rate
                  </span>
                  <span className='text-lg font-bold text-emerald-600'>
                    {data.successRate}%
                  </span>
                </div>
                <Progress value={data.successRate} className='h-2' />
              </div>
            </SectionCard>

            {/* Alerts */}
            <SectionCard
              title='Urgent Alerts'
              titleIcon='solar:bell-bing-duotone'
            >
              <div className='space-y-3'>
                {[
                  { message: 'New referral from Teacher', priority: 'high' },
                  {
                    message: 'Missed appointment follow-up',
                    priority: 'medium'
                  },
                  { message: 'Weekly report due tomorrow', priority: 'low' }
                ].map((alert, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3',
                      alert.priority === 'high' && 'border-red-200 bg-red-50',
                      alert.priority === 'medium' &&
                        'border-orange-200 bg-orange-50',
                      alert.priority === 'low' && 'border-blue-200 bg-blue-50'
                    )}
                  >
                    <Icon
                      icon='solar:bell-bing-duotone'
                      className={cn(
                        'size-4 flex-shrink-0',
                        alert.priority === 'high' && 'text-red-600',
                        alert.priority === 'medium' && 'text-orange-600',
                        alert.priority === 'low' && 'text-blue-600'
                      )}
                    />
                    <span className='text-sm'>{alert.message}</span>
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
