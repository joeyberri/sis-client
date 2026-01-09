'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api/client';

interface AuditLog {
  id: string;
  tenantId?: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
  createdAt: string;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const actionColors: Record<string, string> = {
  create:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  login:
    'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  logout: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
  view: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  export: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
};

const actionIcons: Record<string, string> = {
  create: 'solar:add-circle-duotone',
  update: 'solar:pen-duotone',
  delete: 'solar:trash-bin-trash-duotone',
  login: 'solar:login-3-duotone',
  logout: 'solar:logout-2-duotone',
  view: 'solar:eye-duotone',
  export: 'solar:export-duotone'
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resourceFilter, setResourceFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected log for details
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, resourceFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25'
      });
      if (actionFilter) params.append('action', actionFilter);
      if (resourceFilter) params.append('resource', resourceFilter);

      const response = await apiClient.get(`/audit?${params.toString()}`);
      const data: AuditLogsResponse = response.data;

      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.resource.toLowerCase().includes(query) ||
      log.userId.toLowerCase().includes(query) ||
      log.ipAddress?.toLowerCase().includes(query)
    );
  });

  const uniqueResources = [...new Set(logs.map((log) => log.resource))];
  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Audit Logs</h1>
        <p className='text-muted-foreground'>
          Track all system activities and changes for compliance and security
          monitoring.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='flex items-center gap-4 p-4'>
            <div className='rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30'>
              <Icon
                icon='solar:document-text-duotone'
                className='h-6 w-6 text-blue-600 dark:text-blue-400'
              />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Total Logs</p>
              <p className='text-2xl font-bold'>{total.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center gap-4 p-4'>
            <div className='rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30'>
              <Icon
                icon='solar:add-circle-duotone'
                className='h-6 w-6 text-emerald-600 dark:text-emerald-400'
              />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Creates</p>
              <p className='text-2xl font-bold'>
                {logs.filter((l) => l.action === 'create').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center gap-4 p-4'>
            <div className='rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30'>
              <Icon
                icon='solar:pen-duotone'
                className='h-6 w-6 text-amber-600 dark:text-amber-400'
              />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Updates</p>
              <p className='text-2xl font-bold'>
                {logs.filter((l) => l.action === 'update').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center gap-4 p-4'>
            <div className='rounded-lg bg-rose-100 p-3 dark:bg-rose-900/30'>
              <Icon
                icon='solar:trash-bin-trash-duotone'
                className='h-6 w-6 text-rose-600 dark:text-rose-400'
              />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Deletes</p>
              <p className='text-2xl font-bold'>
                {logs.filter((l) => l.action === 'delete').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='text-base'>Filters</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-4'>
          <div className='min-w-[200px] flex-1'>
            <Input
              placeholder='Search logs...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-10'
            />
          </div>
          <Select
            value={actionFilter}
            onValueChange={(val) => setActionFilter(val === 'all' ? '' : val)}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Action' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={resourceFilter}
            onValueChange={(val) => setResourceFilter(val === 'all' ? '' : val)}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Resource' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Resources</SelectItem>
              {uniqueResources.map((resource) => (
                <SelectItem key={resource} value={resource}>
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant='outline' onClick={fetchLogs}>
            <Icon icon='solar:refresh-duotone' className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {total} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className='text-muted-foreground py-12 text-center'>
              <Icon
                icon='solar:document-text-duotone'
                className='mx-auto mb-4 h-12 w-12 opacity-50'
              />
              <p>No audit logs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className='text-right'>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className='whitespace-nowrap'>
                      {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          actionColors[log.action] ||
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        <Icon
                          icon={
                            actionIcons[log.action] || 'solar:document-duotone'
                          }
                          className='mr-1 h-3 w-3'
                        />
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {log.resource}
                    </TableCell>
                    <TableCell className='text-muted-foreground font-mono text-sm'>
                      {log.userId.slice(0, 12)}...
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {log.ipAddress || 'N/A'}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setSelectedLog(log)}
                          >
                            <Icon
                              icon='solar:eye-duotone'
                              className='h-4 w-4'
                            />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>
                              Full details for this audit entry
                            </DialogDescription>
                          </DialogHeader>
                          {selectedLog && (
                            <div className='space-y-4'>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <p className='text-muted-foreground text-sm'>
                                    Action
                                  </p>
                                  <Badge
                                    className={actionColors[selectedLog.action]}
                                  >
                                    {selectedLog.action}
                                  </Badge>
                                </div>
                                <div>
                                  <p className='text-muted-foreground text-sm'>
                                    Resource
                                  </p>
                                  <p className='font-medium'>
                                    {selectedLog.resource}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-muted-foreground text-sm'>
                                    Resource ID
                                  </p>
                                  <p className='font-mono text-sm'>
                                    {selectedLog.resourceId || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-muted-foreground text-sm'>
                                    User ID
                                  </p>
                                  <p className='font-mono text-sm'>
                                    {selectedLog.userId}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-muted-foreground text-sm'>
                                    IP Address
                                  </p>
                                  <p className='font-mono text-sm'>
                                    {selectedLog.ipAddress || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-muted-foreground text-sm'>
                                    Timestamp
                                  </p>
                                  <p>
                                    {format(
                                      new Date(selectedLog.createdAt),
                                      'PPpp'
                                    )}
                                  </p>
                                </div>
                              </div>

                              {selectedLog.requestPath && (
                                <div>
                                  <p className='text-muted-foreground mb-1 text-sm'>
                                    Request Path
                                  </p>
                                  <code className='bg-muted block rounded p-2 text-sm'>
                                    {selectedLog.requestPath}
                                  </code>
                                </div>
                              )}

                              {selectedLog.userAgent && (
                                <div>
                                  <p className='text-muted-foreground mb-1 text-sm'>
                                    User Agent
                                  </p>
                                  <code className='bg-muted block rounded p-2 text-sm break-all'>
                                    {selectedLog.userAgent}
                                  </code>
                                </div>
                              )}

                              {selectedLog.previousData && (
                                <div>
                                  <p className='text-muted-foreground mb-1 text-sm'>
                                    Previous Data
                                  </p>
                                  <pre className='bg-muted overflow-x-auto rounded p-2 text-sm'>
                                    {JSON.stringify(
                                      selectedLog.previousData,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              )}

                              {selectedLog.newData && (
                                <div>
                                  <p className='text-muted-foreground mb-1 text-sm'>
                                    New Data
                                  </p>
                                  <pre className='bg-muted overflow-x-auto rounded p-2 text-sm'>
                                    {JSON.stringify(
                                      selectedLog.newData,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              )}

                              {selectedLog.details && (
                                <div>
                                  <p className='text-muted-foreground mb-1 text-sm'>
                                    Additional Details
                                  </p>
                                  <pre className='bg-muted overflow-x-auto rounded p-2 text-sm'>
                                    {JSON.stringify(
                                      selectedLog.details,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-4 flex items-center justify-between border-t pt-4'>
              <p className='text-muted-foreground text-sm'>
                Page {page} of {totalPages}
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <Icon
                    icon='solar:alt-arrow-left-duotone'
                    className='mr-1 h-4 w-4'
                  />
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <Icon
                    icon='solar:alt-arrow-right-duotone'
                    className='ml-1 h-4 w-4'
                  />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
