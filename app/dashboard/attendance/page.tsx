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
import { Textarea } from '@/components/ui/textarea';
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
import { Icons } from '@/components/icons';
import { PageHeader } from '@/components/common/page-header';
import apiClient from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface Class {
  id: string;
  name: string;
  grade?: string;
}

interface Student {
  id: string;
  name: string;
  studentId?: string;
  email?: string;
}

interface AttendanceRecord {
  id?: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  student?: Student;
}

interface AttendanceEntry {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  status: AttendanceStatus;
  notes: string;
  existing?: boolean;
  recordId?: string;
}

export default function AttendancePage() {
  const { isAdmin, isTeacher } = useUser();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance entries (state for marking)
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Note dialog
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteEntry, setNoteEntry] = useState<AttendanceEntry | null>(null);
  const [noteText, setNoteText] = useState('');

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
      const response = await apiClient.getClassesList();
      setClasses(response.data || []);
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  }, []);

  const fetchAttendanceData = useCallback(async () => {
    if (!selectedClassId) {
      setEntries([]);
      return;
    }

    try {
      setLoading(true);

      // Fetch enrolled students and existing attendance
      const [enrollmentsRes, attendanceRes] = await Promise.all([
        apiClient.getClassEnrollments(selectedClassId),
        apiClient.getAttendance({
          classId: selectedClassId,
          date: selectedDate
        })
      ]);

      const enrollments = enrollmentsRes.data || [];
      const existingAttendance = attendanceRes.data || [];

      // Create attendance map
      const attendanceMap = new Map<string, AttendanceRecord>();
      existingAttendance.forEach((record: AttendanceRecord) => {
        attendanceMap.set(record.studentId, record);
      });

      // Build entries list
      const newEntries: AttendanceEntry[] = enrollments.map(
        (enrollment: any) => {
          const student = enrollment.student;
          const existing = attendanceMap.get(
            student?.id || enrollment.studentId
          );

          return {
            studentId: student?.id || enrollment.studentId,
            studentName: student?.name || 'Unknown',
            studentIdNumber: student?.studentId || '-',
            status: existing?.status || 'present',
            notes: existing?.notes || '',
            existing: !!existing,
            recordId: existing?.id
          };
        }
      );

      setEntries(newEntries);
      setHasChanges(false);
      setError(null);
    } catch (err) {
      console.error('Failed to load attendance:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [selectedClassId, selectedDate]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, status } : entry
      )
    );
    setHasChanges(true);
  };

  const updateNote = (studentId: string, notes: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, notes } : entry
      )
    );
    setHasChanges(true);
  };

  const openNoteDialog = (entry: AttendanceEntry) => {
    setNoteEntry(entry);
    setNoteText(entry.notes);
    setNoteDialogOpen(true);
  };

  const saveNote = () => {
    if (noteEntry) {
      updateNote(noteEntry.studentId, noteText);
    }
    setNoteDialogOpen(false);
    setNoteEntry(null);
    setNoteText('');
  };

  const markAllAs = (status: AttendanceStatus) => {
    setEntries((prev) => prev.map((entry) => ({ ...entry, status })));
    setHasChanges(true);
  };

  const saveAttendance = async () => {
    if (!selectedClassId) return;

    setSaving(true);
    try {
      const records = entries.map((entry) => ({
        studentId: entry.studentId,
        classId: selectedClassId,
        date: selectedDate,
        status: entry.status,
        notes: entry.notes || undefined
      }));

      await apiClient.bulkMarkAttendance(
        selectedClassId,
        selectedDate,
        records
      );
      toast.success('Attendance saved successfully');
      setHasChanges(false);
      await fetchAttendanceData(); // Refresh to get record IDs
    } catch (err: any) {
      console.error('Error saving attendance:', err);
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  // Filter entries
  const filteredEntries = entries.filter(
    (entry) =>
      entry.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    present: entries.filter((e) => e.status === 'present').length,
    absent: entries.filter((e) => e.status === 'absent').length,
    late: entries.filter((e) => e.status === 'late').length,
    excused: entries.filter((e) => e.status === 'excused').length,
    total: entries.length
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const canAccess = isAdmin || isTeacher;

  if (!canAccess) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to manage attendance."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className='space-y-6'>
        <PageHeader
          title='Attendance'
          description="Take attendance and keep track of your students for the day. It's the simplest way to keep records current."
          icon='solar:user-check-rounded-duotone'
          actions={
            <>
              <Button variant='outline' className='h-10 border-2 font-medium'>
                <Icon icon='solar:download-duotone' className='mr-2 h-4 w-4' />
                Export Report
              </Button>
              {hasChanges && (
                <Button
                  onClick={saveAttendance}
                  disabled={saving}
                  className='shadow-primary/20 h-10 px-5 font-medium shadow-lg'
                >
                  {saving ? (
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Icon
                      icon='solar:diskette-duotone'
                      className='mr-2 h-4 w-4'
                    />
                  )}
                  Save Attendance
                </Button>
              )}
            </>
          }
        />

        {/* Class and Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Select Class & Date</CardTitle>
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
                        {cls.name} {cls.grade && `(${cls.grade})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Date</Label>
                <Input
                  type='date'
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              {selectedClass && (
                <div className='space-y-2'>
                  <Label>Students</Label>
                  <Input value={`${entries.length} enrolled`} disabled />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {selectedClassId && entries.length > 0 && (
          <div className='grid gap-4 md:grid-cols-5'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total</CardTitle>
                <Icons.UserCheck className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Present</CardTitle>
                <Icons.CheckCircle2 className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  {stats.present}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {stats.total > 0 &&
                    `${Math.round((stats.present / stats.total) * 100)}%`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Absent</CardTitle>
                <Icons.X className='text-destructive h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-destructive text-2xl font-bold'>
                  {stats.absent}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Late</CardTitle>
                <Icons.Clock className='h-4 w-4 text-amber-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-amber-600'>
                  {stats.late}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Excused</CardTitle>
                <Icons.AlertCircle className='h-4 w-4 text-blue-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-blue-600'>
                  {stats.excused}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Table */}
        {selectedClassId && (
          <Card>
            <CardHeader>
              <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                <div>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>
                    {selectedClass?.name} -{' '}
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => markAllAs('present')}
                  >
                    Mark All Present
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => markAllAs('absent')}
                  >
                    Mark All Absent
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingState
                  title='Loading attendance...'
                  description='Fetching students...'
                />
              ) : error ? (
                <ErrorState
                  title='Failed to load'
                  description={error}
                  onRetry={fetchAttendanceData}
                />
              ) : entries.length === 0 ? (
                <EmptyState
                  variant='empty'
                  title='No students enrolled'
                  description='This class has no enrolled students yet.'
                />
              ) : (
                <>
                  <div className='flex items-center py-4'>
                    <Input
                      placeholder='Search students...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='max-w-sm'
                    />
                  </div>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEntries.map((entry) => (
                          <TableRow key={entry.studentId}>
                            <TableCell className='font-mono text-sm'>
                              {entry.studentIdNumber}
                            </TableCell>
                            <TableCell className='font-medium'>
                              {entry.studentName}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-1'>
                                <Button
                                  variant={
                                    entry.status === 'present'
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className={
                                    entry.status === 'present'
                                      ? 'bg-green-600 hover:bg-green-700'
                                      : ''
                                  }
                                  onClick={() =>
                                    updateStatus(entry.studentId, 'present')
                                  }
                                >
                                  <Icons.CheckCircle2 className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant={
                                    entry.status === 'absent'
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                  size='sm'
                                  onClick={() =>
                                    updateStatus(entry.studentId, 'absent')
                                  }
                                >
                                  <Icons.X className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant={
                                    entry.status === 'late'
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className={
                                    entry.status === 'late'
                                      ? 'bg-amber-600 hover:bg-amber-700'
                                      : ''
                                  }
                                  onClick={() =>
                                    updateStatus(entry.studentId, 'late')
                                  }
                                >
                                  <Icons.Clock className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant={
                                    entry.status === 'excused'
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className={
                                    entry.status === 'excused'
                                      ? 'bg-blue-600 hover:bg-blue-700'
                                      : ''
                                  }
                                  onClick={() =>
                                    updateStatus(entry.studentId, 'excused')
                                  }
                                >
                                  <Icons.AlertCircle className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => openNoteDialog(entry)}
                              >
                                {entry.notes ? (
                                  <span className='text-muted-foreground max-w-[150px] truncate text-sm'>
                                    {entry.notes}
                                  </span>
                                ) : (
                                  <span className='text-muted-foreground text-sm'>
                                    Add note...
                                  </span>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {hasChanges && (
                    <div className='mt-4 flex justify-end'>
                      <Button onClick={saveAttendance} disabled={saving}>
                        {saving ? (
                          <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <Icons.check className='mr-2 h-4 w-4' />
                        )}
                        Save Attendance
                      </Button>
                    </div>
                  )}
                </>
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
                description='Choose a class from the dropdown above to mark attendance'
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note for {noteEntry?.studentName}'s attendance
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Textarea
              placeholder='Enter note (e.g., left early, medical appointment, etc.)'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
