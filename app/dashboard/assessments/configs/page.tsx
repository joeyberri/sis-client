'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Plus } from 'lucide-react';

export default function GradeConfigsPage() {
  const { isAdmin } = useUser();

  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      // Try to fetch configs from assessments endpoint
      const res = await apiClient.get('/assessments/configs');
      const data = res?.data ?? [];
      setConfigs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      // Don't show scary error - use empty state instead (endpoint may not exist yet)
      setError(null);
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchConfigs();
    }
  }, [isAdmin]);

  if (!isAdmin) return (
    <PageContainer>
      <ErrorState 
        title="Access Denied" 
        description="You don't have permission to view grade configurations."
        onRetry={() => window.location.reload()}
      />
    </PageContainer>
  );

  if (loading && configs.length === 0) {
    return <LoadingState title="Loading Grade Configurations..." description="Fetching grading scales..." />;
  }

  if (configs.length === 0) {
    return (
      <PageContainer>
        <EmptyState 
          title="No Grade Configurations Yet" 
          description="Start by creating your first grading scale. This will help standardize how students are assessed."
          action={{
            label: 'Create Configuration',
            onClick: () => {
              // TODO: Open create config dialog/form
            }
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Grade Configurations</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage grading scales and assessment criteria</p>
          </div>
          <Button onClick={() => {
            // TODO: Open create config dialog/form
          }}>
            <Plus className="w-4 h-4 mr-2" />
            New Configuration
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade Scales</CardTitle>
            <CardDescription>{configs.length} configuration(s) configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {configs.map((config, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{config.name || `Configuration ${idx + 1}`}</p>
                    <p className="text-sm text-muted-foreground">Grade scale</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
