'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Users, AlertTriangle, Target, TrendingUp, Calendar, MessageSquare } from 'lucide-react';

interface CounselorDashboardStats {
  atRiskStudents: number;
  upcomingAppointments: number;
  completedInterventions: number;
  pendingFollowUps: number;
  studentsSeen: number;
  successRate: number;
}

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
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to fetch counselor dashboard:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your counseling overview..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your counseling overview..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Counselor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track at-risk students, interventions, and student wellness</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* At-Risk Students */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">At-Risk Students</p>
                  <p className="text-3xl font-bold text-red-600">{stats.atRiskStudents}</p>
                  <p className="text-xs text-red-600 font-medium">Require intervention</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Appointments This Week</p>
                  <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Follow-ups */}
          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Follow-ups</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingFollowUps}</p>
                  <p className="text-xs text-orange-600 font-medium">Pending</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interventions Completed */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Interventions</p>
                  <p className="text-3xl font-bold">{stats.completedInterventions}</p>
                  <p className="text-xs text-muted-foreground">This term</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Seen */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Students Seen</p>
                  <p className="text-3xl font-bold">{stats.studentsSeen}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
                  <p className="text-xs text-green-600 font-medium">Positive outcomes</p>
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
            <CardDescription>Important counseling tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Schedule Appointment</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">View At-Risk Students</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">View Notes</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">At-Risk Students</CardTitle>
            <CardDescription>Students requiring immediate intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'John Doe', reason: 'Low attendance', severity: 'High', status: 'In Progress' },
                { name: 'Jane Smith', reason: 'Academic decline', severity: 'High', status: 'New' },
                { name: 'Michael Brown', reason: 'Behavioral issues', severity: 'Medium', status: 'Follow-up' },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={student.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {student.severity}
                    </Badge>
                    <Badge variant="outline">{student.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Week's Appointments</CardTitle>
            <CardDescription>Scheduled counseling sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: 'Sarah Johnson', time: 'Monday 2:00 PM', type: 'Academic Planning' },
                { student: 'Robert Davis', time: 'Tuesday 10:00 AM', type: 'Personal Counseling' },
                { student: 'Emily Wilson', time: 'Wednesday 3:30 PM', type: 'Career Guidance' },
              ].map((apt, i) => (
                <div key={i} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{apt.student}</p>
                    <p className="text-xs text-muted-foreground">{apt.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.time}</p>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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
