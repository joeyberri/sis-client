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

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      toast.loading('Generating invoice PDF...');
      // Generate printable invoice in new window
      const invoiceWindow = window.open('', '_blank');
      if (invoiceWindow) {
        const statusColors: Record<string, string> = {
          draft: '#6b7280',
          sent: '#3b82f6',
          paid: '#10b981',
          overdue: '#ef4444',
          cancelled: '#9ca3af'
        };
        const invoiceHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; }
              .invoice-info { text-align: right; }
              .invoice-number { font-size: 18px; font-weight: bold; color: #333; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; color: white; background: ${statusColors[invoice.status] || '#6b7280'}; margin-top: 8px; }
              .section { margin-bottom: 30px; }
              .section-title { font-size: 14px; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
              .bill-to { background: #f9f9f9; padding: 15px; border-radius: 8px; }
              .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
              .items-table th { background: #f5f5f5; font-weight: 600; }
              .items-table .amount { text-align: right; }
              .totals { margin-top: 20px; margin-left: auto; width: 300px; }
              .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
              .total-row.grand { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; padding-top: 12px; margin-top: 8px; }
              .footer { margin-top: 50px; text-align: center; color: #999; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 20px; }
              .due-date { color: ${invoice.status === 'overdue' ? '#ef4444' : '#666'}; font-weight: ${invoice.status === 'overdue' ? 'bold' : 'normal'}; }
              @media print { 
                body { padding: 20px; } 
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">INVOICE</div>
              <div class="invoice-info">
                <div class="invoice-number">${invoice.invoiceNumber}</div>
                <div class="status">${invoice.status.toUpperCase()}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Bill To</div>
              <div class="bill-to">
                <strong>${invoice.studentName}</strong><br>
                Student ID: ${invoice.studentId}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Invoice Details</div>
              <div>
                <strong>Date Issued:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}<br>
                <span class="due-date"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${
                  invoice.items?.length > 0
                    ? invoice.items
                        .map(
                          (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="amount">$${item.amount.toLocaleString()}</td>
                    </tr>
                  `
                        )
                        .join('')
                    : `<tr><td>Tuition & Fees</td><td class="amount">$${invoice.amount.toLocaleString()}</td></tr>`
                }
              </tbody>
            </table>
            
            <div class="totals">
              <div class="total-row grand">
                <span>Total Due</span>
                <span>$${invoice.amount.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for your business</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
              <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Print Invoice</button>
            </div>
          </body>
          </html>
        `;
        invoiceWindow.document.write(invoiceHTML);
        invoiceWindow.document.close();
        toast.dismiss();
        toast.success('Invoice opened in new tab');
      } else {
        toast.dismiss();
        toast.error('Please allow popups to download invoice');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to generate invoice PDF');
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
                                onClick={() => handleDownloadPDF(invoice)}
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
