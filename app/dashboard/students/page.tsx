'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
  Loader2,
  Upload
} from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { toast } from 'sonner';

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

// Helper function for status badges
const getStatusBadge = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant='default'>Active</Badge>;
    case 'inactive':
      return <Badge variant='secondary'>Inactive</Badge>;
    case 'suspended':
      return <Badge variant='destructive'>Suspended</Badge>;
    default:
      return <Badge variant='outline'>Unknown</Badge>;
  }
};

// Import the add student dialog
import { AddStudentDialog } from '@/components/forms/add-student-dialog';
import { EditStudentDialog } from '@/components/forms/edit-student-dialog';
import { StudentDetailsSheet } from '@/components/sheets/student-details-sheet';
import { BulkUploadDialog } from '@/components/forms/bulk-upload-dialog';
import { apiClient } from '@/lib/api/client';

// Action callbacks interface for column definitions
interface ActionCallbacks {
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

// Column definitions creator function
const createColumns = (callbacks: ActionCallbacks): ColumnDef<Student>[] => [
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
      const date = row.getValue('enrollment_date') as string;
      return <div>{date ? new Date(date).toLocaleDateString() : 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Student['status'];
      return getStatusBadge(status);
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => callbacks.onView(student)}>
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => callbacks.onEdit(student)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => callbacks.onDelete(student)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Student['status'];
      return getStatusBadge(status);
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className='mr-2 h-4 w-4' />
              Edit Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-destructive'>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function StudentsPage() {
  const { user, isAdmin } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Edit/View/Delete state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // TanStack Table setup
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Action handlers
  const handleViewStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsViewSheetOpen(true);
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
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

  // Create columns with action callbacks
  const columns = createColumns({
    onView: handleViewStudent,
    onEdit: handleEditStudent,
    onDelete: handleDeletePrompt
  });

  const table = useReactTable({
    data: students,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

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
      await fetchStudents(); // Refresh the list
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding student:', err);
      throw err; // Re-throw to let the dialog handle the error
    }
  };

  const handleBulkUpload = async (data: any[]) => {
    try {
      await apiClient.bulkUpsert('students', data);
      await fetchStudents(); // Refresh the list
      setIsBulkUploadOpen(false);
    } catch (err) {
      console.error('Error bulk uploading students:', err);
      throw err;
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to view student records. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading students...'
          description='Fetching your student records...'
        />
      </PageContainer>
    );
  }

  if (error && students.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title='Failed to load students'
          description="We couldn't fetch your student records. Please check your connection and try again."
          onRetry={fetchStudents}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Students Management</h1>
            <p className='text-muted-foreground'>
              Manage student records, enrollment, and academic information
            </p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={() => setIsBulkUploadOpen(true)} variant='outline'>
              <Upload className='mr-2 h-4 w-4' />
              Bulk Upload
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Add Student
            </Button>
          </div>
        </div>

        {/* Show empty state if no students */}
        {students.length === 0 ? (
          <EmptyState
            title='No students yet'
            description='Start by adding your first student to the system.'
            action={{
              label: 'Add First Student',
              onClick: () => setIsAddDialogOpen(true)
            }}
          />
        ) : (
          <>
            {/* Summary Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{students.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {students.filter((s) => s.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Suspended
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {students.filter((s) => s.status === 'suspended').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {
                      students.filter((s) => {
                        if (!s.enrollment_date) return false;
                        const enrollmentDate = new Date(s.enrollment_date);
                        const now = new Date();
                        return (
                          enrollmentDate.getMonth() === now.getMonth() &&
                          enrollmentDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  A list of all students enrolled in the school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center py-4'>
                  <Input
                    placeholder='Filter students...'
                    value={
                      (table.getColumn('name')?.getFilterValue() as string) ??
                      ''
                    }
                    onChange={(event) =>
                      table
                        .getColumn('name')
                        ?.setFilterValue(event.target.value)
                    }
                    className='max-w-sm'
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className='ml-auto'>
                        Columns <ChevronDown className='ml-2 h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className='capitalize'
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className='h-24 text-center'
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className='flex items-center justify-end space-x-2 py-4'>
                  <div className='text-muted-foreground flex-1 text-sm'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className='space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddStudent}
      />

      {/* Edit Student Dialog */}
      {selectedStudent && (
        <EditStudentDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedStudent(null);
          }}
          student={selectedStudent}
          onSubmit={handleUpdateStudent}
        />
      )}

      {/* View Student Details Sheet */}
      {selectedStudent && (
        <StudentDetailsSheet
          open={isViewSheetOpen}
          onOpenChange={(open) => {
            setIsViewSheetOpen(open);
            if (!open) setSelectedStudent(null);
          }}
          student={selectedStudent}
          onEdit={() => {
            setIsViewSheetOpen(false);
            setIsEditDialogOpen(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This
              action cannot be undone. All associated records including
              attendance, grades, and enrollment data will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        resource='students'
        onUpload={handleBulkUpload}
      />
    </PageContainer>
  );
}
