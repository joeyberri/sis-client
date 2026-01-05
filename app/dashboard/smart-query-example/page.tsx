'use client';

import { useEffect, useState } from 'react';
import { useSmartQuery, useSavedViews } from '@/hooks/use-smart-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';

/**
 * Example component demonstrating:
 * - Smart querying with filters
 * - Saving filters as reusable views
 * - Applying saved views
 */
export default function SmartQueryExample() {
  const { isAdmin } = useUser();
  const { data, total, loading, error, query } = useSmartQuery('students');
  const { views, listViews, createView, shareView } = useSavedViews('students');

  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewName, setViewName] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sharedLink, setSharedLink] = useState('');

  // Load saved views on mount
  useEffect(() => {
    listViews();
  }, []);

  // Build and apply current filter
  const applyFilter = async (grade?: string, status?: string) => {
    const whereClause = [];

    if (grade || filterGrade) {
      whereClause.push({
        field: 'grade',
        operator: 'eq',
        value: grade || filterGrade
      });
    }

    if (status || filterStatus) {
      whereClause.push({
        field: 'status',
        operator: 'eq',
        value: status || filterStatus
      });
    }

    await query({
      where: whereClause.length > 0 ? whereClause : undefined,
      orderBy: [{ field: 'name', direction: 'asc' }],
      limit: 50
    });
  };

  // Save current filter as a view
  const saveCurrentFilterAsView = async () => {
    if (!viewName) {
      alert('Please enter a view name');
      return;
    }

    const queryOptions: any = {
      orderBy: [{ field: 'name', direction: 'asc' }],
      limit: 50
    };

    if (filterGrade || filterStatus) {
      queryOptions.where = [];
      if (filterGrade) {
        queryOptions.where.push({
          field: 'grade',
          operator: 'eq',
          value: filterGrade
        });
      }
      if (filterStatus) {
        queryOptions.where.push({
          field: 'status',
          operator: 'eq',
          value: filterStatus
        });
      }
    }

    await createView(viewName, queryOptions, `Custom filter: grade=${filterGrade}, status=${filterStatus}`);
    setViewName('');
    await listViews();
    alert('View saved!');
  };

  // Share a saved view
  const handleShareView = async (viewId: string) => {
    const shared = await shareView(viewId, true);
    const link = `${window.location.origin}/shared-views/${shared.data.shareToken}`;
    setSharedLink(link);
    setShowShareOptions(false);
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <ErrorState title="Access Denied" description="Admin access required" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Student Directory with Smart Filters</h1>
          <p className="text-muted-foreground mt-1">
            Query, filter, save, and share student views with your team
          </p>
        </div>

        {/* Quick Filter Controls */}
        <div className="bg-card p-4 rounded-lg border space-y-4">
          <h3 className="font-semibold">Quick Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded"
              >
                <option value="">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={() => applyFilter()} className="flex-1">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterGrade('');
                  setFilterStatus('');
                  query({});
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Save Current Filter as View */}
        {(filterGrade || filterStatus) && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
            <h4 className="font-semibold text-blue-900">Save This Filter</h4>
            <p className="text-sm text-blue-800">
              Save your current filter as a reusable view to apply it later or share with colleagues
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 'Grade 10 Active Students'"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveCurrentFilterAsView} disabled={!viewName}>
                Save View
              </Button>
            </div>
          </div>
        )}

        {/* Saved Views */}
        {views.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Saved Views</h3>
            <div className="flex flex-wrap gap-2">
              {views.map((view) => (
                <div key={view.id} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => query(view.query)}
                  >
                    {view.name}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShareView(view.id)}
                  >
                    Share
                  </Button>
                </div>
              ))}
            </div>

            {sharedLink && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-900 break-all">{sharedLink}</p>
                <p className="text-xs text-green-700 mt-1">
                  Copy this link to share with team members
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingState
            title="Searching students..."
            description="Applying your filters..."
          />
        ) : error ? (
          <ErrorState
            title="Error Loading Students"
            description={error}
            onRetry={() => applyFilter()}
          />
        ) : data.length === 0 ? (
          <EmptyState
            title="No students found"
            description="Try adjusting your filters to see results"
            action={{
              label: 'Clear Filters',
              onClick: () => {
                setFilterGrade('');
                setFilterStatus('');
                query({});
              }
            }}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found <strong>{total}</strong> students matching your filters
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((student: any) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.grade || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === 'active' ? 'default' : 'secondary'}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.enrolledDate
                        ? new Date(student.enrolledDate).toLocaleDateString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
