'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from './form-input';
import { FormSelect, type FormOption } from './form-select';
import { FormTextarea } from './form-textarea';
import { Loader2 } from 'lucide-react';

// Student form schema
const studentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  grade: z.string().optional(),
  class: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional()
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface Student {
  id: string;
  name: string;
  email: string;
  grade?: string;
  class?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onSubmit: (data: Partial<StudentFormValues>) => Promise<void>;
}

const gradeOptions: FormOption[] = [
  { value: '9th', label: '9th Grade' },
  { value: '10th', label: '10th Grade' },
  { value: '11th', label: '11th Grade' },
  { value: '12th', label: '12th Grade' }
];

const classOptions: FormOption[] = [
  { value: '9A', label: '9A' },
  { value: '9B', label: '9B' },
  { value: '9C', label: '9C' },
  { value: '10A', label: '10A' },
  { value: '10B', label: '10B' },
  { value: '10C', label: '10C' },
  { value: '11A', label: '11A' },
  { value: '11B', label: '11B' },
  { value: '11C', label: '11C' },
  { value: '12A', label: '12A' },
  { value: '12B', label: '12B' },
  { value: '12C', label: '12C' }
];

const statusOptions: FormOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
];

export function EditStudentDialog({
  open,
  onOpenChange,
  student,
  onSubmit
}: EditStudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student.name || '',
      email: student.email || '',
      grade: student.grade || '',
      class: student.class || '',
      phone: student.phone || '',
      address: student.address || '',
      status: student.status || 'active'
    }
  });

  // Reset form when student changes
  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name || '',
        email: student.email || '',
        grade: student.grade || '',
        class: student.class || '',
        phone: student.phone || '',
        address: student.address || '',
        status: student.status || 'active'
      });
    }
  }, [student, form]);

  const handleSubmit = async (data: StudentFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update the student's information below.
          </DialogDescription>
        </DialogHeader>

        <Form
          form={form}
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-4'
        >
          <FormInput
            control={form.control}
            name='name'
            label='Full Name'
            placeholder="Enter student's full name"
            required
          />

          <FormInput
            control={form.control}
            name='email'
            type='email'
            label='Email'
            placeholder='student@school.edu'
            required
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormSelect
              control={form.control}
              name='grade'
              label='Grade'
              placeholder='Select grade'
              options={gradeOptions}
            />

            <FormSelect
              control={form.control}
              name='class'
              label='Class'
              placeholder='Select class'
              options={classOptions}
            />
          </div>

          <FormSelect
            control={form.control}
            name='status'
            label='Status'
            placeholder='Select status'
            options={statusOptions}
          />

          <FormInput
            control={form.control}
            name='phone'
            label='Phone (Optional)'
            placeholder='+1 (555) 123-4567'
          />

          <FormTextarea
            control={form.control}
            name='address'
            label='Address (Optional)'
            placeholder="Enter student's address"
          />

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
