'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import apiClient from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { AlertCircle, Bell, Plus, Trash2, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  title: string;
  type: 'warning' | 'info' | 'critical' | 'success';
  message: string;
  createdAt: string;
  relatedTo?: string;
  read: boolean;
}

export default function AlertsPage() {
  const { isAdmin } = useUser();
  const { getToken } = useAuth();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [filterType, setFilterType] = useState('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteAlertId, setDeleteAlertId] = useState<string | null>(null);
  const [newAlert, setNewAlert] = useState({
    title: '',
    type: 'info' as 'warning' | 'info' | 'critical' | 'success',
    message: '',
    relatedTo: ''
  });

  // Set auth token
  useEffect(() => {
    const setToken = async () => {
      const token = await getToken();
      if (token) {
        apiClient.setAuthToken(token);
      }
    };
    setToken();
  }, [getToken]);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAlerts();
      setAlerts(Array.isArray(data) ? data : data?.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load alerts', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.message) {
      toast.error('Please fill in title and message');
      return;
    }

    try {
      await apiClient.createAlert(newAlert);
      toast.success('Alert created successfully');
      setCreateDialogOpen(false);
      setNewAlert({ title: '', type: 'info', message: '', relatedTo: '' });
      fetchAlerts();
    } catch (err) {
      console.error('Failed to create alert:', err);
      toast.error('Failed to create alert');
    }
  };

  const handleDeleteAlert = async () => {
    if (!deleteAlertId) return;

    try {
      await apiClient.deleteAlert(deleteAlertId);
      toast.success('Alert deleted');
      setDeleteAlertId(null);
      fetchAlerts();
    } catch (err) {
      console.error('Failed to delete alert:', err);
      toast.error('Failed to delete alert');
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await apiClient.markAlertAsRead(alertId);
      fetchAlerts();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const filteredAlerts = alerts.filter(
    (a) => filterType === 'all' || a.type === filterType
  );
  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.type === 'critical').length;

  const getAlertBadge = (type: string) => {
    const styles: { [key: string]: { variant: any; label: string } } = {
      critical: { variant: 'destructive', label: 'Critical' },
      warning: { variant: 'secondary', label: 'Warning' },
      info: { variant: 'outline', label: 'Info' },
      success: { variant: 'default', label: 'Success' }
    };
    const style = styles[type] || styles['info'];
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className='text-destructive h-4 w-4' />;
      case 'warning':
        return <AlertCircle className='h-4 w-4 text-yellow-600' />;
      default:
        return <Bell className='text-muted-foreground h-4 w-4' />;
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to view alerts. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading alerts...'
          description='Fetching your system alerts...'
        />
      </PageContainer>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title='Failed to load alerts'
          description="We couldn't fetch your alerts. Please check your connection and try again."
          onRetry={fetchAlerts}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Alerts & Notifications</h1>
            <p className='text-muted-foreground'>
              System alerts, warnings and notifications.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Create Alert
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Unread Alerts
              </CardTitle>
              <Bell className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{unreadCount}</div>
              <p className='text-muted-foreground text-xs'>pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Critical</CardTitle>
              <AlertCircle className='text-destructive h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{criticalCount}</div>
              <p className='text-destructive text-xs'>need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{alerts.length}</div>
              <p className='text-muted-foreground text-xs'>all time</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Recent alerts and notifications
                </CardDescription>
              </div>
              <div className='flex gap-2'>
                {['all', 'critical', 'warning', 'info'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setFilterType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <EmptyState
                title={
                  filterType === 'all' ? 'No alerts' : `No ${filterType} alerts`
                }
                description="You're all caught up! No alerts or notifications at this time."
              />
            ) : (
              <div className='overflow-x-auto rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-10'></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className='w-20'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow
                        key={alert.id}
                        className={!alert.read ? 'bg-muted/50' : ''}
                      >
                        <TableCell>{getAlertIcon(alert.type)}</TableCell>
                        <TableCell className='font-medium'>
                          {alert.title}
                        </TableCell>
                        <TableCell>{getAlertBadge(alert.type)}</TableCell>
                        <TableCell className='text-muted-foreground max-w-[200px] truncate text-sm'>
                          {alert.message}
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {alert.relatedTo || '—'}
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            {!alert.read && (
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleMarkAsRead(alert.id)}
                                title='Mark as read'
                              >
                                <Check className='h-4 w-4' />
                              </Button>
                            )}
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setDeleteAlertId(alert.id)}
                              title='Delete'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Alert Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Alert</DialogTitle>
              <DialogDescription>
                Create a new system alert or notification
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label>Title</Label>
                <Input
                  value={newAlert.title}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, title: e.target.value })
                  }
                  placeholder='Alert title'
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newAlert.type}
                  onValueChange={(value: any) =>
                    setNewAlert({ ...newAlert, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='info'>Info</SelectItem>
                    <SelectItem value='warning'>Warning</SelectItem>
                    <SelectItem value='critical'>Critical</SelectItem>
                    <SelectItem value='success'>Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={newAlert.message}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, message: e.target.value })
                  }
                  placeholder='Alert message'
                  rows={3}
                />
              </div>
              <div>
                <Label>Related To (Optional)</Label>
                <Input
                  value={newAlert.relatedTo}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, relatedTo: e.target.value })
                  }
                  placeholder='e.g., Student: John Doe'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAlert}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteAlertId}
          onOpenChange={() => setDeleteAlertId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Alert</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this alert? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAlert}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageContainer>
  );
}
