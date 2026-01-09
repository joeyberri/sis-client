'use client';

import { useRouter } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Edit,
  BookOpen,
  ShieldAlert,
  Clock,
  History,
  FileText,
  ClipboardList,
  Receipt
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
  onSuspend: (student: Student) => void;
}

const getStatusBadge = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant='default' className='bg-green-500 hover:bg-green-600'>
          Active
        </Badge>
      );
    case 'inactive':
      return <Badge variant='secondary'>Inactive</Badge>;
    case 'suspended':
      return <Badge variant='destructive'>Suspended</Badge>;
    default:
      return <Badge variant='outline'>Unknown</Badge>;
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export function StudentDetailsSheet({
  open,
  onOpenChange,
  student,
  onEdit,
  onSuspend
}: StudentDetailsSheetProps) {
  const router = useRouter();

  const handleViewAttendance = () => {
    onOpenChange(false);
    router.push(`/dashboard/attendance?student=${student.id}`);
  };

  const handleViewGrades = () => {
    onOpenChange(false);
    router.push(`/dashboard/assessments?student=${student.id}`);
  };

  const handleViewFees = () => {
    onOpenChange(false);
    router.push(`/dashboard/fees?student=${student.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-lg'>
        <SheetHeader className='pb-4'>
          <div className='mt-4 flex flex-col gap-4'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-4'>
                <Avatar className='border-primary/10 h-16 w-16 border-2'>
                  <AvatarFallback className='bg-primary/5 text-primary text-xl font-bold'>
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className='text-2xl font-bold'>
                    {student.name}
                  </SheetTitle>
                  <div className='mt-1 flex items-center gap-2'>
                    {getStatusBadge(student.status)}
                    <span className='text-muted-foreground text-sm'>
                      ID: {student.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <div className='space-y-8 py-6'>
          {/* Contact Information */}
          <section className='space-y-4'>
            <div className='text-primary flex items-center gap-2'>
              <User className='h-5 w-5' />
              <h3 className='font-semibold'>Contact Details</h3>
            </div>
            <div className='bg-muted/30 grid grid-cols-1 gap-4 rounded-xl border p-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-background rounded-lg border p-2 shadow-sm'>
                  <Mail className='text-muted-foreground h-4 w-4' />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                    Email Address
                  </p>
                  <p className='text-sm font-medium'>{student.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='bg-background rounded-lg border p-2 shadow-sm'>
                  <Phone className='text-muted-foreground h-4 w-4' />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                    Phone Number
                  </p>
                  <p className='text-sm font-medium'>
                    {student.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='bg-background rounded-lg border p-2 shadow-sm'>
                  <MapPin className='text-muted-foreground h-4 w-4' />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                    Residential Address
                  </p>
                  <p className='text-sm leading-relaxed font-medium'>
                    {student.address || 'No address on file'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section className='space-y-4'>
            <div className='text-primary flex items-center gap-2'>
              <GraduationCap className='h-5 w-5' />
              <h3 className='font-semibold'>Academic Status</h3>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-primary/5 border-primary/10 rounded-xl border p-4'>
                <p className='text-primary/70 text-xs font-medium tracking-wider uppercase'>
                  Grade Level
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <GraduationCap className='text-primary h-4 w-4' />
                  <p className='text-lg font-bold'>{student.grade || 'N/A'}</p>
                </div>
              </div>
              <div className='bg-primary/5 border-primary/10 rounded-xl border p-4'>
                <p className='text-primary/70 text-xs font-medium tracking-wider uppercase'>
                  Assigned Class
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <BookOpen className='text-primary h-4 w-4' />
                  <p className='text-lg font-bold'>{student.class || 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Dates */}
          <section className='space-y-4'>
            <div className='text-primary flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              <h3 className='font-semibold'>Registry Timeline</h3>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-xs font-medium uppercase'>
                    Enrollment
                  </span>
                </div>
                <p className='text-sm font-semibold'>
                  {student.enrollment_date
                    ? new Date(student.enrollment_date).toLocaleDateString(
                        undefined,
                        { dateStyle: 'long' }
                      )
                    : 'N/A'}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <History className='h-4 w-4' />
                  <span className='text-xs font-medium uppercase'>
                    Last Updated
                  </span>
                </div>
                <p className='text-sm font-semibold'>
                  {student.updated_at
                    ? new Date(student.updated_at).toLocaleDateString(
                        undefined,
                        { dateStyle: 'long' }
                      )
                    : 'Never'}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <Separator />
          <section className='space-y-4'>
            <h3 className='text-muted-foreground text-sm font-semibold tracking-wider uppercase'>
              Quick Actions
            </h3>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                className='rounded-full'
                size='sm'
                onClick={handleViewAttendance}
              >
                <ClipboardList className='mr-2 h-4 w-4' />
                Attendance Report
              </Button>
              <Button
                variant='outline'
                className='rounded-full'
                size='sm'
                onClick={handleViewGrades}
              >
                <FileText className='mr-2 h-4 w-4' />
                Grade Transcript
              </Button>
              <Button
                variant='outline'
                className='rounded-full'
                size='sm'
                onClick={handleViewFees}
              >
                <Receipt className='mr-2 h-4 w-4' />
                Fee Statement
              </Button>
              <Button
                variant='outline'
                className='border-destructive text-destructive hover:bg-destructive rounded-full hover:text-white'
                size='sm'
                onClick={() => onSuspend(student)}
              >
                <ShieldAlert className='mr-2 h-4 w-4' />
                {student.status === 'suspended'
                  ? 'Re-activate'
                  : 'Suspend Account'}
              </Button>
            </div>
          </section>
        </div>

        <SheetFooter className='bg-background sticky bottom-0 mt-6 border-t pt-4'>
          <div className='flex w-full gap-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button className='flex-1' onClick={onEdit}>
              <Edit className='mr-2 h-4 w-4' />
              Edit Student
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
