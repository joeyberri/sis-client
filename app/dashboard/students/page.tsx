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
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

// Import common components
import {
  DataManagementPage,
  StatusBadge,
  ActionDropdown,
  createViewAction,
  createEditAction,
  createDeleteAction,
  FilterOption
} from '@/components/common';

// Import existing dialogs and sheets
import { AddStudentDialog } from '@/components/forms/add-student-dialog';
import { EditStudentDialog } from '@/components/forms/edit-student-dialog';
import { StudentDetailsSheet } from '@/components/sheets/student-details-sheet';
import { BulkUploadDialog } from '@/components/forms/bulk-upload-dialog';
import { apiClient } from '@/lib/api/client';

// Student type definition
interface Student {
  id: string;
  name: string;
  email: string;
  grade?: string;
  class?: string;
  enrollment_date?: string;
  status?: 'active' | 'inactive' | 'suspended';
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

// Column definitions
const createColumns = (
  onView: (student: Student) => void,
  onEdit: (student: Student) => void,
  onDelete: (student: Student) => void,
  onSuspend: (student: Student) => void
): ColumnDef<Student>[] => [
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
            <Icons.ChevronUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <Icons.ChevronDown className='ml-2 h-4 w-4' />
          ) : (
            <Icons.ChevronUp className='ml-2 h-4 w-4 opacity-50' />
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
            <Icons.ChevronUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <Icons.ChevronDown className='ml-2 h-4 w-4' />
          ) : (
            <Icons.ChevronUp className='ml-2 h-4 w-4 opacity-50' />
          )}
        </Button>
      );
    }
  },
  {
    accessorKey: 'grade',
    header: 'Grade',
    cell: ({ row }) => <div>{row.getValue('grade') || 'N/A'}</div>
  },
  {
    accessorKey: 'class',
    header: 'Class',
    cell: ({ row }) => <div>{row.getValue('class') || 'N/A'}</div>
  },
  {
    accessorKey: 'enrollment_date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Enrollment Date
          {column.getIsSorted() === 'asc' ? (
            <Icons.ChevronUp className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'desc' ? (
            <Icons.ChevronDown className='ml-2 h-4 w-4' />
          ) : (
            <Icons.ChevronUp className='ml-2 h-4 w-4 opacity-50' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('enrollment_date') as string;
      return <div>{date ? new Date(date).toLocaleDateString() : 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status =
        (row.getValue('status') as Student['status']) || 'inactive';
      return <StatusBadge status={status} />;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      const actions = [
        createViewAction(() => onView(student)),
        createEditAction(() => onEdit(student)),
        {
          label: student.status === 'suspended' ? 'Activate' : 'Suspend',
          icon: <Icons.ShieldAlert className='mr-2 h-4 w-4' />,
          onClick: () => onSuspend(student)
        },
        createDeleteAction(() => onDelete(student))
      ];

      return <ActionDropdown actions={actions} />;
    }
  }
];

export default function StudentsPage() {
  const { user, isAdmin } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter options
  const statusFilterOptions: FilterOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const gradeFilterOptions: FilterOption[] = [
    { value: '9th', label: '9th Grade' },
    { value: '10th', label: '10th Grade' },
    { value: '11th', label: '11th Grade' },
    { value: '12th', label: '12th Grade' }
  ];

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Action handlers
  const handleViewStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsViewSheetOpen(true);
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  }, []);

  const handleSuspendStudent = useCallback(async (student: Student) => {
    try {
      const newStatus = student.status === 'suspended' ? 'active' : 'suspended';
      await apiClient.updateStudent(student.id, { status: newStatus as any });
      toast.success(
        `Student ${
          newStatus === 'suspended' ? 'suspended' : 'activated'
        } successfully`
      );
      await fetchStudents();
    } catch (err) {
      console.error('Error updating student status:', err);
      toast.error('Failed to update student status');
    }
  }, []);

  const handleDeletePrompt = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    setIsDeleting(true);
    try {
      await apiClient.deleteStudent(selectedStudent.id);
      toast.success('Student deleted successfully');
      await fetchStudents();
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateStudent = async (data: Partial<Student>) => {
    if (!selectedStudent) return;

    try {
      await apiClient.updateStudent(selectedStudent.id, data);
      toast.success('Student updated successfully');
      await fetchStudents();
      setIsEditDialogOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error updating student:', err);
      throw err;
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStudents();
      setStudents(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (
    studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      await apiClient.createStudent(studentData);
      await fetchStudents();
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding student:', err);
      throw err;
    }
  };

  const handleBulkUpload = async (data: any[]) => {
    try {
      await apiClient.bulkUpsert('students', data);
      await fetchStudents();
      setIsBulkUploadOpen(false);
    } catch (err) {
      console.error('Error bulk uploading students:', err);
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
    handleViewStudent,
    handleEditStudent,
    handleDeletePrompt,
    handleSuspendStudent
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
      key: 'grade',
      label: 'Grade',
      options: gradeFilterOptions,
      value: gradeFilter,
      onChange: setGradeFilter
    }
  ];

  return (
    <>
      <DataManagementPage
        title='Students'
        description='Manage your student body. Keep track of enrollments, profiles, and academic status.'
        icon='solar:users-group-rounded-duotone'
        data={filteredStudents}
        columns={columns}
        loading={loading}
        error={error}
        searchPlaceholder='Search students by name or email...'
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        showAddButton={true}
        showBulkUpload={true}
        onAdd={() => setIsAddDialogOpen(true)}
        onBulkUpload={() => setIsBulkUploadOpen(true)}
        addButtonLabel='Add Student'
      />

      {/* Dialogs and Sheets */}
      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddStudent}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        resource='students'
        onUpload={handleBulkUpload}
      />

      {selectedStudent && (
        <>
          <EditStudentDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            student={selectedStudent}
            onSubmit={handleUpdateStudent}
          />

          <StudentDetailsSheet
            open={isViewSheetOpen}
            onOpenChange={setIsViewSheetOpen}
            student={selectedStudent}
            onEdit={() => handleEditStudent(selectedStudent)}
            onSuspend={handleSuspendStudent}
          />
        </>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This
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
