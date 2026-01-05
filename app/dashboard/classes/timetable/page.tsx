'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

export default function TimetableBuilderPage() {
  const { isAdmin } = useUser();

  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getTimetables();
        setTimetables(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load timetables', err);
        setError('Failed to load timetables');
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
        <h1 className="text-3xl font-bold">Timetable Builder</h1>
        <Card>
          <CardHeader>
            <CardTitle>Timetable</CardTitle>
            <CardDescription>FullCalendar integration to build and publish schedules.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{timetables.length} timetable(s) available. Integrate FullCalendar in the next step.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
