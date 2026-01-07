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
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { toast } from 'sonner';
import {
  Plus,
  Save,
  Loader2,
  BookOpen,
  FileText,
  Award,
  TrendingUp,
  Edit2
} from 'lucide-react';

interface Class {
  id: string;
  name: string;
  grade?: string;
  subject?: string;
}

interface Student {
  id: string;
  name: string;
  studentId?: string;
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  maxScore: number;
  weight?: number;
  classId: string;
  dueDate?: string;
}

interface Grade {
  id?: string;
  studentId: string;
  assessmentId: string;
  score: number | null;
  feedback?: string;
  gradedAt?: string;
}

interface GradeEntry {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  score: string;
  feedback: string;
  existing?: boolean;
  gradeId?: string;
}

export default function AssessmentsGradebook() {
  const { isAdmin, isTeacher } = useUser();
  const { getToken } = useAuth();

  const [classes, setClasses] = useState<Class[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');

  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Assessment dialog
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    type: 'quiz',
    maxScore: '100',
    weight: '10',
    dueDate: ''
  });

  // Feedback dialog
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackEntry, setFeedbackEntry] = useState<GradeEntry | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

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

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getClassesList();
      setClasses(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssessmentsForClass = useCallback(async (classId: string) => {
    if (!classId) {
      setAssessments([]);
      return;
    }
    try {
      const response = await apiClient.get(`/assessments?classId=${classId}`);
      setAssessments(response.data.data || []);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    }
  }, []);

  const fetchEnrollments = useCallback(async (classId: string) => {
    if (!classId) {
      setEnrollments([]);
      return;
    }
    try {
      const response = await apiClient.getClassEnrollments(classId);
      setEnrollments(response.data || []);
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    }
  }, []);

  const fetchGrades = useCallback(
    async (assessmentId: string) => {
      if (!assessmentId || enrollments.length === 0) {
        setGradeEntries([]);
        return;
      }

      try {
        const response = await apiClient.get(
          `/grades?assessmentId=${assessmentId}`
        );
        const grades = response.data.data || [];

        // Create grade map
        const gradeMap = new Map<string, Grade>();
        grades.forEach((grade: Grade) => {
          gradeMap.set(grade.studentId, grade);
        });

        // Build entries
        const entries: GradeEntry[] = enrollments.map((enrollment: any) => {
          const student = enrollment.student;
          const grade = gradeMap.get(student?.id || enrollment.studentId);

          return {
            studentId: student?.id || enrollment.studentId,
            studentName: student?.name || 'Unknown',
            studentIdNumber: student?.studentId || '-',
            score:
              grade?.score !== null && grade?.score !== undefined
                ? String(grade.score)
                : '',
            feedback: grade?.feedback || '',
            existing: !!grade,
            gradeId: grade?.id
          };
        });

        setGradeEntries(entries);
        setHasChanges(false);
      } catch (err) {
        console.error('Failed to load grades:', err);
      }
    },
    [enrollments]
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (selectedClassId) {
      fetchAssessmentsForClass(selectedClassId);
      fetchEnrollments(selectedClassId);
      setSelectedAssessmentId('');
    }
  }, [selectedClassId, fetchAssessmentsForClass, fetchEnrollments]);

  useEffect(() => {
    if (selectedAssessmentId) {
      fetchGrades(selectedAssessmentId);
    }
  }, [selectedAssessmentId, fetchGrades]);

  const updateScore = (studentId: string, score: string) => {
    setGradeEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, score } : entry
      )
    );
    setHasChanges(true);
  };

  const updateFeedback = (studentId: string, feedback: string) => {
    setGradeEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, feedback } : entry
      )
    );
    setHasChanges(true);
  };

  const openFeedbackDialog = (entry: GradeEntry) => {
    setFeedbackEntry(entry);
    setFeedbackText(entry.feedback);
    setFeedbackDialogOpen(true);
  };

  const saveFeedback = () => {
    if (feedbackEntry) {
      updateFeedback(feedbackEntry.studentId, feedbackText);
    }
    setFeedbackDialogOpen(false);
    setFeedbackEntry(null);
    setFeedbackText('');
  };

  const handleCreateAssessment = async () => {
    if (!selectedClassId || !assessmentForm.title) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      await apiClient.post('/assessments', {
        title: assessmentForm.title,
        type: assessmentForm.type,
        maxScore: parseInt(assessmentForm.maxScore) || 100,
        weight: parseInt(assessmentForm.weight) || 10,
        classId: selectedClassId,
        dueDate: assessmentForm.dueDate || undefined
      });

      toast.success('Assessment created');
      setIsAssessmentDialogOpen(false);
      setAssessmentForm({
        title: '',
        type: 'quiz',
        maxScore: '100',
        weight: '10',
        dueDate: ''
      });
      await fetchAssessmentsForClass(selectedClassId);
    } catch (err: any) {
      console.error('Error creating assessment:', err);
      toast.error(err.response?.data?.message || 'Failed to create assessment');
    } finally {
      setSaving(false);
    }
  };

  const saveGrades = async () => {
    if (!selectedAssessmentId) return;

    setSaving(true);
    try {
      const grades = gradeEntries
        .filter((entry) => entry.score !== '')
        .map((entry) => ({
          studentId: entry.studentId,
          assessmentId: selectedAssessmentId,
          score: parseFloat(entry.score),
          feedback: entry.feedback || undefined
        }));

      await apiClient.post('/grades/bulk', { grades });
      toast.success('Grades saved successfully');
      setHasChanges(false);
      await fetchGrades(selectedAssessmentId);
    } catch (err: any) {
      console.error('Error saving grades:', err);
      toast.error(err.response?.data?.message || 'Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedAssessment = assessments.find(
    (a) => a.id === selectedAssessmentId
  );

  // Calculate stats
  const gradedEntries = gradeEntries.filter((e) => e.score !== '');
  const avgScore =
    gradedEntries.length > 0
      ? gradedEntries.reduce((sum, e) => sum + parseFloat(e.score), 0) /
        gradedEntries.length
      : 0;
  const highestScore =
    gradedEntries.length > 0
      ? Math.max(...gradedEntries.map((e) => parseFloat(e.score)))
      : 0;
  const lowestScore =
    gradedEntries.length > 0
      ? Math.min(...gradedEntries.map((e) => parseFloat(e.score)))
      : 0;

  const canAccess = isAdmin || isTeacher;

  if (!canAccess) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to access the gradebook."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading gradebook...'
          description='Fetching classes and assessments...'
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
            <h2 className='text-2xl font-bold tracking-tight'>Grade Entry</h2>
            <p className='text-muted-foreground'>
              Record and manage student grades for assessments
            </p>
          </div>
          <div className='flex gap-2'>
            {selectedClassId && (
              <Button
                variant='outline'
                onClick={() => setIsAssessmentDialogOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                New Assessment
              </Button>
            )}
            {hasChanges && (
              <Button onClick={saveGrades} disabled={saving}>
                {saving ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Save className='mr-2 h-4 w-4' />
                )}
                Save Grades
              </Button>
            )}
          </div>
        </div>

        {/* Class and Assessment Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Select Class & Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <Label>Class</Label>
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a class' />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.subject && `- ${cls.subject}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Assessment</Label>
                <Select
                  value={selectedAssessmentId}
                  onValueChange={setSelectedAssessmentId}
                  disabled={!selectedClassId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an assessment' />
                  </SelectTrigger>
                  <SelectContent>
                    {assessments.map((assessment) => (
                      <SelectItem key={assessment.id} value={assessment.id}>
                        {assessment.title} ({assessment.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAssessment && (
                <div className='space-y-2'>
                  <Label>Max Score</Label>
                  <Input value={selectedAssessment.maxScore} disabled />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {selectedAssessmentId && gradeEntries.length > 0 && (
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Graded</CardTitle>
                <FileText className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {gradedEntries.length}/{gradeEntries.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Average</CardTitle>
                <TrendingUp className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{avgScore.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Highest</CardTitle>
                <Award className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  {highestScore}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Lowest</CardTitle>
                <BookOpen className='h-4 w-4 text-amber-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-amber-600'>
                  {lowestScore}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grade Entry Table */}
        {selectedAssessmentId && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Grades</CardTitle>
              <CardDescription>
                {selectedClass?.name} - {selectedAssessment?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gradeEntries.length === 0 ? (
                <EmptyState
                  variant='empty'
                  title='No students enrolled'
                  description='This class has no enrolled students yet.'
                />
              ) : (
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className='w-32'>
                          Score (/{selectedAssessment?.maxScore})
                        </TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gradeEntries.map((entry) => (
                        <TableRow key={entry.studentId}>
                          <TableCell className='font-mono text-sm'>
                            {entry.studentIdNumber}
                          </TableCell>
                          <TableCell className='font-medium'>
                            {entry.studentName}
                          </TableCell>
                          <TableCell>
                            <Input
                              type='number'
                              min='0'
                              max={selectedAssessment?.maxScore || 100}
                              value={entry.score}
                              onChange={(e) =>
                                updateScore(entry.studentId, e.target.value)
                              }
                              className='w-24'
                              placeholder='—'
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => openFeedbackDialog(entry)}
                              className='justify-start text-left'
                            >
                              {entry.feedback ? (
                                <span className='max-w-[150px] truncate'>
                                  {entry.feedback}
                                </span>
                              ) : (
                                <span className='text-muted-foreground flex items-center'>
                                  <Edit2 className='mr-1 h-3 w-3' /> Add
                                </span>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {entry.score !== '' ? (
                              <Badge variant='default'>Graded</Badge>
                            ) : (
                              <Badge variant='outline'>Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {hasChanges && gradeEntries.length > 0 && (
                <div className='mt-4 flex justify-end'>
                  <Button onClick={saveGrades} disabled={saving}>
                    {saving ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Save className='mr-2 h-4 w-4' />
                    )}
                    Save Grades
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedClassId && (
          <Card>
            <CardContent className='py-12'>
              <EmptyState
                variant='empty'
                title='Select a class'
                description='Choose a class to view and enter grades'
              />
            </CardContent>
          </Card>
        )}

        {selectedClassId && !selectedAssessmentId && (
          <Card>
            <CardContent className='py-12'>
              <EmptyState
                variant='empty'
                title='Select an assessment'
                description={
                  assessments.length === 0
                    ? 'Create an assessment first to start grading'
                    : 'Choose an assessment to enter grades'
                }
                action={
                  assessments.length === 0
                    ? {
                        label: 'Create Assessment',
                        onClick: () => setIsAssessmentDialogOpen(true)
                      }
                    : undefined
                }
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Assessment Dialog */}
      <Dialog
        open={isAssessmentDialogOpen}
        onOpenChange={setIsAssessmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Assessment</DialogTitle>
            <DialogDescription>
              Add a new assessment for {selectedClass?.name}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>Title *</Label>
              <Input
                placeholder='e.g., Quiz 1, Midterm Exam'
                value={assessmentForm.title}
                onChange={(e) =>
                  setAssessmentForm({
                    ...assessmentForm,
                    title: e.target.value
                  })
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Type</Label>
                <Select
                  value={assessmentForm.type}
                  onValueChange={(v) =>
                    setAssessmentForm({ ...assessmentForm, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='quiz'>Quiz</SelectItem>
                    <SelectItem value='test'>Test</SelectItem>
                    <SelectItem value='exam'>Exam</SelectItem>
                    <SelectItem value='assignment'>Assignment</SelectItem>
                    <SelectItem value='project'>Project</SelectItem>
                    <SelectItem value='homework'>Homework</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Max Score</Label>
                <Input
                  type='number'
                  value={assessmentForm.maxScore}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      maxScore: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Weight (%)</Label>
                <Input
                  type='number'
                  value={assessmentForm.weight}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      weight: e.target.value
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>Due Date</Label>
                <Input
                  type='date'
                  value={assessmentForm.dueDate}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      dueDate: e.target.value
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsAssessmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAssessment} disabled={saving}>
              {saving && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              Feedback for {feedbackEntry?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Textarea
              placeholder='Enter feedback for this grade...'
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setFeedbackDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveFeedback}>Save Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
