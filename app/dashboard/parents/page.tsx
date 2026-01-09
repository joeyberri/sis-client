'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import { DataManagementPage } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { ActionDropdown } from '@/components/common';
import { StatsGrid } from '@/components/common';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';
import {
  User,
  Mail,
  UserPlus,
  Link2,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [parentToLink, setParentToLink] = useState<Parent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search state
  const [searchValue, setSearchValue] = useState('');

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
      toast.error('Name and email are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingParent) {
        await apiClient.updateParent(editingParent.id, parentForm);
        toast.success('Parent updated successfully');
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
      toast.success('Parent deleted successfully');
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
      toast.error('Please select a student to link');
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

  const getParentActions = (parent: Parent) => [
    {
      label: 'Link Student',
      icon: <Link2 className='mr-2 h-4 w-4' />,
      onClick: () => openLinkDialog(parent)
    },
    {
      label: 'Edit',
      icon: <Edit className='mr-2 h-4 w-4' />,
      onClick: () => openEditDialog(parent)
    },
    {
      label: 'Delete',
      icon: <Trash2 className='mr-2 h-4 w-4' />,
      onClick: () => setParentToDelete(parent),
      variant: 'destructive' as const
    }
  ];

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className='font-medium'>{row.original.name}</div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: any) => (
        <div className='text-muted-foreground'>{row.original.email}</div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }: any) => <div>{row.original.phone || '—'}</div>
    },
    {
      accessorKey: 'relation',
      header: 'Relation',
      cell: ({ row }: any) => (
        <StatusBadge status={row.original.relation} variant='outline' />
      )
    },
    {
      accessorKey: 'linkedStudents',
      header: 'Linked Students',
      cell: ({ row }: any) => (
        <div className='text-center'>{row.original.linkedStudents || 0}</div>
      )
    },
    {
      accessorKey: 'portalAccess',
      header: 'Portal Access',
      cell: ({ row }: any) => (
        <StatusBadge
          status={row.original.portalAccess}
          customVariants={{
            active: { variant: 'default', label: 'Active' },
            pending: { variant: 'secondary', label: 'Pending' },
            inactive: { variant: 'outline', label: 'Inactive' }
          }}
        />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <ActionDropdown actions={getParentActions(row.original)} />
      )
    }
  ];

  const stats = [
    {
      title: 'Total Parents',
      value: parents.length.toString(),
      description: 'Registered guardians',
      icon: <User className='h-6 w-6 text-blue-600' />
    },
    {
      title: 'Active Access',
      value: parents
        .filter((p) => p.portalAccess === 'active')
        .length.toString(),
      description: 'Active portal users',
      icon: <User className='h-6 w-6 text-green-600' />,
      badge: { text: 'Active', variant: 'default' as const }
    },
    {
      title: 'Pending Invites',
      value: parents
        .filter((p) => p.portalAccess === 'pending')
        .length.toString(),
      description: 'Awaiting activation',
      icon: <Mail className='h-6 w-6 text-amber-600' />,
      badge: { text: 'Pending', variant: 'secondary' as const }
    }
  ];

  if (!isAdmin) {
    return (
      <div className='p-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground'>
            You don't have permission to view parent records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataManagementPage
        title='Parents & Guardians'
        description='Manage guardian accounts and link them to students'
        data={parents}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetchParents}
        searchPlaceholder='Search by name or email...'
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        addButton={{
          label: 'Invite Parent',
          icon: UserPlus,
          onClick: () => {
            setEditingParent(null);
            resetForm();
            setIsAddDialogOpen(true);
          }
        }}
        statsComponent={<StatsGrid stats={stats} columns={3} />}
      />

      {/* Add/Edit Parent Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingParent ? 'Edit Parent' : 'Invite Parent'}
            </DialogTitle>
            <DialogDescription>
              {editingParent
                ? 'Update parent information'
                : 'Send an invitation to join the parent portal'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                value={parentForm.name}
                onChange={(e) =>
                  setParentForm({ ...parentForm, name: e.target.value })
                }
                placeholder='Enter full name'
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={parentForm.email}
                onChange={(e) =>
                  setParentForm({ ...parentForm, email: e.target.value })
                }
                placeholder='Enter email address'
              />
            </div>
            <div>
              <Label htmlFor='phone'>Phone (Optional)</Label>
              <Input
                id='phone'
                value={parentForm.phone}
                onChange={(e) =>
                  setParentForm({ ...parentForm, phone: e.target.value })
                }
                placeholder='Enter phone number'
              />
            </div>
            <div>
              <Label htmlFor='relation'>Relation to Student</Label>
              <Select
                value={parentForm.relation}
                onValueChange={(value: 'Father' | 'Mother' | 'Guardian') =>
                  setParentForm({ ...parentForm, relation: value })
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
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsAddDialogOpen(false)}
              disabled={submitting}
            >
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
            <DialogTitle>Link Student to Parent</DialogTitle>
            <DialogDescription>
              Connect {parentToLink?.name} with a student
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='student'>Select Student</Label>
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
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleLinkStudent} disabled={submitting}>
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Link Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!parentToDelete}
        onOpenChange={() => setParentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Parent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {parentToDelete?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteParent}
              disabled={submitting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
