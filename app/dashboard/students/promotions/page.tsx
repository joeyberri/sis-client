'use client';

import { useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

export default function PromotionsPage() {
  const { isAdmin } = useUser();
  const [running, setRunning] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [error, setError] = useState(null as string | null);
  const [message, setMessage] = useState(null as string | null);

  if (!isAdmin) return (
    <PageContainer>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Access Denied</h2>
        </div>
      </div>
    </PageContainer>
  );

  const handlePromoteAll = async () => {
    setRunning(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiClient.promoteStudents({ confirm: true });
      setMessage(res?.message || 'Promotion applied');
    } catch (err) {
      console.error('Promotion failed', err);
      setError('Promotion failed');
    } finally {
      setRunning(false);
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    setError(null);
    try {
      const res = await apiClient.promoteStudents({ preview: true });
      setPreview(Array.isArray(res) ? res : res?.students ?? []);
    } catch (err) {
      console.error('Promotion preview failed', err);
      setError('Promotion preview failed');
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-muted-foreground">Promote students to next grade or run targeted promotions.</p>
          </div>
          <Button onClick={handlePromoteAll} disabled={running}>{running ? 'Running...' : 'Run Promotion'}</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Promotions</CardTitle>
            <CardDescription>Bulk promote students (preview and confirm before applying).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Preview changes before applying promotions. The backend will return a preview list when available.</p>
              <div className="flex gap-2">
                <Button onClick={handlePreview} disabled={previewing}>{previewing ? 'Previewing…' : 'Preview'}</Button>
                <Button onClick={handlePromoteAll} disabled={running}>{running ? 'Running…' : 'Apply Promotions'}</Button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {message && <p className="text-sm text-success">{message}</p>}

              {preview && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Preview ({preview.length})</h3>
                  <ul className="mt-2 text-sm list-disc pl-5">
                    {preview.slice(0, 20).map((p: any, idx: number) => (
                      <li key={idx}>{p.name || p.studentId || JSON.stringify(p)}</li>
                    ))}
                  </ul>
                  {preview.length > 20 && <p className="text-xs text-muted-foreground">Showing first 20 preview rows</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
