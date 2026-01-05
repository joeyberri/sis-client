 'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { AlertCircle, Bell, Plus, Trash2 } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  type: 'warning' | 'info' | 'critical' | 'success';
  message: string;
  createdAt: string;
  relatedTo?: string; // e.g., "Student: John Doe"
  read: boolean;
}

export default function AlertsPage() {
  const { isAdmin } = useUser();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [filterType, setFilterType] = useState('all');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAlerts();
      setAlerts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load alerts', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => filterType === 'all' || a.type === filterType);
  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  const getAlertBadge = (type: string) => {
    const styles: { [key: string]: { variant: any; label: string } } = {
      'critical': { variant: 'destructive', label: 'Critical' },
      'warning': { variant: 'secondary', label: 'Warning' },
      'info': { variant: 'outline', label: 'Info' },
      'success': { variant: 'default', label: 'Success' }
    };
    const style = styles[type] || styles['info'];
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant="error"
          title="Access Denied"
          description="You don't have permission to view alerts. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title="Loading alerts..."
          description="Fetching your system alerts..."
        />
      </PageContainer>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title="Failed to load alerts"
          description="We couldn't fetch your alerts. Please check your connection and try again."
          onRetry={fetchAlerts}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Automations</h1>
            <p className="text-muted-foreground">System alerts, warnings and automated notifications.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalCount}</div>
              <p className="text-xs text-destructive">need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">all time</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent alerts and notifications</CardDescription>
              </div>
              <div className="flex gap-2">
                {['all', 'critical', 'warning', 'info'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
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
                title={filterType === 'all' ? "No alerts" : `No ${filterType} alerts`}
                description="You're all caught up! No alerts or notifications at this time."
              />
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-10">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id} className={!alert.read ? 'bg-muted/50' : ''}>
                        <TableCell>
                          {getAlertIcon(alert.type)}
                        </TableCell>
                        <TableCell className="font-medium">{alert.title}</TableCell>
                        <TableCell>
                          {getAlertBadge(alert.type)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{alert.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{alert.relatedTo || '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
