'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  weight?: number;
}

export default function AssessmentsIndex() {
  const { isAdmin } = useUser();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAssessments();
      setAssessments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load assessments', err);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant="error"
          title="Access Denied"
          description="You don't have permission to view assessment records. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title="Loading assessments..."
          description="Fetching your assessment records..."
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Failed to load assessments"
          description="We couldn't fetch your assessment records. Please check your connection and try again."
          onRetry={fetch}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assessments & Grading</h1>
            <p className="text-muted-foreground">Create assessments, manage grading configs and view gradebooks.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>

        {assessments.length === 0 ? (
          <EmptyState
            title="No assessments yet"
            description="Start by creating your first assessment to begin grading students."
            action={{
              label: 'Create Assessment',
              onClick: () => {
                // Navigate to create page
                window.location.href = '/dashboard/assessments/create';
              }
            }}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
              <CardDescription>A list of all assessments in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{assessments.length} assessment(s) found. Use the subpages to create assessments, edit grade configs, and view the gradebook.</p>
              <div className="mt-4 grid gap-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{assessment.title}</h4>
                      {assessment.weight && (
                        <p className="text-sm text-muted-foreground">Weight: {assessment.weight}%</p>
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
