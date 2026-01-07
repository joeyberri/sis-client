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
import { Checkbox } from '@/components/ui/checkbox';
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
import { EmptyState, LoadingState, ErrorState } from '@/components/empty-state';
import {
  FileText,
  Download,
  Eye,
  RefreshCw,
  Users,
  GraduationCap
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';

interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  termName: string;
  generatedAt: string;
  status: 'pending' | 'generated' | 'failed';
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  className?: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface AcademicTerm {
  id: string;
  name: string;
  isCurrent: boolean;
}

export default function ReportCardsPage() {
  const { isAdmin, isTeacher } = useUser();
  const { getToken } = useAuth();

  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

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
      const [studentsRes, classesRes, termsRes] = await Promise.all([
        apiClient.getStudents().catch(() => ({ data: [] })),
        apiClient.getClassesList().catch(() => ({ data: [] })),
        apiClient.getAcademicTerms().catch(() => ({ data: [] }))
      ]);

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
      setTerms(termsRes.data || []);

      // Set default term to current term
      const currentTerm = (termsRes.data || []).find(
        (t: AcademicTerm) => t.isCurrent
      );
      if (currentTerm) {
        setSelectedTerm(currentTerm.id);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter students by selected class
  const filteredStudents = selectedClass
    ? students.filter((s) => s.className === selectedClass)
    : students;

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleGenerateReportCards = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    if (!selectedTerm) {
      toast.error('Please select an academic term');
      return;
    }

    try {
      setGenerating(true);
      // Call API to generate report cards
      await apiClient.generateReportCards({
        studentIds: selectedStudents,
        termId: selectedTerm,
        classId: selectedClass || undefined
      });
      toast.success(`Generated ${selectedStudents.length} report card(s)`);
      setGenerateDialogOpen(false);
      setSelectedStudents([]);
    } catch (err) {
      console.error('Failed to generate report cards:', err);
      toast.error('Failed to generate report cards');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = (student: Student) => {
    setPreviewStudent(student);
    setPreviewDialogOpen(true);
  };

  const handleDownload = async (studentId: string) => {
    try {
      toast.info('Preparing download...');
      // In production, this would trigger a download
      await apiClient.downloadReportCard(studentId, selectedTerm);
      toast.success('Report card downloaded');
    } catch (err) {
      toast.error('Download failed');
    }
  };

  if (!isAdmin && !isTeacher) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to access report cards."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading...'
          description='Fetching report card data...'
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Report Cards</h1>
            <p className='text-muted-foreground'>
              Generate and download student report cards
            </p>
          </div>
          <Button
            onClick={() => setGenerateDialogOpen(true)}
            disabled={selectedStudents.length === 0}
          >
            <FileText className='mr-2 h-4 w-4' />
            Generate ({selectedStudents.length})
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-3'>
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
                Active Classes
              </CardTitle>
              <GraduationCap className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{classes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Selected</CardTitle>
              <FileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {selectedStudents.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
            <CardDescription>
              Select class and term for report card generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='All Classes' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Select Term' />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.name} {term.isCurrent && '(Current)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant='outline' onClick={fetchData}>
                <RefreshCw className='mr-2 h-4 w-4' />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Select students to generate report cards
                </CardDescription>
              </div>
              <Button variant='outline' size='sm' onClick={handleSelectAll}>
                {selectedStudents.length === filteredStudents.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <EmptyState
                title='No students found'
                description={
                  selectedClass
                    ? 'No students in this class'
                    : 'Add students to generate report cards'
                }
              />
            ) : (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-10'>
                        <Checkbox
                          checked={
                            selectedStudents.length ===
                              filteredStudents.length &&
                            filteredStudents.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() =>
                              handleSelectStudent(student.id)
                            }
                          />
                        </TableCell>
                        <TableCell className='font-medium'>
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.className || '—'}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handlePreview(student)}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDownload(student.id)}
                            >
                              <Download className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Dialog */}
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Report Cards</DialogTitle>
              <DialogDescription>
                You are about to generate {selectedStudents.length} report
                card(s) for the selected term.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Selected students: {selectedStudents.length}
                </p>
                <p className='text-muted-foreground text-sm'>
                  Term:{' '}
                  {terms.find((t) => t.id === selectedTerm)?.name ||
                    'Not selected'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleGenerateReportCards} disabled={generating}>
                {generating ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Report Card Preview</DialogTitle>
              <DialogDescription>
                {previewStudent?.firstName} {previewStudent?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 rounded-lg border p-4'>
              <div className='border-b pb-4 text-center'>
                <h2 className='text-xl font-bold'>Student Report Card</h2>
                <p className='text-muted-foreground'>
                  {terms.find((t) => t.id === selectedTerm)?.name}
                </p>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-muted-foreground text-sm'>Student Name</p>
                  <p className='font-medium'>
                    {previewStudent?.firstName} {previewStudent?.lastName}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Class</p>
                  <p className='font-medium'>
                    {previewStudent?.className || '—'}
                  </p>
                </div>
              </div>
              <div className='mt-4'>
                <p className='text-muted-foreground mb-2 text-sm'>
                  Grades will be displayed here based on the term's assessments.
                </p>
                <Badge>Preview Mode</Badge>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setPreviewDialogOpen(false)}
              >
                Close
              </Button>
              {previewStudent && (
                <Button onClick={() => handleDownload(previewStudent.id)}>
                  <Download className='mr-2 h-4 w-4' />
                  Download
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
