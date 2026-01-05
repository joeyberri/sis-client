'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

export default function AssessmentsGradebook() {
  const { isAdmin, isTeacher } = useUser();

  const [classes, setClasses] = useState<any[]>([]);
  const [gradebook, setGradebook] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const cls = await apiClient.getClasses();
        setClasses(Array.isArray(cls) ? cls : []);
        if (Array.isArray(cls) && cls.length > 0) {
          try {
            const gb = await apiClient.getGradebook(cls[0].id);
            setGradebook(Array.isArray(gb) ? gb : []);
          } catch (e) {
            // gradebook may not be available for sample data
            setGradebook(null);
          }
        }
      } catch (err) {
        console.error('Failed to load gradebook data', err);
        setError('Failed to load gradebook data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!isAdmin && !isTeacher) return (
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gradebook Overview</h1>
            <p className="text-muted-foreground">Class-wise grade completion and snapshots.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gradebook</CardTitle>
            <CardDescription>View and export gradebook snapshots for classes.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{classes.length} class(es) found. {gradebook ? `${gradebook.length} grade entries loaded for first class.` : 'Gradebook not available yet.'}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
