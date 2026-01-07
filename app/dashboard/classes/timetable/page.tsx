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
  Clock,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  MapPin
} from 'lucide-react';

interface Class {
  id: string;
  name: string;
  subject?: string;
  teacher?: { name: string };
}

interface TimetableSlot {
  id: string;
  classId: string;
  class?: Class;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  teacherId?: string;
  teacher?: { name: string };
}

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' }
];

const TIME_SLOTS = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00'
];

export default function TimetableBuilderPage() {
  const { isAdmin, isTeacher } = useUser();
  const { getToken } = useAuth();

  const [classes, setClasses] = useState<Class[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<TimetableSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [slotForm, setSlotForm] = useState({
    classId: '',
    dayOfWeek: '1',
    startTime: '08:00',
    endTime: '09:00',
    room: ''
  });

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
      const [classesRes, slotsRes] = await Promise.all([
        apiClient.getClassesList(),
        apiClient.getTimetableSlots()
      ]);
      setClasses(classesRes.data || []);
      setTimetableSlots(slotsRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSlot = async () => {
    if (!slotForm.classId || !slotForm.startTime || !slotForm.endTime) {
      toast.error('Please fill in required fields');
      return;
    }

    // Validate time
    if (slotForm.startTime >= slotForm.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setSubmitting(true);
    try {
      if (editingSlot) {
        await apiClient.updateTimetableSlot(editingSlot.id, {
          classId: slotForm.classId,
          dayOfWeek: parseInt(slotForm.dayOfWeek),
          startTime: slotForm.startTime,
          endTime: slotForm.endTime,
          room: slotForm.room || undefined
        });
        toast.success('Schedule updated');
      } else {
        await apiClient.createTimetableSlot({
          classId: slotForm.classId,
          dayOfWeek: parseInt(slotForm.dayOfWeek),
          startTime: slotForm.startTime,
          endTime: slotForm.endTime,
          room: slotForm.room || undefined
        });
        toast.success('Schedule added');
      }

      setIsDialogOpen(false);
      setEditingSlot(null);
      resetForm();
      await fetchData();
    } catch (err: any) {
      console.error('Error saving slot:', err);
      toast.error(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;

    setSubmitting(true);
    try {
      await apiClient.deleteTimetableSlot(slotToDelete.id);
      toast.success('Schedule deleted');
      setSlotToDelete(null);
      await fetchData();
    } catch (err: any) {
      console.error('Error deleting slot:', err);
      toast.error(err.response?.data?.message || 'Failed to delete schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSlotForm({
      classId: '',
      dayOfWeek: '1',
      startTime: '08:00',
      endTime: '09:00',
      room: ''
    });
  };

  const openEditDialog = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setSlotForm({
      classId: slot.classId,
      dayOfWeek: String(slot.dayOfWeek),
      startTime: slot.startTime,
      endTime: slot.endTime,
      room: slot.room || ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSlot(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Filter slots
  const filteredSlots = timetableSlots
    .filter(
      (slot) => selectedClassId === 'all' || slot.classId === selectedClassId
    )
    .filter(
      (slot) =>
        selectedDay === 'all' || slot.dayOfWeek === parseInt(selectedDay)
    )
    .sort((a, b) => {
      // Sort by day, then by start time
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });

  // Group by day for grid view
  const slotsByDay = DAYS.slice(0, 6).map((day) => ({
    ...day,
    slots: timetableSlots
      .filter((slot) => slot.dayOfWeek === day.value)
      .filter(
        (slot) => selectedClassId === 'all' || slot.classId === selectedClassId
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }));

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS.find((d) => d.value === dayOfWeek)?.label || 'Unknown';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const canAccess = isAdmin || isTeacher;

  if (!canAccess) {
    return (
      <PageContainer>
        <EmptyState
          variant='error'
          title='Access Denied'
          description="You don't have permission to manage timetables."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title='Loading timetable...'
          description='Fetching class schedules...'
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title='Failed to load'
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
              Timetable Builder
            </h2>
            <p className='text-muted-foreground'>
              Create and manage class schedules
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className='mr-2 h-4 w-4' />
            Add Schedule
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-wrap gap-4'>
              <div className='space-y-2'>
                <Label>Filter by Class</Label>
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                >
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='All classes' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Filter by Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className='w-[150px]'>
                    <SelectValue placeholder='All days' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Days</SelectItem>
                    {DAYS.slice(0, 6).map((day) => (
                      <SelectItem key={day.value} value={String(day.value)}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Grid View */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              {selectedClassId !== 'all'
                ? `Schedule for ${classes.find((c) => c.id === selectedClassId)?.name}`
                : 'All class schedules'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timetableSlots.length === 0 ? (
              <EmptyState
                variant='empty'
                title='No schedules yet'
                description='Add your first class schedule to get started'
                action={{
                  label: 'Add Schedule',
                  onClick: openCreateDialog
                }}
              />
            ) : (
              <div className='grid grid-cols-6 gap-2'>
                {slotsByDay.map((day) => (
                  <div key={day.value} className='min-h-[200px]'>
                    <div className='bg-muted mb-2 rounded-t-md p-2 text-sm font-semibold'>
                      {day.label}
                    </div>
                    <div className='space-y-2'>
                      {day.slots.length === 0 ? (
                        <div className='text-muted-foreground p-2 text-xs'>
                          No classes
                        </div>
                      ) : (
                        day.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className='bg-primary/5 hover:bg-primary/10 cursor-pointer rounded-md border p-2 text-xs transition-colors'
                            onClick={() => openEditDialog(slot)}
                          >
                            <div className='truncate font-medium'>
                              {slot.class?.name || 'Unknown'}
                            </div>
                            <div className='text-muted-foreground mt-1 flex items-center gap-1'>
                              <Clock className='h-3 w-3' />
                              {formatTime(slot.startTime)} -{' '}
                              {formatTime(slot.endTime)}
                            </div>
                            {slot.room && (
                              <div className='text-muted-foreground flex items-center gap-1'>
                                <MapPin className='h-3 w-3' />
                                {slot.room}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* List View */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule List</CardTitle>
            <CardDescription>
              {filteredSlots.length} schedule(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSlots.length === 0 ? (
              <div className='text-muted-foreground py-8 text-center'>
                No schedules match your filters
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>
                        <Badge variant='outline'>
                          {getDayLabel(slot.dayOfWeek)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatTime(slot.startTime)} -{' '}
                        {formatTime(slot.endTime)}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {slot.class?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{slot.class?.subject || '-'}</TableCell>
                      <TableCell>{slot.room || '-'}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openEditDialog(slot)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setSlotToDelete(slot)}
                          >
                            <Trash2 className='text-destructive h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? 'Edit Schedule' : 'Add Schedule'}
            </DialogTitle>
            <DialogDescription>
              {editingSlot
                ? 'Update the class schedule'
                : 'Add a new time slot to the timetable'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>Class *</Label>
              <Select
                value={slotForm.classId}
                onValueChange={(v) => setSlotForm({ ...slotForm, classId: v })}
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
              <Label>Day *</Label>
              <Select
                value={slotForm.dayOfWeek}
                onValueChange={(v) =>
                  setSlotForm({ ...slotForm, dayOfWeek: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.slice(0, 6).map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Start Time *</Label>
                <Select
                  value={slotForm.startTime}
                  onValueChange={(v) =>
                    setSlotForm({ ...slotForm, startTime: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>End Time *</Label>
                <Select
                  value={slotForm.endTime}
                  onValueChange={(v) =>
                    setSlotForm({ ...slotForm, endTime: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Room</Label>
              <Input
                placeholder='e.g., Room 101'
                value={slotForm.room}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, room: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSlot} disabled={submitting}>
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {editingSlot ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!slotToDelete}
        onOpenChange={(open) => !open && setSlotToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule slot for{' '}
              {slotToDelete?.class?.name} on{' '}
              {getDayLabel(slotToDelete?.dayOfWeek || 0)}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlot}
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
