'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { BookOpen, FileText, Target, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface StudentDashboardStats {
  totalCourses: number;
  gpa: number;
  attendanceRate: number;
  pendingAssignments: number;
  submittedAssignments: number;
  upcomingExams: number;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/student-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to fetch student dashboard:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your academic overview..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your academic overview..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Your Academic Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your courses, assignments, and academic progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* GPA Card */}
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Your GPA</p>
                  <p className="text-3xl font-bold text-green-600">{stats.gpa}</p>
                  <p className="text-xs text-green-600 font-medium">Excellent performance</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                  <p className="text-xs text-muted-foreground">Currently enrolled</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <p className="text-3xl font-bold">{stats.attendanceRate}%</p>
                  <p className="text-xs text-green-600 font-medium">Perfect record</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Assignments Card */}
          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Work</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingAssignments}</p>
                  <p className="text-xs text-orange-600 font-medium">Due soon</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Work Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-3xl font-bold">{stats.submittedAssignments}</p>
                  <p className="text-xs text-muted-foreground">Assignments completed</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Exams</p>
                  <p className="text-3xl font-bold">{stats.upcomingExams}</p>
                  <p className="text-xs text-muted-foreground">This term</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Essential learning tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">View Courses</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">My Grades</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Submit Work</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Message Teacher</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Courses</CardTitle>
            <CardDescription>Active enrollments this term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Mathematics', teacher: 'Mr. Smith', grade: 'A', progress: 85 },
                { name: 'English Literature', teacher: 'Ms. Johnson', grade: 'A-', progress: 88 },
                { name: 'Physics', teacher: 'Dr. Brown', grade: 'B+', progress: 82 },
                { name: 'History', teacher: 'Prof. Wilson', grade: 'A', progress: 90 },
                { name: 'Chemistry', teacher: 'Dr. Davis', grade: 'A-', progress: 87 },
                { name: 'Physical Education', teacher: 'Coach Martin', grade: 'A', progress: 95 },
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.teacher}</p>
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <Badge className="bg-green-100 text-green-800">{course.grade}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">{course.progress}% done</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            <CardDescription>Important dates to remember</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'Math Assignment - Chapter 5', due: 'Dec 13, 2025' },
                { task: 'English Essay Submission', due: 'Dec 15, 2025' },
                { task: 'Physics Lab Report', due: 'Dec 17, 2025' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{item.task}</p>
                    <p className="text-xs text-muted-foreground">Due {item.due}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
