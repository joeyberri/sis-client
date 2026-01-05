'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Users, Clock, FileText, TrendingUp, AlertTriangle, Plus } from 'lucide-react';

interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  pendingGradingCount: number;
  averageClassSize: number;
  upcomingClasses: number;
}

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
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to fetch teacher dashboard:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your teaching overview..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your teaching overview..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome to Your Teaching Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage classes, grade assignments, and track student progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Classes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">My Classes</p>
                  <p className="text-3xl font-bold">{stats.totalClasses}</p>
                  <p className="text-xs text-muted-foreground">Active this term</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Avg {stats.averageClassSize} per class</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Grading Card */}
          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Grading</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingGradingCount}</p>
                  <p className="text-xs text-orange-600 font-medium">Assignments to grade</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Assignments Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Assignments</p>
                  <p className="text-3xl font-bold">{stats.pendingAssignments}</p>
                  <p className="text-xs text-muted-foreground">Currently assigned</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Classes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                  <p className="text-3xl font-bold">{stats.upcomingClasses}</p>
                  <p className="text-xs text-muted-foreground">Scheduled today</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Class Average</p>
                  <p className="text-3xl font-bold">82%</p>
                  <p className="text-xs text-green-600 font-medium">Above school average</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <Plus className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <p className="font-medium text-sm">Create Assignment</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <Plus className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <p className="font-medium text-sm">Grade Submissions</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <Plus className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <p className="font-medium text-sm">Message Class</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <Plus className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <p className="font-medium text-sm">View Gradebook</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>Upcoming classes and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Mathematics - Class 10A', time: '09:00 AM', students: 32 },
                { name: 'Physics - Class 10B', time: '11:30 AM', students: 28 },
                { name: 'Mathematics - Class 9A', time: '02:00 PM', students: 30 },
              ].map((cls, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">{cls.students} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{cls.time}</p>
                    <Button variant="ghost" size="sm">
                      Enter Class
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Submissions</CardTitle>
              <CardDescription>Pending your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Student {i} - Assignment {i}</p>
                      <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
                    </div>
                    <Badge>Pending</Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 w-full">
                Grade All
              </Button>
            </CardContent>
          </Card>

          {/* Student Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Progress</CardTitle>
              <CardDescription>Performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'High Performers', count: 32, color: 'bg-green-100 text-green-800' },
                  { name: 'Average Performers', count: 78, color: 'bg-yellow-100 text-yellow-800' },
                  { name: 'Need Support', count: 18, color: 'bg-red-100 text-red-800' },
                ].map((group, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <p className="font-medium text-sm">{group.name}</p>
                    <Badge className={group.color}>{group.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
