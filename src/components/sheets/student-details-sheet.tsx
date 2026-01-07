'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Edit,
  BookOpen
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  grade?: string;
  class?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'suspended';
  enrollment_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface StudentDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onEdit: () => void;
}

const getStatusBadge = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant='default'>Active</Badge>;
    case 'inactive':
      return <Badge variant='secondary'>Inactive</Badge>;
    case 'suspended':
      return <Badge variant='destructive'>Suspended</Badge>;
    default:
      return <Badge variant='outline'>Unknown</Badge>;
  }
};

export function StudentDetailsSheet({
  open,
  onOpenChange,
  student,
  onEdit
}: StudentDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-lg'>
        <SheetHeader>
          <div className='flex items-center justify-between'>
            <div>
              <SheetTitle className='text-xl'>{student.name}</SheetTitle>
              <SheetDescription>Student Details</SheetDescription>
            </div>
            {getStatusBadge(student.status)}
          </div>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {/* Contact Information */}
          <div>
            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
              Contact Information
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Mail className='text-muted-foreground h-4 w-4' />
                <span className='text-sm'>{student.email}</span>
              </div>
              {student.phone && (
                <div className='flex items-center gap-3'>
                  <Phone className='text-muted-foreground h-4 w-4' />
                  <span className='text-sm'>{student.phone}</span>
                </div>
              )}
              {student.address && (
                <div className='flex items-start gap-3'>
                  <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                  <span className='text-sm'>{student.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Academic Information */}
          <div>
            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
              Academic Information
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <GraduationCap className='h-4 w-4' />
                  <span className='text-xs'>Grade</span>
                </div>
                <p className='text-sm font-medium'>
                  {student.grade || 'Not assigned'}
                </p>
              </div>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  <span className='text-xs'>Class</span>
                </div>
                <p className='text-sm font-medium'>
                  {student.class || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div>
            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
              Dates
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-xs'>Enrollment Date</span>
                </div>
                <p className='text-sm font-medium'>
                  {student.enrollment_date
                    ? new Date(student.enrollment_date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-xs'>Created</span>
                </div>
                <p className='text-sm font-medium'>
                  {student.created_at
                    ? new Date(student.created_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Separator />
          <div>
            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
              Quick Actions
            </h3>
            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' size='sm' onClick={() => {}}>
                View Attendance
              </Button>
              <Button variant='outline' size='sm' onClick={() => {}}>
                View Grades
              </Button>
              <Button variant='outline' size='sm' onClick={() => {}}>
                View Fee Status
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className='mt-6'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Edit className='mr-2 h-4 w-4' />
            Edit Student
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
