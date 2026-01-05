'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Users, TrendingUp, AlertTriangle, MessageSquare, Calendar, DollarSign } from 'lucide-react';

interface ParentDashboardStats {
  childrenCount: number;
  averageGPA: number;
  attendanceRate: number;
  pendingFees: number;
  upcomingEvents: number;
  unreadMessages: number;
}

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
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to fetch parent dashboard:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your parent portal..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your parent portal..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Parent Portal</h1>
          <p className="text-muted-foreground mt-1">Monitor your children's academic progress and school activities</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Children Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">My Children</p>
                  <p className="text-3xl font-bold">{stats.childrenCount}</p>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average GPA Card */}
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Average GPA</p>
                  <p className="text-3xl font-bold text-green-600">{stats.averageGPA}</p>
                  <p className="text-xs text-green-600 font-medium">Excellent performance</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
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
                  <p className="text-xs text-green-600 font-medium">Very good</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Fees Card */}
          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingFees}</p>
                  <p className="text-xs text-orange-600 font-medium">Action required</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">School Events</p>
                  <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                  <p className="text-3xl font-bold">{stats.unreadMessages}</p>
                  <p className="text-xs text-muted-foreground">From school</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">View Grades</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Pay Fees</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Message Teacher</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">View Reports</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Children Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Children</CardTitle>
            <CardDescription>Academic overview for each child</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', class: 'Class 10 A', gpa: 3.8, status: 'Excellent' },
                { name: 'Michael Johnson', class: 'Class 8 B', gpa: 3.5, status: 'Good' },
              ].map((child, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{child.class}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">{child.status}</Badge>
                    <p className="text-sm font-semibold mt-1">{child.gpa} GPA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
            <CardDescription>Important updates from school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Alert', message: 'School holiday schedule released' },
                { type: 'Grade', message: 'Math exam results available for review' },
                { type: 'Attendance', message: 'Attendance reminder: 2 classes missed this week' },
              ].map((notif, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                  <div className="mt-1">
                    {notif.type === 'Alert' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    {notif.type === 'Grade' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {notif.type === 'Attendance' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
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
