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
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from './form-input';
import { FormSelect, type FormOption } from './form-select';
import { FormTextarea } from './form-textarea';
import { Badge } from '@/components/ui/badge';

// Student form schema
const studentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  grade: z.string().optional(),
  class: z.string().optional(),
  enrollImmediately: z.boolean(),
  phone: z.string().optional(),
  address: z.string().optional()
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentFormValues) => void;
}

const gradeOptions: FormOption[] = [
  { value: 'none', label: 'Not Graded Yet' },
  { value: '9th', label: '9th Grade' },
  { value: '10th', label: '10th Grade' },
  { value: '11th', label: '11th Grade' },
  { value: '12th', label: '12th Grade' }
];

const classOptions: FormOption[] = [
  { value: 'none', label: 'No Class Assigned' },
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

export function AddStudentDialog({
  open,
  onOpenChange,
  onSubmit
}: AddStudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      grade: undefined,
      class: undefined,
      enrollImmediately: false,
      phone: undefined,
      address: undefined
    }
  });

  const handleSubmit = async (data: StudentFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's information to add them to the system.
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

          <div className='bg-muted/30 space-y-4 rounded-lg border border-dashed p-4'>
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-semibold'>
                Enrollment Details (Optional)
              </h4>
              <Badge variant='outline' className='text-[10px] uppercase'>
                Draft Mode
              </Badge>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormSelect
                control={form.control}
                name='grade'
                label='Grade Level'
                placeholder='Select grade'
                options={gradeOptions}
              />

              <FormSelect
                control={form.control}
                name='class'
                label='Assigned Class'
                placeholder='Select class'
                options={classOptions}
              />
            </div>
          </div>

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
              {isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
