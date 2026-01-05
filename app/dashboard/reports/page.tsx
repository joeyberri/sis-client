'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ReportsIndex() {
  const { isAdmin } = useUser();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getReports();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load reports', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant="error"
          title="Access Denied"
          description="You don't have permission to view reports. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title="Loading reports..."
          description="Fetching your report records..."
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Failed to load reports"
          description="We couldn't fetch your report records. Please check your connection and try again."
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate report cards, schedule reports and export snapshots.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {reports.length === 0 ? (
          <EmptyState
            title="No reports yet"
            description="Create your first report to start generating student report cards."
            action={{
              label: 'Generate Report',
              onClick: () => {
                // Navigate to generate page
                window.location.href = '/dashboard/reports/create';
              }
            }}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Report Cards</CardTitle>
              <CardDescription>Available reports and scheduled jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{reports.length} report(s) configured. Use subpages for scheduled jobs and templates.</p>
              <div className="grid gap-4">
                {reports.map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{report.name || report.title || 'Unnamed Report'}</h4>
                      {report.type && (
                        <p className="text-sm text-muted-foreground">Type: {report.type}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
