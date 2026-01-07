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

// Teacher form schema
const teacherFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  qualifications: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).optional()
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject?: string;
  department?: string;
  phone?: string;
  qualifications?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'on-leave';
}

interface EditTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher;
  onSubmit: (data: Partial<TeacherFormValues>) => Promise<void>;
}

const departmentOptions: FormOption[] = [
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Science', label: 'Science' },
  { value: 'English', label: 'English' },
  { value: 'Social Studies', label: 'Social Studies' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Physical Education', label: 'Physical Education' },
  { value: 'Languages', label: 'Languages' },
  { value: 'Technology', label: 'Technology' }
];

const statusOptions: FormOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on-leave', label: 'On Leave' }
];

export function EditTeacherDialog({
  open,
  onOpenChange,
  teacher,
  onSubmit
}: EditTeacherDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: teacher.name || '',
      email: teacher.email || '',
      subject: teacher.subject || '',
      department: teacher.department || '',
      phone: teacher.phone || '',
      qualifications: teacher.qualifications || '',
      address: teacher.address || '',
      status: teacher.status || 'active'
    }
  });

  // Reset form when teacher changes
  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name || '',
        email: teacher.email || '',
        subject: teacher.subject || '',
        department: teacher.department || '',
        phone: teacher.phone || '',
        qualifications: teacher.qualifications || '',
        address: teacher.address || '',
        status: teacher.status || 'active'
      });
    }
  }, [teacher, form]);

  const handleSubmit = async (data: TeacherFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating teacher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Update the teacher's information below.
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
            placeholder="Enter teacher's full name"
            required
          />

          <FormInput
            control={form.control}
            name='email'
            type='email'
            label='Email'
            placeholder='teacher@school.edu'
            required
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormInput
              control={form.control}
              name='subject'
              label='Subject'
              placeholder='Primary subject'
            />

            <FormSelect
              control={form.control}
              name='department'
              label='Department'
              placeholder='Select department'
              options={departmentOptions}
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
            label='Phone'
            placeholder='+1 (555) 123-4567'
          />

          <FormTextarea
            control={form.control}
            name='qualifications'
            label='Qualifications'
            placeholder='e.g., M.Ed., B.Sc. Mathematics'
          />

          <FormTextarea
            control={form.control}
            name='address'
            label='Address'
            placeholder='Enter address'
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
