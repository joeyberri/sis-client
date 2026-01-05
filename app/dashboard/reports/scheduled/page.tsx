'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

export default function ScheduledReportsPage() {
  const { isAdmin } = useUser();

  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getReports({ scheduled: true });
        setSchedules(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load scheduled reports', err);
        setError('Failed to load scheduled reports');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!isAdmin) return (
    <PageContainer>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Access Denied</h2>
        </div>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Scheduled Reports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Schedules</CardTitle>
            <CardDescription>Manage automatic report schedules and recipients.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{schedules.length} scheduled job(s). Use this page to manage recipients and cadence.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
