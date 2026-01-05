'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Users, BookOpen, GraduationCap, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

interface AdminDashboardStats {
  totalStudents: number | null;
  totalTeachers: number | null;
  totalClasses: number | null;
  activeAssessments: number | null;
  attendanceRate: number | null;
  pendingAlerts: number | null;
  error?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/admin-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats({
            totalStudents: null,
            totalTeachers: null,
            totalClasses: null,
            activeAssessments: null,
            attendanceRate: null,
            pendingAlerts: null,
            error: 'Unable to load data',
          });
        }
      } catch (err) {
        console.error('Failed to fetch admin dashboard:', err);
        setStats({
          totalStudents: null,
          totalTeachers: null,
          totalClasses: null,
          activeAssessments: null,
          attendanceRate: null,
          pendingAlerts: null,
          error: 'Failed to load dashboard data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your admin overview..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your admin overview..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">School Management Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of school operations and key metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Students Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{typeof stats.totalStudents === 'number' ? stats.totalStudents.toLocaleString() : '—'}</p>
                  <p className="text-xs text-green-600 font-medium">↑ 5.2% from last term</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Teaching Staff</p>
                  <p className="text-3xl font-bold">{typeof stats.totalTeachers === 'number' ? stats.totalTeachers.toLocaleString() : '—'}</p>
                  <p className="text-xs text-green-600 font-medium">All active</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                  <p className="text-3xl font-bold">{typeof stats.totalClasses === 'number' ? stats.totalClasses.toLocaleString() : '—'}</p>
                  <p className="text-xs text-green-600 font-medium">Balanced distribution</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessments Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Assessments</p>
                  <p className="text-3xl font-bold">{typeof stats.activeAssessments === 'number' ? stats.activeAssessments : '—'}</p>
                  <p className="text-xs text-amber-600 font-medium">This term</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-3xl font-bold">{typeof stats.attendanceRate === 'number' ? `${stats.attendanceRate}%` : '—'}</p>
                  <p className="text-xs text-green-600 font-medium">Excellent performance</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{typeof stats.pendingAlerts === 'number' ? stats.pendingAlerts : '0'}</p>
                  <p className="text-xs text-red-600 font-medium">Require attention</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button asChild variant="outline" className="justify-start h-auto py-3 px-4">
                <a href="/dashboard/students/enroll">
                  <Plus className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Enroll Student</p>
                  </div>
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start h-auto py-3 px-4">
                <a href="/dashboard/teachers">
                  <Plus className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Hire Teacher</p>
                  </div>
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start h-auto py-3 px-4">
                <a href="/dashboard/classes">
                  <Plus className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Create Class</p>
                  </div>
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start h-auto py-3 px-4">
                <a href="/dashboard/assessments/create">
                  <Plus className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Schedule Assessment</p>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
}
