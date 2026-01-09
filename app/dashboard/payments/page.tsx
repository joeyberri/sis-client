'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import apiClient from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

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

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
}

export default function PaymentsPage() {
  const { isAdmin } = useUser();
  const { getToken } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    feeStructureId: '',
    amount: '',
    method: 'Cash' as string,
    reference: ''
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [paymentsRes, studentsRes, feesRes] = await Promise.all([
        apiClient.getPayments().catch(() => []),
        apiClient.getStudents().catch(() => ({ data: [] })),
        apiClient.getFeeStructures().catch(() => ({ data: [] }))
      ]);

      setPayments(
        Array.isArray(paymentsRes) ? paymentsRes : paymentsRes?.data || []
      );
      setStudents(studentsRes.data || []);
      setFeeStructures(feesRes.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load payments. Please try again.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, fetchData]);

  const handleRecordPayment = async () => {
    if (!newPayment.studentId || !newPayment.amount) {
      toast.error('Please fill in student and amount');
      return;
    }

    try {
      await apiClient.recordFeePayment({
        studentId: newPayment.studentId,
        feeStructureId: newPayment.feeStructureId || undefined,
        amount: parseFloat(newPayment.amount),
        paymentMethod: newPayment.method,
        reference: newPayment.reference || undefined
      });
      toast.success('Payment recorded successfully');
      setRecordDialogOpen(false);
      setNewPayment({
        studentId: '',
        feeStructureId: '',
        amount: '',
        method: 'Cash',
        reference: ''
      });
      fetchData();
    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error('Failed to record payment');
    }
  };

  const handleReconcile = async (paymentId: string) => {
    try {
      await apiClient.reconcilePayment(paymentId);
      toast.success('Payment reconciled');
      fetchData();
    } catch (err) {
      toast.error('Failed to reconcile payment');
    }
  };

  const handleCancel = async (paymentId: string) => {
    try {
      await apiClient.cancelPayment(paymentId);
      toast.success('Payment cancelled');
      fetchData();
    } catch (err) {
      toast.error('Failed to cancel payment');
    }
  };

  const handleViewReceipt = async (payment: Payment) => {
    try {
      toast.loading('Generating receipt...');
      // Try to fetch receipt from server, fallback to browser print
      const receiptWindow = window.open('', '_blank');
      if (receiptWindow) {
        const receiptHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Payment Receipt - ${payment.reference}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .header h1 { margin: 0; color: #333; }
              .header p { margin: 5px 0; color: #666; }
              .details { margin-bottom: 30px; }
              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .label { color: #666; }
              .value { font-weight: bold; }
              .total { font-size: 1.2em; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 40px; color: #999; font-size: 0.9em; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.9em; }
              .status-completed { background: #d4edda; color: #155724; }
              .status-pending { background: #fff3cd; color: #856404; }
              .status-reconciled { background: #cce5ff; color: #004085; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Payment Receipt</h1>
              <p>Reference: ${payment.reference}</p>
            </div>
            <div class="details">
              <div class="row">
                <span class="label">Student Name</span>
                <span class="value">${payment.studentName}</span>
              </div>
              <div class="row">
                <span class="label">Student ID</span>
                <span class="value">${payment.studentId}</span>
              </div>
              <div class="row">
                <span class="label">Fee Type</span>
                <span class="value">${payment.feeType}</span>
              </div>
              <div class="row">
                <span class="label">Payment Date</span>
                <span class="value">${new Date(payment.date).toLocaleDateString()}</span>
              </div>
              <div class="row">
                <span class="label">Payment Method</span>
                <span class="value">${payment.method}</span>
              </div>
              <div class="row">
                <span class="label">Status</span>
                <span class="value">
                  <span class="status status-${payment.status.toLowerCase()}">${payment.status}</span>
                </span>
              </div>
              <div class="total">
                <div class="row" style="border: none;">
                  <span class="label">Total Amount</span>
                  <span class="value">$${payment.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for your payment</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </body>
          </html>
        `;
        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.close();
        toast.dismiss();
        toast.success('Receipt opened in new tab');
      } else {
        toast.dismiss();
        toast.error('Please allow popups to view receipt');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to generate receipt');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Completed: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Failed: 'bg-red-100 text-red-700',
      Reconciled: 'bg-blue-100 text-blue-700'
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className='h-4 w-4 text-green-600' />;
      case 'Pending':
        return <Clock className='h-4 w-4 text-yellow-600' />;
      case 'Failed':
        return <AlertCircle className='h-4 w-4 text-red-600' />;
      case 'Reconciled':
        return <CheckCircle2 className='h-4 w-4 text-blue-600' />;
      default:
        return null;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      payment.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filterStatus === 'all' || payment.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedCount = payments.filter(
    (p) => p.status === 'Completed' || p.status === 'Reconciled'
  ).length;
  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (!isAdmin)
    return (
      <PageContainer>
        <ErrorState
          title='Access Denied'
          description="You don't have permission to view payments."
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );

  if (loading && payments.length === 0)
    return (
      <LoadingState
        title='Loading Payments...'
        description='Fetching transaction history...'
      />
    );

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Payments & Reconciliation</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              Track and reconcile student fee payments
            </p>
          </div>
          <Button className='gap-2' onClick={() => setRecordDialogOpen(true)}>
            <Plus className='h-4 w-4' /> Record Payment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-1'>
                <p className='text-muted-foreground text-sm'>Total Revenue</p>
                <p className='text-3xl font-bold'>
                  $
                  {totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-1'>
                <p className='text-muted-foreground text-sm'>
                  Completed Payments
                </p>
                <p className='text-3xl font-bold'>{completedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-1'>
                <p className='text-muted-foreground text-sm'>Pending Amount</p>
                <p className='text-3xl font-bold'>
                  $
                  {pendingAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-2 md:flex-row'>
              <Input
                placeholder='Search by student name, ID, or reference...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1'
              />
              <div className='flex flex-wrap gap-1'>
                {['all', 'Completed', 'Pending', 'Reconciled', 'Failed'].map(
                  (status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === 'all' ? 'All' : status}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Payments Table */}
            {filteredPayments.length === 0 ? (
              error && payments.length === 0 ? (
                <ErrorState
                  title='Failed to Load Payments'
                  description={error}
                  onRetry={fetchData}
                />
              ) : (
                <EmptyState
                  title='No payments found'
                  description={
                    searchQuery
                      ? 'Try adjusting your search criteria'
                      : 'Start by recording the first payment'
                  }
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
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className='font-medium'>{payment.studentName}</p>
                          <p className='text-muted-foreground text-sm'>
                            {payment.studentId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className='font-semibold'>
                        $
                        {payment.amount?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                      <TableCell>{payment.feeType}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {payment.reference}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewReceipt(payment)}
                            >
                              <Receipt className='mr-2 h-4 w-4' />
                              View Receipt
                            </DropdownMenuItem>
                            {payment.status === 'Completed' && (
                              <DropdownMenuItem
                                onClick={() => handleReconcile(payment.id)}
                              >
                                <CheckCircle2 className='mr-2 h-4 w-4' />
                                Mark as Reconciled
                              </DropdownMenuItem>
                            )}
                            {payment.status === 'Pending' && (
                              <DropdownMenuItem
                                onClick={() => handleCancel(payment.id)}
                                className='text-destructive'
                              >
                                <AlertCircle className='mr-2 h-4 w-4' />
                                Cancel Payment
                              </DropdownMenuItem>
                            )}
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

        {/* Record Payment Dialog */}
        <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Record a new fee payment from a student
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label>Student</Label>
                <Select
                  value={newPayment.studentId}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, studentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select student' />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fee Type (Optional)</Label>
                <Select
                  value={newPayment.feeStructureId}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, feeStructureId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select fee type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>General Payment</SelectItem>
                    {feeStructures.map((fee) => (
                      <SelectItem key={fee.id} value={fee.id}>
                        {fee.name} - ${fee.amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type='number'
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, amount: e.target.value })
                  }
                  placeholder='0.00'
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Cash'>Cash</SelectItem>
                    <SelectItem value='Bank Transfer'>Bank Transfer</SelectItem>
                    <SelectItem value='Credit Card'>Credit Card</SelectItem>
                    <SelectItem value='Check'>Check</SelectItem>
                    <SelectItem value='Online'>Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reference (Optional)</Label>
                <Input
                  value={newPayment.reference}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, reference: e.target.value })
                  }
                  placeholder='Transaction reference'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setRecordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRecordPayment}>Record Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
