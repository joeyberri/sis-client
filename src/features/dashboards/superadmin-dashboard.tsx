'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Building2, Users, TrendingUp, AlertTriangle, Activity, Settings } from 'lucide-react';

interface SuperAdminDashboardStats {
  totalSchools: number;
  activeUsers: number;
  totalStudents: number;
  systemHealth: number;
  uptime: number;
  criticalAlerts: number;
}

export default function SuperAdminDashboard() {
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
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to fetch superadmin dashboard:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your system overview..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your system overview..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">System Administration Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform-wide overview and management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Schools Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Enrolled Schools</p>
                  <p className="text-3xl font-bold">{stats.totalSchools}</p>
                  <p className="text-xs text-green-600 font-medium">↑ 5 new this quarter</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Across all schools</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Platform-wide</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">System Health</p>
                  <p className="text-3xl font-bold text-green-600">{stats.systemHealth}%</p>
                  <p className="text-xs text-green-600 font-medium">Excellent</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uptime Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Platform Uptime</p>
                  <p className="text-3xl font-bold">{stats.uptime}%</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Activity className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts Card */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{stats.criticalAlerts}</p>
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
            <CardDescription>Administrative management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Manage Schools</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">User Management</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Billing & Plans</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">System Settings</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Schools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recently Onboarded Schools</CardTitle>
            <CardDescription>Latest additions to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Springfield High School', students: 850, staff: 65, status: 'Active' },
                { name: 'Central Academy', students: 1200, staff: 90, status: 'Active' },
                { name: 'Westside International', students: 650, staff: 50, status: 'Onboarding' },
              ].map((school, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{school.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {school.students} students • {school.staff} staff
                    </p>
                  </div>
                  <Badge variant="outline">{school.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Alerts</CardTitle>
            <CardDescription>Important system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Warning', message: 'Database backup scheduled for tonight' },
                { type: 'Alert', message: 'API rate limiting detected on School #12' },
                { type: 'Info', message: 'System maintenance window next Sunday' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                  <div className="mt-1">
                    {alert.type === 'Alert' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    {alert.type === 'Warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    {alert.type === 'Info' && <Activity className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
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
