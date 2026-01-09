'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/user/user-context';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
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
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  UserX,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

// Import common components
import {
  DataManagementPage,
  StatusBadge,
  ActionDropdown,
  createViewAction,
  createEditAction,
  createDeleteAction,
  createSuspendAction,
  createActivateAction,
  FilterOption
} from '@/components/common';

// Import existing dialogs and sheets
import { AddTeacherDialog } from '@/components/forms/add-teacher-dialog';
import { EditTeacherDialog } from '@/components/forms/edit-teacher-dialog';
import { TeacherDetailsSheet } from '@/components/sheets/teacher-details-sheet';
import { BulkUploadDialog } from '@/components/forms/bulk-upload-dialog';
import { apiClient } from '@/lib/api/client';

// Teacher type definition
interface Teacher {
  id: string;
  name: string;
  email: string;
  subject?: string;
  department?: string;
  hire_date?: string;
  status?: 'active' | 'inactive' | 'on-leave';
  phone?: string;
  qualifications?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

// Column definitions
const createColumns = (
  onView: (teacher: Teacher) => void,
  onEdit: (teacher: Teacher) => void,
  onDelete: (teacher: Teacher) => void,
  onToggleStatus: (teacher: Teacher) => void
): ColumnDef<Teacher>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className='ml-2 h-4 w-4' />
          ) : (
            <ChevronUp className='ml-2 h-4 w-4 opacity-50' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className='ml-2 h-4 w-4' />
          ) : (
            <ChevronUp className='ml-2 h-4 w-4 opacity-50' />
          )}
        </Button>
      );
    }
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => <div>{row.getValue('subject') || 'N/A'}</div>
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => <div>{row.getValue('department') || 'N/A'}</div>
  },
  {
    accessorKey: 'hire_date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Hire Date
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className='ml-2 h-4 w-4' />
          ) : (
            <ChevronUp className='ml-2 h-4 w-4 opacity-50' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('hire_date') as string;
      return <div>{date ? new Date(date).toLocaleDateString() : 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status =
        (row.getValue('status') as Teacher['status']) || 'inactive';
      return <StatusBadge status={status} />;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const teacher = row.original;
      const actions = [
        createViewAction(() => onView(teacher)),
        createEditAction(() => onEdit(teacher)),
        teacher.status === 'active'
          ? createSuspendAction(() => onToggleStatus(teacher))
          : createActivateAction(() => onToggleStatus(teacher)),
        createDeleteAction(() => onDelete(teacher))
      ];

      return <ActionDropdown actions={actions} />;
    }
  }
];

export default function TeachersPage() {
  const { user, isAdmin } = useUser();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter options
  const statusFilterOptions: FilterOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-leave', label: 'On Leave' }
  ];

  const departmentFilterOptions: FilterOption[] = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Physical Education', label: 'Physical Education' }
  ];

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      !searchQuery ||
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.subject &&
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || teacher.status === statusFilter;
    const matchesDepartment =
      departmentFilter === 'all' || teacher.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Action handlers
  const handleViewTeacher = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewSheetOpen(true);
  }, []);

  const handleEditTeacher = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditDialogOpen(true);
  }, []);

  const handleToggleStatus = useCallback(async (teacher: Teacher) => {
    try {
      const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
      await apiClient.updateTeacher(teacher.id, { status: newStatus as any });
      toast.success(
        `Teacher ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      );
      await fetchTeachers();
    } catch (err) {
      console.error('Error updating teacher status:', err);
      toast.error('Failed to update teacher status');
    }
  }, []);

  const handleDeletePrompt = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher) return;

    setIsDeleting(true);
    try {
      await apiClient.deleteTeacher(selectedTeacher.id);
      toast.success('Teacher deleted successfully');
      await fetchTeachers();
      setIsDeleteDialogOpen(false);
      setSelectedTeacher(null);
    } catch (err) {
      console.error('Error deleting teacher:', err);
      toast.error('Failed to delete teacher');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateTeacher = async (data: Partial<Teacher>) => {
    if (!selectedTeacher) return;

    try {
      await apiClient.updateTeacher(selectedTeacher.id, data);
      toast.success('Teacher updated successfully');
      await fetchTeachers();
      setIsEditDialogOpen(false);
      setSelectedTeacher(null);
    } catch (err) {
      console.error('Error updating teacher:', err);
      throw err;
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTeachers();
      setTeachers(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teachers');
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (
    teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      await apiClient.createTeacher(teacherData);
      await fetchTeachers();
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding teacher:', err);
      throw err;
    }
  };

  const handleBulkUpload = async (data: any[]) => {
    try {
      await apiClient.bulkUpsert('teachers', data);
      await fetchTeachers();
      setIsBulkUploadOpen(false);
    } catch (err) {
      console.error('Error bulk uploading teachers:', err);
      throw err;
    }
  };

  if (!isAdmin) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Access Denied</h1>
          <p className='mt-2 text-gray-600'>
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const columns = createColumns(
    handleViewTeacher,
    handleEditTeacher,
    handleDeletePrompt,
    handleToggleStatus
  );

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: statusFilterOptions,
      value: statusFilter,
      onChange: setStatusFilter
    },
    {
      key: 'department',
      label: 'Department',
      options: departmentFilterOptions,
      value: departmentFilter,
      onChange: setDepartmentFilter
    }
  ];

  return (
    <>
      <DataManagementPage
        title='Teachers'
        description='Manage teacher records, subjects, and departmental information'
        data={filteredTeachers}
        columns={columns}
        loading={loading}
        error={error}
        searchPlaceholder='Search teachers by name, email, or subject...'
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        showAddButton={true}
        showBulkUpload={true}
        onAdd={() => setIsAddDialogOpen(true)}
        onBulkUpload={() => setIsBulkUploadOpen(true)}
        addButtonLabel='Add Teacher'
      />

      {/* Dialogs and Sheets */}
      <AddTeacherDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddTeacher}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        resource='teachers'
        onUpload={handleBulkUpload}
      />

      {selectedTeacher && (
        <>
          <EditTeacherDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            teacher={selectedTeacher}
            onSubmit={handleUpdateTeacher}
          />

          <TeacherDetailsSheet
            open={isViewSheetOpen}
            onOpenChange={setIsViewSheetOpen}
            teacher={selectedTeacher}
            onEdit={() => handleEditTeacher(selectedTeacher)}
          />
        </>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTeacher?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
