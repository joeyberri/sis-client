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
import { Checkbox } from '@/components/ui/checkbox';
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
  Users,
  Plus,
  Trash2,
  Search,
  Loader2,
  UserPlus,
  GraduationCap,
  Filter,
  ChevronRight
} from 'lucide-react';

interface Class {
  id: string;
  name: string;
  grade?: string;
  subject?: string;
  teacher?: { name: string };
  maxCapacity?: number;
  enrolledCount?: number;
  academicYearId?: string;
}

interface Student {
  id: string;
  name: string;
  email?: string;
  grade?: string;
  studentId?: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: string;
  enrolledAt: string;
  student?: Student;
  class?: Class;
}

export default function EnrollmentPage() {
  const { isAdmin, isTeacher } = useUser();
  const { getToken } = useAuth();

  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection states
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');

  // Dialog states
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] =
    useState<Enrollment | null>(null);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [classesRes, studentsRes] = await Promise.all([
        apiClient.getClassesList(),
        apiClient.getStudents()
      ]);
      setClasses(classesRes.data || []);
      setStudents(studentsRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollmentsForClass = useCallback(async (classId: string) => {
    if (!classId) {
      setEnrollments([]);
      return;
    }
    try {
      const response = await apiClient.getClassEnrollments(classId);
      setEnrollments(response.data || []);
    } catch (err) {
      console.error('Failed to load enrollments:', err);
      toast.error('Failed to load enrollments for this class');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedClassId) {
      fetchEnrollmentsForClass(selectedClassId);
    }
  }, [selectedClassId, fetchEnrollmentsForClass]);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedStudents(new Set());
  };

  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const newSelection = new Set(filteredIds);
    setSelectedStudents(newSelection);
  };

  const clearSelection = () => {
    setSelectedStudents(new Set());
  };

  const handleEnrollStudents = async () => {
    if (!selectedClassId || selectedStudents.size === 0) {
      toast.error('Please select a class and at least one student');
      return;
    }

    setSubmitting(true);
    try {
      const studentIds = Array.from(selectedStudents);
      await apiClient.enrollStudentsInClass(selectedClassId, studentIds);
      toast.success(`Enrolled ${studentIds.length} student(s) successfully`);
      setIsEnrollDialogOpen(false);
      setSelectedStudents(new Set());
      await fetchEnrollmentsForClass(selectedClassId);
    } catch (err: any) {
      console.error('Error enrolling students:', err);
      toast.error(err.response?.data?.message || 'Failed to enroll students');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveEnrollment = async () => {
    if (!enrollmentToDelete) return;

    setSubmitting(true);
    try {
      await apiClient.removeStudentFromClass(
        enrollmentToDelete.classId,
        enrollmentToDelete.studentId
      );
      toast.success('Student removed from class');
      setEnrollmentToDelete(null);
      await fetchEnrollmentsForClass(selectedClassId);
    } catch (err: any) {
      console.error('Error removing enrollment:', err);
      toast.error(err.response?.data?.message || 'Failed to remove student');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter students not already enrolled in selected class
  const enrolledStudentIds = new Set(enrollments.map((e) => e.studentId));
  const availableStudents = students.filter(
    (s) => !enrolledStudentIds.has(s.id)
  );

  const filteredStudents = availableStudents.filter((student) => {
    const matchesSearch =
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = !gradeFilter || student.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Get unique grades for filter
  const uniqueGrades = Array.from(
    new Set(students.map((s) => s.grade).filter(Boolean))
  );

  const canAccess = isAdmin || isTeacher;

  if (!canAccess) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to manage enrollments."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading enrollment data...'
          description='Fetching classes and students...'
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title='Failed to load data'
          description={error}
          onRetry={fetchData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Class Enrollment
            </h2>
            <p className='text-muted-foreground'>
              Manage student enrollment in classes
            </p>
          </div>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Select Class</CardTitle>
            <CardDescription>
              Choose a class to manage its enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <Label>Class</Label>
                <Select
                  value={selectedClassId}
                  onValueChange={handleClassChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a class' />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.grade && `(${cls.grade})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClass && (
                <>
                  <div className='space-y-2'>
                    <Label>Subject</Label>
                    <Input value={selectedClass.subject || 'N/A'} disabled />
                  </div>
                  <div className='space-y-2'>
                    <Label>Capacity</Label>
                    <Input
                      value={`${enrollments.length} / ${selectedClass.maxCapacity || 'Unlimited'}`}
                      disabled
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedClassId && (
          <>
            {/* Current Enrollments */}
            <Card>
              <CardHeader>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                  <div>
                    <CardTitle>Current Enrollments</CardTitle>
                    <CardDescription>
                      {enrollments.length} student(s) enrolled in{' '}
                      {selectedClass?.name}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsEnrollDialogOpen(true)}>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Enroll Students
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <EmptyState
                    variant='empty'
                    title='No students enrolled'
                    description="Add students to this class by clicking 'Enroll Students'"
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Enrolled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className='font-mono text-sm'>
                            {enrollment.student?.studentId || '-'}
                          </TableCell>
                          <TableCell className='font-medium'>
                            {enrollment.student?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {enrollment.student?.email || '-'}
                          </TableCell>
                          <TableCell>
                            {enrollment.student?.grade || '-'}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              enrollment.enrolledAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setEnrollmentToDelete(enrollment)}
                            >
                              <Trash2 className='text-destructive h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Summary Stats */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Classes
              </CardTitle>
              <GraduationCap className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{classes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Students
              </CardTitle>
              <Users className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {selectedClass
                  ? `${selectedClass.name} Enrollment`
                  : 'Select a class'}
              </CardTitle>
              <ChevronRight className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {selectedClassId ? enrollments.length : '-'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enroll Students Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className='flex max-h-[80vh] max-w-2xl flex-col'>
          <DialogHeader>
            <DialogTitle>Enroll Students in {selectedClass?.name}</DialogTitle>
            <DialogDescription>
              Select students to enroll in this class. Students already enrolled
              are not shown.
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center gap-4 py-2'>
            <div className='relative flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Search students...'
                className='pl-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className='w-[150px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Grade' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>All Grades</SelectItem>
                {uniqueGrades.map((grade) => (
                  <SelectItem key={grade} value={grade || ''}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <span>{selectedStudents.size} selected</span>
            <Button variant='link' size='sm' onClick={selectAllFiltered}>
              Select All ({filteredStudents.length})
            </Button>
            {selectedStudents.size > 0 && (
              <Button variant='link' size='sm' onClick={clearSelection}>
                Clear
              </Button>
            )}
          </div>

          <div className='flex-1 overflow-y-auto rounded-md border'>
            {filteredStudents.length === 0 ? (
              <div className='text-muted-foreground p-8 text-center'>
                {availableStudents.length === 0
                  ? 'All students are already enrolled in this class'
                  : 'No students match your search criteria'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-12'></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className='cursor-pointer'
                      onClick={() => toggleStudentSelection(student.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.has(student.id)}
                          onCheckedChange={() =>
                            toggleStudentSelection(student.id)
                          }
                        />
                      </TableCell>
                      <TableCell className='font-medium'>
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email || '-'}</TableCell>
                      <TableCell>{student.grade || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEnrollDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnrollStudents}
              disabled={submitting || selectedStudents.size === 0}
            >
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Enroll {selectedStudents.size} Student(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Enrollment Confirmation */}
      <AlertDialog
        open={!!enrollmentToDelete}
        onOpenChange={(open) => !open && setEnrollmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student from Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              {enrollmentToDelete?.student?.name} from {selectedClass?.name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveEnrollment}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
