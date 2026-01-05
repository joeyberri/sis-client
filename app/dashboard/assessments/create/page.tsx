'use client';

import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';

export default function CreateAssessmentPage() {
  const { isAdmin } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [weight, setWeight] = useState(0 as number);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await apiClient.createAssessment({ title, weight });
      // Navigate back to assessments index after success
      router.push('/dashboard/assessments');
    } catch (err) {
      console.error('Failed to create assessment', err);
      setError('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Assessment</h1>
            <p className="text-muted-foreground">Create a new assessment and configure grading weight.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Assessment</CardTitle>
            <CardDescription>Create a new assessment by filling the form below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Weight (%)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="mt-1 block w-full rounded-md border px-3 py-2"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="pt-2">
                <button disabled={loading} className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white">
                  {loading ? 'Creating…' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
