'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { Plus, Share2, Copy, Trash2, Filter } from 'lucide-react';

interface SavedView {
  id: string;
  name: string;
  resource: string;
  description?: string;
  filters?: Record<string, any>;
  sort?: string;
  createdAt?: string;
  sharedWith?: string[];
}

export default function SavedViewsPage() {
  const [views, setViews] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/views');
        if (res?.data?.views) {
          setViews(res.data.views);
        } else {
          setViews([]);
        }
      } catch (err) {
        console.error('Failed to fetch saved views:', err);
        setViews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, []);

  const handleDelete = async (viewId: string) => {
    if (confirm('Are you sure you want to delete this view?')) {
      try {
        await apiClient.delete(`/views/${viewId}`);
        setViews(views.filter((v) => v.id !== viewId));
      } catch (err) {
        console.error('Failed to delete view:', err);
      }
    }
  };

  const handleClone = async (viewId: string) => {
    try {
      const res = await apiClient.post(`/views/${viewId}/clone`);
      if (res?.data?.view) {
        setViews([...views, res.data.view]);
      }
    } catch (err) {
      console.error('Failed to clone view:', err);
    }
  };

  if (loading) {
    return <LoadingState title="Loading Saved Views..." description="Fetching your custom views..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Saved Views</h1>
            <p className="text-muted-foreground mt-1">Create and manage custom data views with smart filtering</p>
          </div>
          <Button asChild>
            <a href="/dashboard/smart-query-example">
              <Plus className="w-4 h-4 mr-2" />
              New View
            </a>
          </Button>
        </div>

        {/* Views Grid */}
        {views.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <Filter className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-semibold text-lg">No saved views yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first custom view to organize your data the way you need it
                </p>
              </div>
              <Button asChild>
                <a href="/dashboard/smart-query-example">
                  <Plus className="w-4 h-4 mr-2" />
                  Create View
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {views.map((view) => (
              <Card key={view.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{view.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{view.resource}</CardDescription>
                    </div>
                    <Badge variant="outline">{view.resource}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {view.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{view.description}</p>
                  )}

                  {/* View Metadata */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {view.filters && (
                      <p>
                        <span className="font-medium">Filters:</span> {Object.keys(view.filters).length} active
                      </p>
                    )}
                    {view.sort && <p><span className="font-medium">Sort:</span> {view.sort}</p>}
                    {view.createdAt && (
                      <p>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(view.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleClone(view.id)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Clone
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(view.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">💡 Saved Views Features</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Smart Filtering:</strong> Create views with complex conditions (eq, gt, contains, etc.)
            </p>
            <p>
              <strong>Sorting & Pagination:</strong> Organize data with custom sort orders and page sizes
            </p>
            <p>
              <strong>Share & Collaborate:</strong> Generate share links or clone views for your team
            </p>
            <p>
              <strong>Resource Selection:</strong> Works with students, teachers, grades, and attendance records
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
