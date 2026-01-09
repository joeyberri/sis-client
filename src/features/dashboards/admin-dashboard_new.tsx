'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { LoadingState } from '@/components/empty-state';
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { StatsGrid } from '@/components/common';

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
        const res = await fetch('/api/analytics/admin-dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats({
            totalStudents: null,
            totalTeachers: null,
            totalClasses: null,
            activeAssessments: null,
            attendanceRate: null,
            pendingAlerts: null,
            error: 'Unable to load data'
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
          error: 'Failed to load dashboard data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <LoadingState
        title='Loading Dashboard...'
        description='Preparing your admin overview...'
      />
    );
  }

  if (!stats) {
    return (
      <LoadingState
        title='Loading Dashboard...'
        description='Preparing your admin overview...'
      />
    );
  }

  const dashboardStats = [
    {
      title: 'Total Students',
      value:
        typeof stats.totalStudents === 'number'
          ? stats.totalStudents.toLocaleString()
          : '—',
      description: 'Enrolled students',
      icon: <Users className='h-6 w-6 text-blue-600' />,
      trend: { value: 5.2, label: 'from last term' }
    },
    {
      title: 'Teaching Staff',
      value:
        typeof stats.totalTeachers === 'number'
          ? stats.totalTeachers.toLocaleString()
          : '—',
      description: 'Active teachers',
      icon: <GraduationCap className='h-6 w-6 text-purple-600' />,
      badge: { text: 'All active', variant: 'default' as const }
    },
    {
      title: 'Active Classes',
      value:
        typeof stats.totalClasses === 'number'
          ? stats.totalClasses.toLocaleString()
          : '—',
      description: 'Running classes',
      icon: <BookOpen className='h-6 w-6 text-green-600' />,
      badge: { text: 'Balanced', variant: 'secondary' as const }
    },
    {
      title: 'Active Assessments',
      value:
        typeof stats.activeAssessments === 'number'
          ? stats.activeAssessments
          : '—',
      description: 'Current term assessments',
      icon: <TrendingUp className='h-6 w-6 text-amber-600' />,
      badge: { text: 'This term', variant: 'outline' as const }
    },
    {
      title: 'Attendance Rate',
      value:
        typeof stats.attendanceRate === 'number'
          ? `${stats.attendanceRate}%`
          : '—',
      description: 'Average attendance',
      icon: <Users className='h-6 w-6 text-indigo-600' />,
      trend: { value: 2.1, label: 'from last month' }
    },
    {
      title: 'Pending Alerts',
      value:
        typeof stats.pendingAlerts === 'number' ? stats.pendingAlerts : '—',
      description: 'Require attention',
      icon: <AlertTriangle className='h-6 w-6 text-red-600' />,
      badge:
        stats.pendingAlerts && stats.pendingAlerts > 0
          ? { text: 'Urgent', variant: 'destructive' as const }
          : undefined
    }
  ];

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>School Management Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              Overview of school operations and key metrics
            </p>
          </div>
          <button className='ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'>
            <Plus className='mr-2 h-4 w-4' />
            Quick Actions
          </button>
        </div>

        {/* Key Metrics */}
        <StatsGrid stats={dashboardStats} columns={3} />

        {/* Additional sections can be added here */}
        {stats.error && (
          <div className='border-destructive/50 rounded-lg border p-4'>
            <div className='flex'>
              <AlertTriangle className='text-destructive h-5 w-5' />
              <div className='ml-3'>
                <h3 className='text-destructive text-sm font-medium'>
                  Dashboard Error
                </h3>
                <div className='text-destructive/80 mt-2 text-sm'>
                  {stats.error}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
