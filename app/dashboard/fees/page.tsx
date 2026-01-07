'use client';

import { useEffect, useState } from 'react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { toast } from 'sonner';
import {
  Plus,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
  Loader2,
  Receipt,
  CreditCard
} from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: string;
  frequency: string;
  dueDate?: string;
  grade?: string;
  isActive: boolean;
  academicYearId: string;
  createdAt: string;
}

interface FeePayment {
  id: string;
  studentId: string;
  student?: { name: string; email: string };
  feeStructureId: string;
  feeStructure?: { name: string };
  amount: number;
  paymentMethod: string;
  status: string;
  receiptNumber?: string;
  reference?: string;
  paidAt: string;
  createdAt: string;
}

export default function FeesPage() {
  const { isAdmin, isAccountant } = useUser();
  const { getToken } = useAuth();

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('structures');

  // Dialog states
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [structureForm, setStructureForm] = useState({
    name: '',
    description: '',
    amount: '',
    type: 'tuition',
    frequency: 'term',
    grade: '',
    dueDate: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    feeStructureId: '',
    amount: '',
    paymentMethod: 'cash',
    reference: '',
    notes: ''
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

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getFeeStructures();
      setFeeStructures(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load fee structures', err);
      setError('Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await apiClient.getFeePayments();
      setPayments(response.data || []);
    } catch (err) {
      console.error('Failed to load payments', err);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
    fetchPayments();
  }, []);

  const handleCreateStructure = async () => {
    if (!structureForm.name || !structureForm.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingStructure) {
        await apiClient.updateFeeStructure(editingStructure.id, {
          ...structureForm,
          amount: parseFloat(structureForm.amount)
        });
        toast.success('Fee structure updated');
      } else {
        await apiClient.createFeeStructure({
          ...structureForm,
          amount: parseFloat(structureForm.amount),
          academicYearId: 'current' // Backend should handle this
        });
        toast.success('Fee structure created');
      }
      setIsStructureDialogOpen(false);
      setEditingStructure(null);
      resetStructureForm();
      await fetchFeeStructures();
    } catch (err) {
      console.error('Error saving fee structure:', err);
      toast.error('Failed to save fee structure');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordPayment = async () => {
    if (
      !paymentForm.studentId ||
      !paymentForm.feeStructureId ||
      !paymentForm.amount
    ) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.recordFeePayment({
        studentId: paymentForm.studentId,
        feeStructureId: paymentForm.feeStructureId,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        reference: paymentForm.reference,
        notes: paymentForm.notes
      });
      toast.success('Payment recorded successfully');
      setIsPaymentDialogOpen(false);
      resetPaymentForm();
      await fetchPayments();
    } catch (err) {
      console.error('Error recording payment:', err);
      toast.error('Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const resetStructureForm = () => {
    setStructureForm({
      name: '',
      description: '',
      amount: '',
      type: 'tuition',
      frequency: 'term',
      grade: '',
      dueDate: ''
    });
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      studentId: '',
      feeStructureId: '',
      amount: '',
      paymentMethod: 'cash',
      reference: '',
      notes: ''
    });
  };

  const openEditStructure = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setStructureForm({
      name: structure.name,
      description: structure.description || '',
      amount: String(structure.amount),
      type: structure.type,
      frequency: structure.frequency,
      grade: structure.grade || '',
      dueDate: structure.dueDate ? structure.dueDate.split('T')[0] : ''
    });
    setIsStructureDialogOpen(true);
  };

  const filteredStructures = feeStructures.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tuition: 'Tuition',
      transport: 'Transport',
      feeding: 'Feeding',
      uniform: 'Uniform',
      books: 'Books',
      sports: 'Sports',
      ict: 'ICT',
      exam: 'Exam',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      one_time: 'One-time',
      monthly: 'Monthly',
      term: 'Per Term',
      semester: 'Per Semester',
      annual: 'Annual'
    };
    return labels[freq] || freq;
  };

  const canAccess = isAdmin || isAccountant;

  if (!canAccess) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to view fees. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading fees...'
          description='Fetching fee structures...'
        />
      </PageContainer>
    );
  }

  if (error && feeStructures.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title='Failed to load fees'
          description="We couldn't fetch fee structures. Please check your connection and try again."
          onRetry={fetchFeeStructures}
        />
      </PageContainer>
    );
  }

  // Calculate summary stats
  const totalFees = feeStructures.reduce((sum, f) => sum + f.amount, 0);
  const activeStructures = feeStructures.filter((f) => f.isActive).length;
  const totalCollected = payments.reduce(
    (sum, p) => (p.status === 'paid' ? sum + p.amount : sum),
    0
  );
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Fee Management
            </h2>
            <p className='text-muted-foreground'>
              Manage fee structures and track payments
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              <Receipt className='mr-2 h-4 w-4' />
              Record Payment
            </Button>
            <Button
              onClick={() => {
                setEditingStructure(null);
                resetStructureForm();
                setIsStructureDialogOpen(true);
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Fee Structure
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Fees Value
              </CardTitle>
              <DollarSign className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ₵{totalFees.toLocaleString()}
              </div>
              <p className='text-muted-foreground text-xs'>
                All fee structures combined
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Structures
              </CardTitle>
              <TrendingUp className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{activeStructures}</div>
              <p className='text-muted-foreground text-xs'>
                Of {feeStructures.length} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Collected
              </CardTitle>
              <CreditCard className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                ₵{totalCollected.toLocaleString()}
              </div>
              <p className='text-muted-foreground text-xs'>
                From {payments.filter((p) => p.status === 'paid').length}{' '}
                payments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pending Payments
              </CardTitle>
              <AlertCircle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-amber-600'>
                {pendingPayments}
              </div>
              <p className='text-muted-foreground text-xs'>
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Structures and Payments */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='structures'>Fee Structures</TabsTrigger>
            <TabsTrigger value='payments'>Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value='structures' className='space-y-4'>
            <Card>
              <CardHeader>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                  <div>
                    <CardTitle>Fee Structures</CardTitle>
                    <CardDescription>
                      Define and manage fee types for students
                    </CardDescription>
                  </div>
                  <Input
                    placeholder='Search fee structures...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='max-w-sm'
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredStructures.length === 0 ? (
                  <EmptyState
                    variant='empty'
                    title='No fee structures'
                    description='Create your first fee structure to start collecting payments'
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStructures.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell className='font-medium'>
                            {fee.name}
                          </TableCell>
                          <TableCell>{getTypeLabel(fee.type)}</TableCell>
                          <TableCell>₵{fee.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {getFrequencyLabel(fee.frequency)}
                          </TableCell>
                          <TableCell>{fee.grade || 'All'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={fee.isActive ? 'default' : 'secondary'}
                            >
                              {fee.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => openEditStructure(fee)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='payments' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all recorded fee payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <EmptyState
                    variant='empty'
                    title='No payments recorded'
                    description='Record payments when students pay their fees'
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt #</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className='font-mono text-sm'>
                            {payment.receiptNumber || '-'}
                          </TableCell>
                          <TableCell>
                            {payment.student?.name || payment.studentId}
                          </TableCell>
                          <TableCell>
                            {payment.feeStructure?.name ||
                              payment.feeStructureId}
                          </TableCell>
                          <TableCell>
                            ₵{payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className='capitalize'>
                            {payment.paymentMethod}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === 'paid'
                                  ? 'default'
                                  : payment.status === 'pending'
                                    ? 'outline'
                                    : 'destructive'
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              payment.paidAt || payment.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Fee Structure Dialog */}
      <Dialog
        open={isStructureDialogOpen}
        onOpenChange={setIsStructureDialogOpen}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editingStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}
            </DialogTitle>
            <DialogDescription>
              {editingStructure
                ? 'Update fee structure details'
                : 'Create a new fee structure for students'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                placeholder='e.g., Tuition Fee'
                value={structureForm.name}
                onChange={(e) =>
                  setStructureForm({ ...structureForm, name: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Brief description of this fee'
                value={structureForm.description}
                onChange={(e) =>
                  setStructureForm({
                    ...structureForm,
                    description: e.target.value
                  })
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount (₵) *</Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='0.00'
                  value={structureForm.amount}
                  onChange={(e) =>
                    setStructureForm({
                      ...structureForm,
                      amount: e.target.value
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Type</Label>
                <Select
                  value={structureForm.type}
                  onValueChange={(v) =>
                    setStructureForm({ ...structureForm, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='tuition'>Tuition</SelectItem>
                    <SelectItem value='transport'>Transport</SelectItem>
                    <SelectItem value='feeding'>Feeding</SelectItem>
                    <SelectItem value='uniform'>Uniform</SelectItem>
                    <SelectItem value='books'>Books</SelectItem>
                    <SelectItem value='sports'>Sports</SelectItem>
                    <SelectItem value='ict'>ICT</SelectItem>
                    <SelectItem value='exam'>Exam</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='frequency'>Frequency</Label>
                <Select
                  value={structureForm.frequency}
                  onValueChange={(v) =>
                    setStructureForm({ ...structureForm, frequency: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='one_time'>One-time</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                    <SelectItem value='term'>Per Term</SelectItem>
                    <SelectItem value='semester'>Per Semester</SelectItem>
                    <SelectItem value='annual'>Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='grade'>Grade (optional)</Label>
                <Input
                  id='grade'
                  placeholder='e.g., Grade 10'
                  value={structureForm.grade}
                  onChange={(e) =>
                    setStructureForm({
                      ...structureForm,
                      grade: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='dueDate'>Due Date (optional)</Label>
              <Input
                id='dueDate'
                type='date'
                value={structureForm.dueDate}
                onChange={(e) =>
                  setStructureForm({
                    ...structureForm,
                    dueDate: e.target.value
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsStructureDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStructure} disabled={submitting}>
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {editingStructure ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a fee payment from a student
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='studentId'>Student ID *</Label>
              <Input
                id='studentId'
                placeholder='Enter student ID'
                value={paymentForm.studentId}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, studentId: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='feeStructure'>Fee Type *</Label>
              <Select
                value={paymentForm.feeStructureId}
                onValueChange={(v) => {
                  const selected = feeStructures.find((f) => f.id === v);
                  setPaymentForm({
                    ...paymentForm,
                    feeStructureId: v,
                    amount: selected
                      ? String(selected.amount)
                      : paymentForm.amount
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select fee type' />
                </SelectTrigger>
                <SelectContent>
                  {feeStructures
                    .filter((f) => f.isActive)
                    .map((fee) => (
                      <SelectItem key={fee.id} value={fee.id}>
                        {fee.name} - ₵{fee.amount.toLocaleString()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='paymentAmount'>Amount (₵) *</Label>
                <Input
                  id='paymentAmount'
                  type='number'
                  placeholder='0.00'
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='paymentMethod'>Payment Method</Label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(v) =>
                    setPaymentForm({ ...paymentForm, paymentMethod: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='cash'>Cash</SelectItem>
                    <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                    <SelectItem value='mobile_money'>Mobile Money</SelectItem>
                    <SelectItem value='cheque'>Cheque</SelectItem>
                    <SelectItem value='card'>Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='reference'>Reference / Transaction ID</Label>
              <Input
                id='reference'
                placeholder='e.g., TXN-12345'
                value={paymentForm.reference}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, reference: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                placeholder='Additional notes about this payment'
                value={paymentForm.notes}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={submitting}>
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
