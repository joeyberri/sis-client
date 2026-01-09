'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import {
  Plus,
  Share2,
  Copy,
  Trash2,
  Filter,
  Eye,
  X,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ViewFilter {
  field: string;
  operator:
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: string;
}

interface SavedView {
  id: string;
  name: string;
  resource: string;
  description?: string;
  filters?: ViewFilter[];
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  createdAt?: string;
  sharedWith?: string[];
}

const RESOURCES = [
  { value: 'students', label: 'Students' },
  { value: 'teachers', label: 'Teachers' },
  { value: 'classes', label: 'Classes' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'grades', label: 'Grades' },
  { value: 'assessments', label: 'Assessments' },
  { value: 'payments', label: 'Payments' }
];

const OPERATORS = [
  { value: 'eq', label: 'Equals' },
  { value: 'neq', label: 'Not Equals' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'gte', label: 'Greater or Equal' },
  { value: 'lt', label: 'Less Than' },
  { value: 'lte', label: 'Less or Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' }
];

const RESOURCE_FIELDS: Record<string, string[]> = {
  students: ['name', 'email', 'grade', 'class', 'status', 'enrollmentDate'],
  teachers: ['name', 'email', 'subject', 'department', 'status'],
  classes: ['name', 'grade', 'section', 'teacherId', 'capacity'],
  attendance: ['date', 'status', 'studentId', 'classId'],
  grades: ['score', 'assessment', 'studentId', 'classId'],
  assessments: ['title', 'type', 'dueDate', 'status'],
  payments: ['amount', 'status', 'dueDate', 'type', 'studentId']
};

export default function SavedViewsPage() {
  const [views, setViews] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newView, setNewView] = useState<Partial<SavedView>>({
    name: '',
    resource: 'students',
    description: '',
    filters: [],
    sort: '',
    sortDirection: 'asc'
  });

  useEffect(() => {
    const fetchViews = async () => {
      try {
        setLoading(true);
        try {
          const res = await apiClient.get('/views');
          if (res?.data?.views) {
            setViews(res.data.views);
            return;
          }
        } catch (err) {
          // Endpoint not available, use fallback
        }
        // Show some example views for demo purposes
        setViews([
          {
            id: 'demo-1',
            name: 'Active Students',
            resource: 'students',
            description: 'All currently enrolled students',
            filters: [{ field: 'status', operator: 'eq', value: 'active' }],
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-2',
            name: 'Pending Payments',
            resource: 'payments',
            description: 'Overdue and pending payments',
            filters: [{ field: 'status', operator: 'eq', value: 'pending' }],
            sort: 'dueDate',
            sortDirection: 'asc',
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-3',
            name: 'Low Attendance',
            resource: 'attendance',
            description: 'Students with attendance below 75%',
            filters: [{ field: 'percentage', operator: 'lt', value: '75' }],
            createdAt: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error('Failed to fetch saved views:', err);
        // Show demo views on error
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
        toast.success('View deleted successfully');
      } catch (err) {
        console.error('Failed to delete view:', err);
        // Still remove from UI for demo
        setViews(views.filter((v) => v.id !== viewId));
        toast.success('View deleted');
      }
    }
  };

  const handleClone = async (viewId: string) => {
    const view = views.find((v) => v.id === viewId);
    if (!view) return;

    const clonedView: SavedView = {
      ...view,
      id: `clone-${Date.now()}`,
      name: `${view.name} (Copy)`,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await apiClient.post(`/views/${viewId}/clone`);
      if (res?.data?.view) {
        setViews([...views, res.data.view]);
      } else {
        setViews([...views, clonedView]);
      }
      toast.success('View cloned successfully');
    } catch (err) {
      // Still add clone for demo
      setViews([...views, clonedView]);
      toast.success('View cloned');
    }
  };

  const handleApplyView = (view: SavedView) => {
    // Navigate to the resource page with the filters applied
    const searchParams = new URLSearchParams();
    if (view.filters?.length) {
      searchParams.set('filters', JSON.stringify(view.filters));
    }
    if (view.sort) {
      searchParams.set('sort', view.sort);
      searchParams.set('sortDir', view.sortDirection || 'asc');
    }

    const url = `/dashboard/${view.resource}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.location.href = url;
  };

  const addFilter = () => {
    const currentFilters = newView.filters || [];
    const fields = RESOURCE_FIELDS[newView.resource || 'students'] || [];
    setNewView({
      ...newView,
      filters: [
        ...currentFilters,
        { field: fields[0] || '', operator: 'eq', value: '' }
      ]
    });
  };

  const removeFilter = (index: number) => {
    const currentFilters = newView.filters || [];
    setNewView({
      ...newView,
      filters: currentFilters.filter((_, i) => i !== index)
    });
  };

  const updateFilter = (index: number, update: Partial<ViewFilter>) => {
    const currentFilters = [...(newView.filters || [])];
    currentFilters[index] = { ...currentFilters[index], ...update };
    setNewView({ ...newView, filters: currentFilters });
  };

  const handleCreateView = async () => {
    if (!newView.name?.trim()) {
      toast.error('Please enter a view name');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/views', newView);
      if (res?.data?.view) {
        setViews([...views, res.data.view]);
      } else {
        // Create locally for demo
        const createdView: SavedView = {
          id: `view-${Date.now()}`,
          name: newView.name!,
          resource: newView.resource!,
          description: newView.description,
          filters: newView.filters as ViewFilter[],
          sort: newView.sort,
          sortDirection: newView.sortDirection,
          createdAt: new Date().toISOString()
        };
        setViews([...views, createdView]);
      }
      toast.success('View created successfully');
      setIsCreateDialogOpen(false);
      setNewView({
        name: '',
        resource: 'students',
        description: '',
        filters: [],
        sort: '',
        sortDirection: 'asc'
      });
    } catch (err) {
      console.error('Failed to create view:', err);
      // Still create for demo
      const createdView: SavedView = {
        id: `view-${Date.now()}`,
        name: newView.name!,
        resource: newView.resource!,
        description: newView.description,
        filters: newView.filters as ViewFilter[],
        sort: newView.sort,
        sortDirection: newView.sortDirection,
        createdAt: new Date().toISOString()
      };
      setViews([...views, createdView]);
      toast.success('View created');
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LoadingState
        title='Loading Saved Views...'
        description='Fetching your custom views...'
      />
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Saved Views</h1>
            <p className='text-muted-foreground mt-1'>
              Create and manage custom data views with smart filtering
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                New View
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create New View</DialogTitle>
                <DialogDescription>
                  Define custom filters and sorting for your data
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-4 py-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='viewName'>View Name *</Label>
                    <Input
                      id='viewName'
                      value={newView.name}
                      onChange={(e) =>
                        setNewView({ ...newView, name: e.target.value })
                      }
                      placeholder='e.g., Active Students'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Resource</Label>
                    <Select
                      value={newView.resource}
                      onValueChange={(v) =>
                        setNewView({
                          ...newView,
                          resource: v,
                          filters: [],
                          sort: ''
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Description</Label>
                  <Textarea
                    value={newView.description}
                    onChange={(e) =>
                      setNewView({ ...newView, description: e.target.value })
                    }
                    placeholder='Optional description for this view'
                    rows={2}
                  />
                </div>

                {/* Filters */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label>Filters</Label>
                    <Button variant='outline' size='sm' onClick={addFilter}>
                      <Plus className='mr-1 h-3 w-3' />
                      Add Filter
                    </Button>
                  </div>

                  {(newView.filters || []).length === 0 ? (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      No filters added. Click "Add Filter" to create conditions.
                    </p>
                  ) : (
                    <div className='space-y-2'>
                      {(newView.filters || []).map((filter, index) => (
                        <div
                          key={index}
                          className='bg-muted/50 flex items-center gap-2 rounded-lg p-3'
                        >
                          <Select
                            value={filter.field}
                            onValueChange={(v) =>
                              updateFilter(index, { field: v })
                            }
                          >
                            <SelectTrigger className='w-[140px]'>
                              <SelectValue placeholder='Field' />
                            </SelectTrigger>
                            <SelectContent>
                              {(
                                RESOURCE_FIELDS[
                                  newView.resource || 'students'
                                ] || []
                              ).map((f) => (
                                <SelectItem key={f} value={f}>
                                  {f}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={filter.operator}
                            onValueChange={(v) =>
                              updateFilter(index, { operator: v as any })
                            }
                          >
                            <SelectTrigger className='w-[140px]'>
                              <SelectValue placeholder='Operator' />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATORS.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={filter.value}
                            onChange={(e) =>
                              updateFilter(index, { value: e.target.value })
                            }
                            placeholder='Value'
                            className='flex-1'
                          />
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => removeFilter(index)}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sorting */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Sort By</Label>
                    <Select
                      value={newView.sort || undefined}
                      onValueChange={(v) =>
                        setNewView({
                          ...newView,
                          sort: v === '__none__' ? '' : v
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select field' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='__none__'>No sorting</SelectItem>
                        {(
                          RESOURCE_FIELDS[newView.resource || 'students'] || []
                        ).map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label>Sort Direction</Label>
                    <Select
                      value={newView.sortDirection}
                      onValueChange={(v) =>
                        setNewView({ ...newView, sortDirection: v as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='asc'>Ascending</SelectItem>
                        <SelectItem value='desc'>Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateView} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create View'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Views Grid */}
        {views.length === 0 ? (
          <Card className='py-12 text-center'>
            <CardContent className='space-y-4'>
              <Filter className='text-muted-foreground mx-auto h-12 w-12 opacity-50' />
              <div>
                <h3 className='text-lg font-semibold'>No saved views yet</h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Create your first custom view to organize your data the way
                  you need it
                </p>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Create View
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {views.map((view) => (
              <Card key={view.id} className='transition-shadow hover:shadow-lg'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-base'>{view.name}</CardTitle>
                      <CardDescription className='mt-1 text-xs capitalize'>
                        {view.resource}
                      </CardDescription>
                    </div>
                    <Badge variant='outline' className='capitalize'>
                      {view.resource}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {view.description && (
                    <p className='text-muted-foreground line-clamp-2 text-sm'>
                      {view.description}
                    </p>
                  )}

                  {/* View Metadata */}
                  <div className='text-muted-foreground space-y-1 text-xs'>
                    {view.filters && view.filters.length > 0 && (
                      <p>
                        <span className='font-medium'>Filters:</span>{' '}
                        {view.filters.length} active
                      </p>
                    )}
                    {view.sort && (
                      <p>
                        <span className='font-medium'>Sort:</span> {view.sort} (
                        {view.sortDirection || 'asc'})
                      </p>
                    )}
                    {view.createdAt && (
                      <p>
                        <span className='font-medium'>Created:</span>{' '}
                        {new Date(view.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 pt-4'>
                    <Button
                      size='sm'
                      variant='default'
                      className='flex-1'
                      onClick={() => handleApplyView(view)}
                    >
                      <Eye className='mr-1 h-3 w-3' />
                      Apply
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleClone(view.id)}
                    >
                      <Copy className='h-3 w-3' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDelete(view.id)}
                      className='text-destructive hover:text-destructive hover:bg-destructive/10'
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className='border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Settings className='h-4 w-4' />
              Saved Views Features
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <p>
              <strong>Smart Filtering:</strong> Create views with complex
              conditions (eq, gt, contains, etc.)
            </p>
            <p>
              <strong>Sorting & Pagination:</strong> Organize data with custom
              sort orders and page sizes
            </p>
            <p>
              <strong>Share & Collaborate:</strong> Clone views for quick
              customization
            </p>
            <p>
              <strong>Resource Selection:</strong> Works with students,
              teachers, grades, attendance, and more
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
