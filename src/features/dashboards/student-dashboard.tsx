'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
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
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { useUser } from '@/context/user/user-context';

interface StudentDashboardStats {
  totalCourses: number;
  gpa: number;
  attendanceRate: number;
  pendingAssignments: number;
  submittedAssignments: number;
  upcomingExams: number;
}

interface Course {
  id: string;
  name: string;
  teacher: string;
  teacherAvatar?: string;
  grade: string;
  progress: number;
  nextClass?: string;
  color: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Color palette for courses
const COURSE_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600'
];

export default function StudentDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchAttempted = useRef(false);

  // Mock data for richer UI - will be replaced with API calls
  const courses: Course[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Mathematics',
        teacher: 'Mr. Smith',
        grade: 'A',
        progress: 85,
        nextClass: 'Today, 10:30 AM',
        color: COURSE_COLORS[0]
      },
      {
        id: '2',
        name: 'English Literature',
        teacher: 'Ms. Johnson',
        grade: 'A-',
        progress: 88,
        nextClass: 'Tomorrow, 9:00 AM',
        color: COURSE_COLORS[1]
      },
      {
        id: '3',
        name: 'Physics',
        teacher: 'Dr. Brown',
        grade: 'B+',
        progress: 82,
        nextClass: 'Today, 2:00 PM',
        color: COURSE_COLORS[2]
      },
      {
        id: '4',
        name: 'History',
        teacher: 'Prof. Wilson',
        grade: 'A',
        progress: 90,
        color: COURSE_COLORS[3]
      },
      {
        id: '5',
        name: 'Chemistry',
        teacher: 'Dr. Davis',
        grade: 'A-',
        progress: 87,
        color: COURSE_COLORS[4]
      },
      {
        id: '6',
        name: 'Physical Education',
        teacher: 'Coach Martin',
        grade: 'A',
        progress: 95,
        color: COURSE_COLORS[5]
      }
    ],
    []
  );

  const assignments: Assignment[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Algebra Problem Set',
        course: 'Mathematics',
        dueDate: addDays(new Date(), 2),
        status: 'pending',
        type: 'assignment'
      },
      {
        id: '2',
        title: 'Essay: The Great Gatsby',
        course: 'English Literature',
        dueDate: addDays(new Date(), 4),
        status: 'pending',
        type: 'assignment'
      },
      {
        id: '3',
        title: 'Lab Report: Friction',
        course: 'Physics',
        dueDate: addDays(new Date(), 1),
        status: 'pending',
        type: 'project'
      },
      {
        id: '4',
        title: 'Chapter 5 Quiz',
        course: 'Mathematics',
        dueDate: addDays(new Date(), 3),
        status: 'pending',
        type: 'quiz'
      },
      {
        id: '5',
        title: 'Mid-term Exam',
        course: 'History',
        dueDate: addDays(new Date(), 7),
        status: 'pending',
        type: 'exam'
      }
    ],
    []
  );

  const achievements: Achievement[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Perfect Attendance',
        description: 'Attended all classes for a month',
        earnedAt: new Date(),
        icon: 'solar:star-bold-duotone',
        rarity: 'rare'
      },
      {
        id: '2',
        title: 'Early Bird',
        description: 'Submitted 5 assignments before deadline',
        earnedAt: addDays(new Date(), -3),
        icon: 'solar:clock-circle-bold-duotone',
        rarity: 'common'
      },
      {
        id: '3',
        title: 'Math Wizard',
        description: 'Scored 100% on a math quiz',
        earnedAt: addDays(new Date(), -7),
        icon: 'solar:calculator-bold-duotone',
        rarity: 'epic'
      }
    ],
    []
  );

  useEffect(() => {
    if (fetchAttempted.current) return;

    const fetchStats = async () => {
      fetchAttempted.current = true;
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/student-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          // Fallback to mock data
          setStats({
            totalCourses: 6,
            gpa: 3.85,
            attendanceRate: 98,
            pendingAssignments: 5,
            submittedAssignments: 23,
            upcomingExams: 2
          });
        }
      } catch (err) {
        console.error('Failed to fetch student dashboard:', err);
        // Fallback to mock data
        setStats({
          totalCourses: 6,
          gpa: 3.85,
          attendanceRate: 98,
          pendingAssignments: 5,
          submittedAssignments: 23,
          upcomingExams: 2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getUrgencyColor = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date());
    if (days <= 1) return 'text-red-500 bg-red-50';
    if (days <= 3) return 'text-orange-500 bg-orange-50';
    return 'text-blue-500 bg-blue-50';
  };

  const getAssignmentIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'solar:notebook-bold-duotone';
      case 'exam':
        return 'solar:diploma-bold-duotone';
      case 'project':
        return 'solar:folder-with-files-bold-duotone';
      default:
        return 'solar:document-text-bold-duotone';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-amber-400 to-yellow-600 shadow-amber-200';
      case 'epic':
        return 'from-purple-500 to-pink-500 shadow-purple-200';
      case 'rare':
        return 'from-blue-500 to-cyan-500 shadow-blue-200';
      default:
        return 'from-gray-400 to-gray-500 shadow-gray-200';
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className='flex min-h-[60vh] items-center justify-center'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <div className='relative'>
              <div className='bg-primary/20 absolute inset-0 animate-ping rounded-full' />
              <div className='bg-primary/10 relative flex size-14 items-center justify-center rounded-full'>
                <Icon
                  icon='solar:book-2-bold-duotone'
                  className='text-primary size-7 animate-pulse'
                />
              </div>
            </div>
            <div className='space-y-1'>
              <h3 className='font-medium'>Loading your dashboard</h3>
              <p className='text-muted-foreground text-sm'>
                Preparing your academic overview...
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!stats) {
    return (
      <LoadingState
        title='Loading Dashboard...'
        description='Preparing your academic overview...'
      />
    );
  }

  return (
    <PageContainer>
      <div className='space-y-8'>
        {/* Hero Section with Greeting */}
        <div className='from-primary/10 via-primary/5 to-background relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 md:p-8'>
          <div className='absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-20'>
            <Icon
              icon='solar:diploma-bold-duotone'
              className='text-primary size-64'
            />
          </div>
          <div className='relative z-10'>
            <Badge className='bg-primary/10 text-primary hover:bg-primary/20 mb-3'>
              <Icon icon='solar:star-bold-duotone' className='mr-1 size-3' />
              Top 10% of your class
            </Badge>
            <h1 className='text-3xl font-bold md:text-4xl'>
              Hey there, {user?.firstName || 'Scholar'}! 👋
            </h1>
            <p className='text-muted-foreground mt-2 max-w-xl'>
              You're doing great this semester! Keep up the amazing work. You
              have {stats.pendingAssignments} assignments waiting and{' '}
              {stats.upcomingExams} exams coming up.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <Button asChild>
                <Link href='/dashboard/classes'>
                  <Icon
                    icon='solar:book-2-bold-duotone'
                    className='mr-2 size-4'
                  />
                  My Courses
                </Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href='/dashboard/assessments'>
                  <Icon
                    icon='solar:clipboard-check-bold-duotone'
                    className='mr-2 size-4'
                  />
                  View Assignments
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card className='relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-10'>
              <Icon
                icon='solar:graph-up-bold-duotone'
                className='size-16 text-emerald-500'
              />
            </div>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2'>
                <div className='flex size-10 items-center justify-center rounded-xl bg-emerald-100'>
                  <Icon
                    icon='solar:graph-up-bold-duotone'
                    className='size-5 text-emerald-600'
                  />
                </div>
                <div>
                  <p className='text-2xl font-bold text-emerald-600'>
                    {stats.gpa}
                  </p>
                  <p className='text-muted-foreground text-xs'>Current GPA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-10'>
              <Icon
                icon='solar:target-bold-duotone'
                className='size-16 text-blue-500'
              />
            </div>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2'>
                <div className='flex size-10 items-center justify-center rounded-xl bg-blue-100'>
                  <Icon
                    icon='solar:target-bold-duotone'
                    className='size-5 text-blue-600'
                  />
                </div>
                <div>
                  <p className='text-2xl font-bold text-blue-600'>
                    {stats.attendanceRate}%
                  </p>
                  <p className='text-muted-foreground text-xs'>Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-10'>
              <Icon
                icon='solar:clock-circle-bold-duotone'
                className='size-16 text-orange-500'
              />
            </div>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2'>
                <div className='flex size-10 items-center justify-center rounded-xl bg-orange-100'>
                  <Icon
                    icon='solar:clock-circle-bold-duotone'
                    className='size-5 text-orange-600'
                  />
                </div>
                <div>
                  <p className='text-2xl font-bold text-orange-600'>
                    {stats.pendingAssignments}
                  </p>
                  <p className='text-muted-foreground text-xs'>Pending Work</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-10'>
              <Icon
                icon='solar:diploma-bold-duotone'
                className='size-16 text-purple-500'
              />
            </div>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2'>
                <div className='flex size-10 items-center justify-center rounded-xl bg-purple-100'>
                  <Icon
                    icon='solar:diploma-bold-duotone'
                    className='size-5 text-purple-600'
                  />
                </div>
                <div>
                  <p className='text-2xl font-bold text-purple-600'>
                    {stats.upcomingExams}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Upcoming Exams
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left Column - Courses & Work */}
          <div className='space-y-6 lg:col-span-2'>
            {/* My Courses */}
            <Card>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <Icon
                        icon='solar:book-2-bold-duotone'
                        className='text-primary size-5'
                      />
                      My Courses
                    </CardTitle>
                    <CardDescription>
                      Your enrolled classes this semester
                    </CardDescription>
                  </div>
                  <Button variant='ghost' size='sm' asChild>
                    <Link href='/dashboard/classes'>
                      View All
                      <Icon
                        icon='solar:arrow-right-linear'
                        className='ml-1 size-4'
                      />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {courses.slice(0, 4).map((course) => (
                    <Link
                      key={course.id}
                      href={`/dashboard/classes/${course.id}`}
                      className='group hover:border-primary/50 relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md'
                    >
                      <div
                        className={cn(
                          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                          course.color
                        )}
                      />
                      <div className='space-y-3'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <h4 className='group-hover:text-primary font-semibold transition-colors'>
                              {course.name}
                            </h4>
                            <p className='text-muted-foreground text-xs'>
                              {course.teacher}
                            </p>
                          </div>
                          <Badge
                            variant='secondary'
                            className='bg-emerald-100 text-emerald-700'
                          >
                            {course.grade}
                          </Badge>
                        </div>
                        <div className='space-y-1'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-muted-foreground'>
                              Progress
                            </span>
                            <span className='font-medium'>
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} className='h-1.5' />
                        </div>
                        {course.nextClass && (
                          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                            <Icon
                              icon='solar:clock-circle-linear'
                              className='size-3'
                            />
                            Next: {course.nextClass}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Work */}
            <Card>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <Icon
                        icon='solar:clipboard-list-bold-duotone'
                        className='text-primary size-5'
                      />
                      Upcoming Work
                    </CardTitle>
                    <CardDescription>
                      Assignments and deadlines coming up
                    </CardDescription>
                  </div>
                  <Button variant='ghost' size='sm' asChild>
                    <Link href='/dashboard/assessments'>
                      View All
                      <Icon
                        icon='solar:arrow-right-linear'
                        className='ml-1 size-4'
                      />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {assignments.map((assignment) => {
                    const daysUntil = differenceInDays(
                      assignment.dueDate,
                      new Date()
                    );
                    const urgencyClass = getUrgencyColor(assignment.dueDate);

                    return (
                      <div
                        key={assignment.id}
                        className='hover:bg-accent/50 flex cursor-pointer items-center gap-4 rounded-xl border p-3 transition-colors'
                      >
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-xl',
                            urgencyClass
                          )}
                        >
                          <Icon
                            icon={getAssignmentIcon(assignment.type)}
                            className='size-5'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h4 className='truncate font-medium'>
                            {assignment.title}
                          </h4>
                          <p className='text-muted-foreground text-xs'>
                            {assignment.course}
                          </p>
                        </div>
                        <div className='text-right'>
                          <Badge
                            variant='outline'
                            className={cn('text-xs', urgencyClass)}
                          >
                            {daysUntil === 0
                              ? 'Today'
                              : daysUntil === 1
                                ? 'Tomorrow'
                                : `${daysUntil} days`}
                          </Badge>
                          <p className='text-muted-foreground mt-1 text-xs'>
                            {format(assignment.dueDate, 'MMM d')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Today's Schedule */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Icon
                    icon='solar:calendar-bold-duotone'
                    className='text-primary size-4'
                  />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    {
                      time: '8:30 AM',
                      subject: 'Mathematics',
                      room: 'Room 101'
                    },
                    { time: '10:30 AM', subject: 'Physics', room: 'Lab 2' },
                    { time: '12:00 PM', subject: 'Lunch Break', room: '' },
                    {
                      time: '1:30 PM',
                      subject: 'English Literature',
                      room: 'Room 205'
                    },
                    { time: '3:30 PM', subject: 'Chemistry', room: 'Lab 1' }
                  ].map((item, i) => (
                    <div key={i} className='flex items-center gap-3'>
                      <div className='text-muted-foreground w-16 text-xs'>
                        {item.time}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>{item.subject}</p>
                        {item.room && (
                          <p className='text-muted-foreground text-xs'>
                            {item.room}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Icon
                    icon='solar:cup-star-bold-duotone'
                    className='text-primary size-4'
                  />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className='hover:bg-accent/50 flex items-center gap-3 rounded-lg p-2 transition-colors'
                    >
                      <div
                        className={cn(
                          'flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-sm',
                          getRarityColor(achievement.rarity)
                        )}
                      >
                        <Icon
                          icon={achievement.icon}
                          className='size-5 text-white'
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>
                          {achievement.title}
                        </p>
                        <p className='text-muted-foreground truncate text-xs'>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant='ghost' size='sm' className='mt-3 w-full'>
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Icon
                    icon='solar:bolt-bold-duotone'
                    className='text-primary size-4'
                  />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-auto flex-col gap-1 py-3'
                  asChild
                >
                  <Link href='/dashboard/messages'>
                    <Icon
                      icon='solar:chat-round-dots-bold-duotone'
                      className='text-primary size-5'
                    />
                    <span className='text-xs'>Messages</span>
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-auto flex-col gap-1 py-3'
                  asChild
                >
                  <Link href='/dashboard/documents'>
                    <Icon
                      icon='solar:folder-2-bold-duotone'
                      className='text-primary size-5'
                    />
                    <span className='text-xs'>Resources</span>
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-auto flex-col gap-1 py-3'
                  asChild
                >
                  <Link href='/dashboard/calendar'>
                    <Icon
                      icon='solar:calendar-bold-duotone'
                      className='text-primary size-5'
                    />
                    <span className='text-xs'>Calendar</span>
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-auto flex-col gap-1 py-3'
                  asChild
                >
                  <Link href='/dashboard/support'>
                    <Icon
                      icon='solar:question-circle-bold-duotone'
                      className='text-primary size-5'
                    />
                    <span className='text-xs'>Help</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
