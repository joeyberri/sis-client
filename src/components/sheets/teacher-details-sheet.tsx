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
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  Edit,
  Award,
  Building,
  Clock,
  Users,
  Plus
} from 'lucide-react';

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
  hire_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface TeacherDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher;
  onEdit: () => void;
}

const getStatusBadge = (status: Teacher['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant='default'>Active</Badge>;
    case 'inactive':
      return <Badge variant='secondary'>Inactive</Badge>;
    case 'on-leave':
      return <Badge variant='outline'>On Leave</Badge>;
    default:
      return <Badge variant='outline'>Unknown</Badge>;
  }
};

export function TeacherDetailsSheet({
  open,
  onOpenChange,
  teacher,
  onEdit
}: TeacherDetailsSheetProps) {
  const router = useRouter();

  const handleViewSchedule = () => {
    onOpenChange(false);
    router.push(`/dashboard/timetables?teacher=${teacher.id}`);
  };

  const handleViewClasses = () => {
    onOpenChange(false);
    router.push(`/dashboard/classes?teacher=${teacher.id}`);
  };

  const handleAssignSubject = () => {
    onOpenChange(false);
    router.push(`/dashboard/subjects?assign=${teacher.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-lg'>
        <SheetHeader>
          <div className='flex items-center justify-between'>
            <div>
              <SheetTitle className='text-xl'>{teacher.name}</SheetTitle>
              <SheetDescription>Teacher Profile</SheetDescription>
            </div>
            {getStatusBadge(teacher.status)}
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
                <span className='text-sm'>{teacher.email}</span>
              </div>
              {teacher.phone && (
                <div className='flex items-center gap-3'>
                  <Phone className='text-muted-foreground h-4 w-4' />
                  <span className='text-sm'>{teacher.phone}</span>
                </div>
              )}
              {teacher.address && (
                <div className='flex items-start gap-3'>
                  <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                  <span className='text-sm'>{teacher.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Professional Information */}
          <div>
            <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
              Professional Information
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  <span className='text-xs'>Subject</span>
                </div>
                <p className='text-sm font-medium'>
                  {teacher.subject || 'Not assigned'}
                </p>
              </div>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Building className='h-4 w-4' />
                  <span className='text-xs'>Department</span>
                </div>
                <p className='text-sm font-medium'>
                  {teacher.department || 'Not assigned'}
                </p>
              </div>
            </div>
            {teacher.qualifications && (
              <div className='mt-4 space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Award className='h-4 w-4' />
                  <span className='text-xs'>Qualifications</span>
                </div>
                <p className='text-sm'>{teacher.qualifications}</p>
              </div>
            )}
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
                  <span className='text-xs'>Hire Date</span>
                </div>
                <p className='text-sm font-medium'>
                  {teacher.hire_date
                    ? new Date(teacher.hire_date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className='space-y-1'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-xs'>Created</span>
                </div>
                <p className='text-sm font-medium'>
                  {teacher.created_at
                    ? new Date(teacher.created_at).toLocaleDateString()
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
              <Button variant='outline' size='sm' onClick={handleViewSchedule}>
                <Clock className='mr-2 h-4 w-4' />
                View Schedule
              </Button>
              <Button variant='outline' size='sm' onClick={handleViewClasses}>
                <Users className='mr-2 h-4 w-4' />
                View Classes
              </Button>
              <Button variant='outline' size='sm' onClick={handleAssignSubject}>
                <Plus className='mr-2 h-4 w-4' />
                Assign Subject
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
            Edit Teacher
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
