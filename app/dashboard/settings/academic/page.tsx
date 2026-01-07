'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'upcoming' | 'active' | 'completed' | 'archived';
  terms?: AcademicTerm[];
  createdAt: string;
}

interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  termNumber: number;
  isCurrent: boolean;
  academicYearId: string;
}

export default function AcademicSettingsPage() {
  const { isAdmin } = useUser();
  const { getToken } = useAuth();

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [isTermDialogOpen, setIsTermDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [editingTerm, setEditingTerm] = useState<AcademicTerm | null>(null);
  const [selectedYearForTerm, setSelectedYearForTerm] = useState<string | null>(
    null
  );

  // Form states
  const [yearForm, setYearForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });

  const [termForm, setTermForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    termNumber: 1
  });

  const [submitting, setSubmitting] = useState(false);

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

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAcademicYears();
      setAcademicYears(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching academic years:', err);
      setError('Failed to load academic years');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const handleCreateYear = async () => {
    if (!yearForm.name || !yearForm.startDate || !yearForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingYear) {
        await apiClient.updateAcademicYear(editingYear.id, yearForm);
        toast.success('Academic year updated successfully');
      } else {
        await apiClient.createAcademicYear(yearForm);
        toast.success('Academic year created successfully');
      }
      setIsYearDialogOpen(false);
      setEditingYear(null);
      setYearForm({ name: '', startDate: '', endDate: '', isCurrent: false });
      await fetchAcademicYears();
    } catch (err) {
      console.error('Error saving academic year:', err);
      toast.error('Failed to save academic year');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTerm = async () => {
    if (
      !selectedYearForTerm ||
      !termForm.name ||
      !termForm.startDate ||
      !termForm.endDate
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTerm) {
        await apiClient.updateAcademicTerm(editingTerm.id, termForm);
        toast.success('Term updated successfully');
      } else {
        await apiClient.createAcademicTerm(selectedYearForTerm, termForm);
        toast.success('Term created successfully');
      }
      setIsTermDialogOpen(false);
      setEditingTerm(null);
      setTermForm({ name: '', startDate: '', endDate: '', termNumber: 1 });
      await fetchAcademicYears();
    } catch (err) {
      console.error('Error saving term:', err);
      toast.error('Failed to save term');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetCurrentYear = async (yearId: string) => {
    try {
      await apiClient.updateAcademicYear(yearId, {
        isCurrent: true,
        status: 'active'
      });
      toast.success('Current academic year updated');
      await fetchAcademicYears();
    } catch (err) {
      console.error('Error setting current year:', err);
      toast.error('Failed to set current year');
    }
  };

  const handleSetCurrentTerm = async (termId: string) => {
    try {
      await apiClient.updateAcademicTerm(termId, { isCurrent: true });
      toast.success('Current term updated');
      await fetchAcademicYears();
    } catch (err) {
      console.error('Error setting current term:', err);
      toast.error('Failed to set current term');
    }
  };

  const openEditYear = (year: AcademicYear) => {
    setEditingYear(year);
    setYearForm({
      name: year.name,
      startDate: year.startDate.split('T')[0],
      endDate: year.endDate.split('T')[0],
      isCurrent: year.isCurrent
    });
    setIsYearDialogOpen(true);
  };

  const openAddTerm = (yearId: string) => {
    setSelectedYearForTerm(yearId);
    const year = academicYears.find((y) => y.id === yearId);
    const termCount = year?.terms?.length || 0;
    setTermForm({
      name: `Term ${termCount + 1}`,
      startDate: '',
      endDate: '',
      termNumber: termCount + 1
    });
    setIsTermDialogOpen(true);
  };

  const getStatusBadge = (status: AcademicYear['status']) => {
    switch (status) {
      case 'active':
        return <Badge className='bg-green-500'>Active</Badge>;
      case 'upcoming':
        return <Badge variant='outline'>Upcoming</Badge>;
      case 'completed':
        return <Badge variant='secondary'>Completed</Badge>;
      case 'archived':
        return <Badge variant='destructive'>Archived</Badge>;
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <AlertCircle className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h2 className='text-muted-foreground text-2xl font-bold'>
              Access Denied
            </h2>
            <p className='text-muted-foreground'>
              You need administrator privileges to access this page.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Academic Calendar</h1>
            <p className='text-muted-foreground'>
              Manage academic years, terms, and school calendar settings
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingYear(null);
              setYearForm({
                name: '',
                startDate: '',
                endDate: '',
                isCurrent: false
              });
              setIsYearDialogOpen(true);
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Academic Year
          </Button>
        </div>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
          </div>
        ) : academicYears.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <CalendarDays className='text-muted-foreground mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-semibold'>No Academic Years</h3>
              <p className='text-muted-foreground mb-4 text-center'>
                Get started by creating your first academic year to begin
                organizing your school calendar.
              </p>
              <Button onClick={() => setIsYearDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Create First Academic Year
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {academicYears.map((year) => (
              <Card key={year.id}>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <CardTitle className='text-xl'>{year.name}</CardTitle>
                      {getStatusBadge(year.status)}
                      {year.isCurrent && (
                        <Badge variant='default' className='bg-primary'>
                          <CheckCircle className='mr-1 h-3 w-3' />
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className='flex gap-2'>
                      {!year.isCurrent && year.status !== 'archived' && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleSetCurrentYear(year.id)}
                        >
                          Set as Current
                        </Button>
                      )}
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => openEditYear(year)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(year.startDate).toLocaleDateString()} -{' '}
                    {new Date(year.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-semibold'>Terms</h4>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openAddTerm(year.id)}
                      >
                        <Plus className='mr-1 h-4 w-4' />
                        Add Term
                      </Button>
                    </div>

                    {year.terms && year.terms.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Term</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {year.terms.map((term) => (
                            <TableRow key={term.id}>
                              <TableCell className='font-medium'>
                                {term.name}
                              </TableCell>
                              <TableCell>
                                {new Date(term.startDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {new Date(term.endDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {term.isCurrent ? (
                                  <Badge className='bg-green-500'>
                                    Current
                                  </Badge>
                                ) : (
                                  <Badge variant='outline'>—</Badge>
                                )}
                              </TableCell>
                              <TableCell className='text-right'>
                                {!term.isCurrent && year.isCurrent && (
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                      handleSetCurrentTerm(term.id)
                                    }
                                  >
                                    Set Current
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className='text-muted-foreground py-6 text-center'>
                        <Clock className='mx-auto mb-2 h-8 w-8 opacity-50' />
                        <p className='text-sm'>
                          No terms configured for this academic year.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Academic Year Dialog */}
      <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingYear ? 'Edit Academic Year' : 'Create Academic Year'}
            </DialogTitle>
            <DialogDescription>
              {editingYear
                ? 'Update the academic year details below.'
                : 'Fill in the details to create a new academic year.'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Year Name</Label>
              <Input
                id='name'
                placeholder='e.g., 2024-2025'
                value={yearForm.name}
                onChange={(e) =>
                  setYearForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={yearForm.startDate}
                  onChange={(e) =>
                    setYearForm((prev) => ({
                      ...prev,
                      startDate: e.target.value
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='endDate'>End Date</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={yearForm.endDate}
                  onChange={(e) =>
                    setYearForm((prev) => ({
                      ...prev,
                      endDate: e.target.value
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsYearDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateYear} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : editingYear ? (
                'Update Year'
              ) : (
                'Create Year'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Term Dialog */}
      <Dialog open={isTermDialogOpen} onOpenChange={setIsTermDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTerm ? 'Edit Term' : 'Add Term'}</DialogTitle>
            <DialogDescription>
              {editingTerm
                ? 'Update the term details below.'
                : 'Configure the new term for this academic year.'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='termName'>Term Name</Label>
              <Input
                id='termName'
                placeholder='e.g., First Term, Fall Semester'
                value={termForm.name}
                onChange={(e) =>
                  setTermForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='termNumber'>Term Number</Label>
              <Select
                value={String(termForm.termNumber)}
                onValueChange={(value) =>
                  setTermForm((prev) => ({
                    ...prev,
                    termNumber: parseInt(value)
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select term number' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>1st Term</SelectItem>
                  <SelectItem value='2'>2nd Term</SelectItem>
                  <SelectItem value='3'>3rd Term</SelectItem>
                  <SelectItem value='4'>4th Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='termStartDate'>Start Date</Label>
                <Input
                  id='termStartDate'
                  type='date'
                  value={termForm.startDate}
                  onChange={(e) =>
                    setTermForm((prev) => ({
                      ...prev,
                      startDate: e.target.value
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='termEndDate'>End Date</Label>
                <Input
                  id='termEndDate'
                  type='date'
                  value={termForm.endDate}
                  onChange={(e) =>
                    setTermForm((prev) => ({
                      ...prev,
                      endDate: e.target.value
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsTermDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTerm} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : editingTerm ? (
                'Update Term'
              ) : (
                'Add Term'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
