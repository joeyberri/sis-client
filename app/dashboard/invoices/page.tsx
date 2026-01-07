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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import {
  Plus,
  MoreHorizontal,
  Download,
  Send,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: Array<{ description: string; amount: number }>;
  createdAt: string;
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

export default function InvoicesPage() {
  const { isAdmin } = useUser();
  const { getToken } = useAuth();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    studentId: '',
    feeStructureId: '',
    dueDate: ''
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
      const [invoicesRes, studentsRes, feesRes] = await Promise.all([
        apiClient.getInvoices().catch(() => ({ data: [] })),
        apiClient.getStudents().catch(() => ({ data: [] })),
        apiClient.getFeeStructures().catch(() => ({ data: [] }))
      ]);

      setInvoices(invoicesRes.data || invoicesRes || []);
      setStudents(studentsRes.data || []);
      setFeeStructures(feesRes.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateInvoice = async () => {
    if (
      !newInvoice.studentId ||
      !newInvoice.feeStructureId ||
      !newInvoice.dueDate
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await apiClient.createInvoice(newInvoice);
      toast.success('Invoice created successfully');
      setCreateDialogOpen(false);
      setNewInvoice({ studentId: '', feeStructureId: '', dueDate: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to create invoice:', err);
      toast.error('Failed to create invoice');
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await apiClient.sendInvoice(invoiceId);
      toast.success('Invoice sent to student');
      fetchData();
    } catch (err) {
      toast.error('Failed to send invoice');
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      await apiClient.markInvoicePaid(invoiceId);
      toast.success('Invoice marked as paid');
      fetchData();
    } catch (err) {
      toast.error('Failed to update invoice');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      sent: { variant: 'outline', label: 'Sent' },
      paid: { variant: 'default', label: 'Paid' },
      overdue: { variant: 'destructive', label: 'Overdue' },
      cancelled: { variant: 'secondary', label: 'Cancelled' }
    };
    const style = styles[status] || styles['draft'];
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const overdueCount = invoices.filter(
    (inv) => inv.status === 'overdue'
  ).length;

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to view invoices."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading Invoices...'
          description='Fetching invoice data...'
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Invoices</h1>
            <p className='text-muted-foreground'>
              Create and manage student invoices
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Create Invoice
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Invoiced
              </CardTitle>
              <DollarSign className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${totalAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Paid</CardTitle>
              <FileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${paidAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Overdue</CardTitle>
              <Clock className='text-destructive h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-destructive text-2xl font-bold'>
                {overdueCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-wrap gap-4'>
              <Input
                placeholder='Search invoices...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='max-w-xs'
              />
              <div className='flex gap-2'>
                {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>
              {filteredInvoices.length} invoice(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <EmptyState
                title='No invoices'
                description='Create your first invoice to get started'
              />
            ) : (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className='font-medium'>
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{invoice.studentName}</TableCell>
                        <TableCell>
                          ${invoice.amount?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() =>
                                  toast.info('Download feature coming soon')
                                }
                              >
                                <Download className='mr-2 h-4 w-4' />
                                Download PDF
                              </DropdownMenuItem>
                              {invoice.status === 'draft' && (
                                <DropdownMenuItem
                                  onClick={() => handleSendInvoice(invoice.id)}
                                >
                                  <Send className='mr-2 h-4 w-4' />
                                  Send to Student
                                </DropdownMenuItem>
                              )}
                              {invoice.status !== 'paid' && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkPaid(invoice.id)}
                                >
                                  <FileText className='mr-2 h-4 w-4' />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Invoice Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
              <DialogDescription>
                Generate a new invoice for a student
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label>Student</Label>
                <Select
                  value={newInvoice.studentId}
                  onValueChange={(value) =>
                    setNewInvoice({ ...newInvoice, studentId: value })
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
                <Label>Fee Structure</Label>
                <Select
                  value={newInvoice.feeStructureId}
                  onValueChange={(value) =>
                    setNewInvoice({ ...newInvoice, feeStructureId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select fee' />
                  </SelectTrigger>
                  <SelectContent>
                    {feeStructures.map((fee) => (
                      <SelectItem key={fee.id} value={fee.id}>
                        {fee.name} - ${fee.amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type='date'
                  value={newInvoice.dueDate}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, dueDate: e.target.value })
                  }
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
              <Button onClick={handleCreateInvoice}>Create Invoice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
