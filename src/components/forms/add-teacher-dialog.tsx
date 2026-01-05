'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

// Teacher form schema
const teacherFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  department: z.string().min(1, 'Please select a department'),
  phone: z.string().optional(),
  address: z.string().optional(),
  qualifications: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TeacherFormValues) => void;
}

// Subject options
const subjectOptions: FormOption[] = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'english', label: 'English' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'art', label: 'Art' },
  { value: 'music', label: 'Music' },
  { value: 'physical-education', label: 'Physical Education' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'biology', label: 'Biology' },
];

// Department options
const departmentOptions: FormOption[] = [
  { value: 'mathematics', label: 'Mathematics Department' },
  { value: 'english', label: 'English Department' },
  { value: 'science', label: 'Science Department' },
  { value: 'humanities', label: 'Humanities Department' },
  { value: 'arts', label: 'Arts Department' },
  { value: 'physical-education', label: 'Physical Education Department' },
  { value: 'technology', label: 'Technology Department' },
];

export function AddTeacherDialog({ open, onOpenChange, onSubmit }: AddTeacherDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      department: '',
      phone: '',
      address: '',
      qualifications: '',
    },
  });

  const handleSubmit = async (data: TeacherFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding teacher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Enter the teacher's information to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <Form form={form} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Enter teacher's full name"
            required
          />

          <FormInput
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="teacher@school.edu"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="subject"
              label="Subject"
              placeholder="Select subject"
              options={subjectOptions}
              required
            />

            <FormSelect
              control={form.control}
              name="department"
              label="Department"
              placeholder="Select department"
              options={departmentOptions}
              required
            />
          </div>

          <FormInput
            control={form.control}
            name="phone"
            label="Phone (Optional)"
            placeholder="+1 (555) 123-4567"
          />

          <FormTextarea
            control={form.control}
            name="address"
            label="Address (Optional)"
            placeholder="Enter teacher's address"
          />

          <FormTextarea
            control={form.control}
            name="qualifications"
            label="Qualifications (Optional)"
            placeholder="Enter teacher's qualifications and experience"
          />

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
              {isLoading ? 'Adding...' : 'Add Teacher'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}