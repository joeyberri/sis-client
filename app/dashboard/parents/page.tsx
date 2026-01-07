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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import apiClient from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { toast } from 'sonner';
import {
  Plus,
  Mail,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Link2,
  Loader2
} from 'lucide-react';

interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relation: 'Father' | 'Mother' | 'Guardian';
  linkedStudents: number;
  portalAccess: 'active' | 'pending' | 'inactive';
  joinDate?: string;
  students?: Array<{ id: string; name: string }>;
}

interface Student {
  id: string;
  name: string;
  email?: string;
}

export default function ParentsPage() {
  const { isAdmin } = useUser();
  const { getToken } = useAuth();

  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [parentToLink, setParentToLink] = useState<Parent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [parentForm, setParentForm] = useState({
    name: '',
    email: '',
    phone: '',
    relation: 'Father' as 'Father' | 'Mother' | 'Guardian'
  });
  const [selectedStudentId, setSelectedStudentId] = useState('');

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

  const fetchParents = useCallback(async () => {
    try {
      setLoading(true);
      const [parentsRes, studentsRes] = await Promise.all([
        apiClient.getParents(),
        apiClient.getStudents()
      ]);
      setParents(parentsRes.data || []);
      setStudents(studentsRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load parents', err);
      setError('Failed to load parents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const handleCreateParent = async () => {
    if (!parentForm.name || !parentForm.email) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingParent) {
        await apiClient.updateParent(editingParent.id, parentForm);
        toast.success('Parent updated');
      } else {
        await apiClient.createParent(parentForm);
        toast.success('Parent invited successfully');
      }
      setIsAddDialogOpen(false);
      setEditingParent(null);
      resetForm();
      await fetchParents();
    } catch (err: any) {
      console.error('Error saving parent:', err);
      toast.error(err.response?.data?.message || 'Failed to save parent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteParent = async () => {
    if (!parentToDelete) return;

    setSubmitting(true);
    try {
      await apiClient.deleteParent(parentToDelete.id);
      toast.success('Parent removed');
      setParentToDelete(null);
      await fetchParents();
    } catch (err: any) {
      console.error('Error deleting parent:', err);
      toast.error(err.response?.data?.message || 'Failed to delete parent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkStudent = async () => {
    if (!parentToLink || !selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.linkParentToStudent(
        parentToLink.id,
        selectedStudentId,
        parentToLink.relation
      );
      toast.success('Student linked successfully');
      setIsLinkDialogOpen(false);
      setParentToLink(null);
      setSelectedStudentId('');
      await fetchParents();
    } catch (err: any) {
      console.error('Error linking student:', err);
      toast.error(err.response?.data?.message || 'Failed to link student');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setParentForm({
      name: '',
      email: '',
      phone: '',
      relation: 'Father'
    });
  };

  const openEditDialog = (parent: Parent) => {
    setEditingParent(parent);
    setParentForm({
      name: parent.name,
      email: parent.email,
      phone: parent.phone || '',
      relation: parent.relation
    });
    setIsAddDialogOpen(true);
  };

  const openLinkDialog = (parent: Parent) => {
    setParentToLink(parent);
    setSelectedStudentId('');
    setIsLinkDialogOpen(true);
  };

  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccessBadge = (access: string) => {
    switch (access) {
      case 'active':
        return (
          <Badge variant='default' className='bg-green-600'>
            Active
          </Badge>
        );
      case 'pending':
        return <Badge variant='secondary'>Pending</Badge>;
      case 'inactive':
        return <Badge variant='outline'>Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to view parent records."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading parents...'
          description='Fetching parent and guardian records...'
        />
      </PageContainer>
    );
  }

  if (error && parents.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title='Failed to load parents'
          description={error}
          onRetry={fetchParents}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Parents & Guardians
            </h2>
            <p className='text-muted-foreground'>
              Manage guardian accounts and link them to students
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingParent(null);
              resetForm();
              setIsAddDialogOpen(true);
            }}
          >
            <UserPlus className='mr-2 h-4 w-4' />
            Invite Parent
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Parents
              </CardTitle>
              <User className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{parents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {parents.filter((p) => p.portalAccess === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pending Invites
              </CardTitle>
              <Mail className='h-4 w-4 text-amber-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-amber-600'>
                {parents.filter((p) => p.portalAccess === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Guardians</CardTitle>
            <CardDescription>
              List of guardians linked to students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {parents.length === 0 ? (
              <EmptyState
                variant='empty'
                title='No parents added'
                description='Invite parents to join the parent portal'
                action={{
                  label: 'Invite Parent',
                  onClick: () => setIsAddDialogOpen(true)
                }}
              />
            ) : (
              <>
                <div className='flex items-center py-4'>
                  <Input
                    placeholder='Search by name or email...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='max-w-sm'
                  />
                </div>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Relation</TableHead>
                        <TableHead>Linked Students</TableHead>
                        <TableHead>Portal Access</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParents.map((parent) => (
                        <TableRow key={parent.id}>
                          <TableCell className='font-medium'>
                            {parent.name}
                          </TableCell>
                          <TableCell className='text-muted-foreground'>
                            {parent.email}
                          </TableCell>
                          <TableCell>{parent.phone || '—'}</TableCell>
                          <TableCell>
                            <Badge variant='outline'>{parent.relation}</Badge>
                          </TableCell>
                          <TableCell className='text-center'>
                            {parent.linkedStudents || 0}
                          </TableCell>
                          <TableCell>
                            {getAccessBadge(parent.portalAccess)}
                          </TableCell>
                          <TableCell className='text-right'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() => openLinkDialog(parent)}
                                >
                                  <Link2 className='mr-2 h-4 w-4' />
                                  Link Student
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEditDialog(parent)}
                                >
                                  <Edit className='mr-2 h-4 w-4' />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='text-destructive'
                                  onClick={() => setParentToDelete(parent)}
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Parent Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingParent ? 'Edit Parent' : 'Invite Parent'}
            </DialogTitle>
            <DialogDescription>
              {editingParent
                ? 'Update parent/guardian information'
                : 'Add a new parent/guardian to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>Full Name *</Label>
              <Input
                placeholder='Enter full name'
                value={parentForm.name}
                onChange={(e) =>
                  setParentForm({ ...parentForm, name: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label>Email *</Label>
              <Input
                type='email'
                placeholder='Enter email address'
                value={parentForm.email}
                onChange={(e) =>
                  setParentForm({ ...parentForm, email: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Phone</Label>
                <Input
                  placeholder='Phone number'
                  value={parentForm.phone}
                  onChange={(e) =>
                    setParentForm({ ...parentForm, phone: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>Relation</Label>
                <Select
                  value={parentForm.relation}
                  onValueChange={(v: 'Father' | 'Mother' | 'Guardian') =>
                    setParentForm({ ...parentForm, relation: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Father'>Father</SelectItem>
                    <SelectItem value='Mother'>Mother</SelectItem>
                    <SelectItem value='Guardian'>Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateParent} disabled={submitting}>
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {editingParent ? 'Update' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Student Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Student</DialogTitle>
            <DialogDescription>
              Link a student to {parentToLink?.name}
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <div className='space-y-2'>
              <Label>Select Student</Label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Choose a student' />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLinkStudent}
              disabled={submitting || !selectedStudentId}
            >
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Link Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!parentToDelete}
        onOpenChange={(open) => !open && setParentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Parent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {parentToDelete?.name}? This will
              remove their access to the parent portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteParent}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
