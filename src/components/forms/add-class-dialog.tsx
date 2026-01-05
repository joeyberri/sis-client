'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from './form-input';
import { FormSelect, type FormOption } from './form-select';
import { FormTextarea } from './form-textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

// Class form schema
const classFormSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  subject: z.string().min(1, 'Please select a subject'),
  teacher: z.string().min(1, 'Please select a teacher'),
  grade: z.string().min(1, 'Please select a grade'),
  maxCapacity: z.number().min(1, 'Capacity must be at least 1').max(50, 'Capacity cannot exceed 50'),
  academicYear: z.string().min(1, 'Please select academic year'),
  description: z.string().optional(),
  schedule: z.array(z.object({
    day: z.string().min(1, 'Please select a day'),
    startTime: z.string().min(1, 'Please select start time'),
    endTime: z.string().min(1, 'Please select end time'),
    room: z.string().min(1, 'Please enter room number'),
  })).min(1, 'At least one schedule slot is required'),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClassFormValues) => void;
}

// Subject options
const subjectOptions: FormOption[] = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'english', label: 'English' },
  { value: 'science', label: 'Science' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'physical-education', label: 'Physical Education' },
  { value: 'computer-science', label: 'Computer Science' },
];

// Grade options
const gradeOptions: FormOption[] = [
  { value: '9th', label: '9th Grade' },
  { value: '10th', label: '10th Grade' },
  { value: '11th', label: '11th Grade' },
  { value: '12th', label: '12th Grade' },
];

// Teacher options (mock data - in real app, this would come from API)
const teacherOptions: FormOption[] = [
  { value: 'dr-sarah-johnson', label: 'Dr. Sarah Johnson' },
  { value: 'prof-michael-chen', label: 'Prof. Michael Chen' },
  { value: 'ms-emily-rodriguez', label: 'Ms. Emily Rodriguez' },
  { value: 'mr-david-thompson', label: 'Mr. David Thompson' },
  { value: 'mrs-lisa-park', label: 'Mrs. Lisa Park' },
];

// Academic year options
const academicYearOptions: FormOption[] = [
  { value: '2024-2025', label: '2024-2025' },
  { value: '2025-2026', label: '2025-2026' },
  { value: '2026-2027', label: '2026-2027' },
];

// Day options
const dayOptions: FormOption[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

// Time options (30-minute intervals)
const timeOptions: FormOption[] = [
  { value: '08:00', label: '8:00 AM' },
  { value: '08:30', label: '8:30 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '13:30', label: '1:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
];

export function AddClassDialog({ open, onOpenChange, onSubmit }: AddClassDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      subject: '',
      teacher: '',
      grade: '',
      maxCapacity: 30,
      academicYear: '2024-2025',
      description: '',
      schedule: [{ day: '', startTime: '', endTime: '', room: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  });

  const handleSubmit = async (data: ClassFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addScheduleSlot = () => {
    append({ day: '', startTime: '', endTime: '', room: '' });
  };

  const removeScheduleSlot = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class with schedule and enrollment details.
          </DialogDescription>
        </DialogHeader>

        <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="name"
              label="Class Name"
              placeholder="e.g., Advanced Mathematics 10A"
              required
            />

            <FormSelect
              control={form.control}
              name="subject"
              label="Subject"
              placeholder="Select subject"
              options={subjectOptions}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="teacher"
              label="Teacher"
              placeholder="Select teacher"
              options={teacherOptions}
              required
            />

            <FormSelect
              control={form.control}
              name="grade"
              label="Grade Level"
              placeholder="Select grade"
              options={gradeOptions}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="maxCapacity"
              type="number"
              label="Max Capacity"
              placeholder="30"
              required
            />

            <FormSelect
              control={form.control}
              name="academicYear"
              label="Academic Year"
              placeholder="Select year"
              options={academicYearOptions}
              required
            />
          </div>

          <FormTextarea
            control={form.control}
            name="description"
            label="Description (Optional)"
            placeholder="Brief description of the class"
          />

          {/* Schedule Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Class Schedule
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addScheduleSlot}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slot
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Schedule Slot {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScheduleSlot(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      control={form.control}
                      name={`schedule.${index}.day`}
                      label="Day"
                      placeholder="Select day"
                      options={dayOptions}
                      required
                    />

                    <FormInput
                      control={form.control}
                      name={`schedule.${index}.room`}
                      label="Room"
                      placeholder="e.g., Room 101"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      control={form.control}
                      name={`schedule.${index}.startTime`}
                      label="Start Time"
                      placeholder="Select start time"
                      options={timeOptions}
                      required
                    />

                    <FormSelect
                      control={form.control}
                      name={`schedule.${index}.endTime`}
                      label="End Time"
                      placeholder="Select end time"
                      options={timeOptions}
                      required
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Class'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}