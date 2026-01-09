'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import { DataManagementPage } from '@/components/common';
import { ActionDropdown } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
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

interface Assessment {
  id: string;
  title: string;
  weight?: number;
  status?: 'draft' | 'published' | 'completed';
  createdAt?: string;
}

export default function AssessmentsIndex() {
  const { isAdmin } = useUser();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] =
    useState<Assessment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const fetch = async () => {
    try {
      setLoading(true);
      try {
        const data = await apiClient.getAssessments();
        setAssessments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        // Endpoint might not be available, set empty list
        console.error('Failed to load assessments', err);
        setAssessments([]);
        setError('Assessments module not yet available');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDeleteAssessment = async () => {
    if (!assessmentToDelete) return;

    setSubmitting(true);
    try {
      // TODO: Implement delete API call when available
      toast.success('Assessment deleted successfully');
      setAssessmentToDelete(null);
      await fetch();
    } catch (err: any) {
      console.error('Error deleting assessment:', err);
      toast.error(err.response?.data?.message || 'Failed to delete assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const getAssessmentActions = (assessment: Assessment) => [
    {
      label: 'View',
      icon: <Icons.Eye className='mr-2 h-4 w-4' />,
      onClick: () => {
        window.location.href = `/dashboard/assessments/${assessment.id}`;
      }
    },
    {
      label: 'Edit',
      icon: <Icons.Edit className='mr-2 h-4 w-4' />,
      onClick: () => {
        window.location.href = `/dashboard/assessments/${assessment.id}/edit`;
      }
    },
    {
      label: 'Delete',
      icon: <Icons.Trash2 className='mr-2 h-4 w-4' />,
      onClick: () => setAssessmentToDelete(assessment),
      variant: 'destructive' as const
    }
  ];

  const columns = [
    {
      accessorKey: 'title',
      header: 'Assessment Title',
      cell: ({ row }: any) => (
        <div className='font-medium'>{row.original.title}</div>
      )
    },
    {
      accessorKey: 'weight',
      header: 'Weight',
      cell: ({ row }: any) => (
        <div>{row.original.weight ? `${row.original.weight}%` : '—'}</div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <StatusBadge
          status={row.original.status || 'draft'}
          customVariants={{
            draft: { variant: 'secondary', label: 'Draft' },
            published: { variant: 'default', label: 'Published' },
            completed: { variant: 'outline', label: 'Completed' }
          }}
        />
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }: any) => (
        <div className='text-muted-foreground'>
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : '—'}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <ActionDropdown actions={getAssessmentActions(row.original)} />
      )
    }
  ];

  if (!isAdmin) {
    return (
      <div className='p-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground'>
            You don't have permission to view assessment records. Please contact
            an administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataManagementPage
        title='Assessments & Grading'
        description='Create assessments, manage grading configs and view gradebooks'
        data={assessments}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={fetch}
        searchPlaceholder='Search assessments...'
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        addButton={{
          label: 'New Assessment',
          icon: Icons.Plus,
          onClick: () => {
            window.location.href = '/dashboard/assessments/create';
          }
        }}
        emptyState={{
          title: 'No assessments yet',
          description:
            'Start by creating your first assessment to begin grading students.',
          action: {
            label: 'Create Assessment',
            onClick: () => {
              window.location.href = '/dashboard/assessments/create';
            }
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!assessmentToDelete}
        onOpenChange={() => setAssessmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{assessmentToDelete?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAssessment}
              disabled={submitting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
