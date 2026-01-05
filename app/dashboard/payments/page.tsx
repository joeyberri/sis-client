'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Plus, MoreHorizontal, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Payment {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Check' | 'Cash' | 'Online';
  status: 'Completed' | 'Pending' | 'Failed' | 'Reconciled';
  feeType: string;
  reference: string;
}

export default function PaymentsPage() {
  const { isAdmin } = useUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPayments();
      setPayments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load payments. Please try again.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPayments();
    }
  }, [isAdmin]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Completed': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Failed': 'bg-red-100 text-red-700',
      'Reconciled': 'bg-blue-100 text-blue-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'Reconciled':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedCount = payments.filter((p) => p.status === 'Completed' || p.status === 'Reconciled').length;
  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (!isAdmin) return (
    <PageContainer>
      <ErrorState 
        title="Access Denied" 
        description="You don't have permission to view payments."
        onRetry={() => window.location.reload()}
      />
    </PageContainer>
  );

  if (loading && payments.length === 0) return <LoadingState title="Loading Payments..." description="Fetching transaction history..." />;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments & Reconciliation</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and reconcile student fee payments</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Record Payment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Completed Payments</p>
                <p className="text-3xl font-bold">{completedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-3xl font-bold">${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-col md:flex-row">
              <Input
                placeholder="Search by student name, ID, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-1 flex-wrap">
                {['all', 'Completed', 'Pending', 'Reconciled', 'Failed'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'all' ? 'All' : status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Payments Table */}
            {filteredPayments.length === 0 ? (
              error && payments.length === 0 ? (
                <ErrorState 
                  title="Failed to Load Payments" 
                  description={error}
                  onRetry={fetchPayments}
                />
              ) : (
                <EmptyState 
                  title="No payments found" 
                  description={searchQuery ? "Try adjusting your search criteria" : "Start by recording the first payment"}
                />
              )
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.studentName}</p>
                          <p className="text-sm text-muted-foreground">{payment.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{payment.feeType}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusBadge(payment.status)}>{payment.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{payment.reference}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Receipt</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Reconciled</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel Payment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
