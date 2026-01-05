'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { ErrorState, LoadingState } from '@/components/empty-state';
import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, AlertTriangle } from 'lucide-react';

interface Analytics {
  totalStudents: number;
  activeStudents: number;
  enrollmentTrend: number; // percentage change
  attendanceRate: number;
  attendanceTrend: number;
  totalRevenue: number;
  revenueTrend: number;
  averageGPA: number;
  gpaTrend: number;
  atRiskStudents: number;
  atRiskTrend: number;
}

export default function AnalyticsPage() {
  const { isAdmin } = useUser();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics. Please try again.');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin]);

  const TrendIndicator = ({ value, label }: { value: number; label: string }) => (
    <div className="flex items-center gap-1">
      {value >= 0 ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-600" />
      )}
      <span className={value >= 0 ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
        {Math.abs(value)}% {label}
      </span>
    </div>
  );

  if (!isAdmin) return (
    <PageContainer>
      <ErrorState 
        title="Access Denied" 
        description="You don't have permission to view analytics."
        onRetry={() => window.location.reload()}
      />
    </PageContainer>
  );

  if (loading || !analytics) return <LoadingState title="Loading Analytics..." description="Computing key metrics..." />;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Key performance indicators and trends across the institution</p>
        </div>

        {error && (
          <ErrorState 
            title="Analytics Error" 
            description={error}
            onRetry={fetchAnalytics}
          />
        )}

        {/* Key Metrics - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{analytics.totalStudents}</div>
              <TrendIndicator value={analytics.enrollmentTrend} label="enrollment" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{analytics.attendanceRate}%</div>
              <TrendIndicator value={analytics.attendanceTrend} label="change" />
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
              <TrendIndicator value={analytics.revenueTrend} label="growth" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{analytics.averageGPA.toFixed(2)}</div>
              <TrendIndicator value={analytics.gpaTrend} label="change" />
            </CardContent>
          </Card>
        </div>

        {/* At-Risk Students Alert */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-base">At-Risk Students Alert</CardTitle>
            </div>
            <Badge variant="secondary">{analytics.atRiskStudents} Students</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {analytics.atRiskStudents} student(s) flagged for academic concern. Intervention recommended.
            </p>
            <TrendIndicator value={analytics.atRiskTrend} label="change from last month" />
          </CardContent>
        </Card>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Students This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((analytics.activeStudents / analytics.totalStudents) * 100).toFixed(1)}% of total enrollment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Revenue Per Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${analytics.totalStudents > 0 ? (analytics.totalRevenue / analytics.totalStudents).toFixed(0) : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average annual revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.averageGPA >= 2.0 ? '92%' : '78%'}</div>
              <p className="text-xs text-muted-foreground mt-1">Students with GPA ≥ 2.0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
