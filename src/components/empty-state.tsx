'use client';

import { AlertCircle, CheckCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'empty' | 'error' | 'success' | 'loading';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'empty'
}: EmptyStateProps) {
  const variantStyles = {
    empty: { bg: 'bg-slate-50 dark:bg-slate-900', icon: <Inbox className='w-16 h-16 text-muted-foreground' /> },
    error: { bg: 'bg-red-50 dark:bg-red-900/20', icon: <AlertCircle className='w-16 h-16 text-destructive' /> },
    success: { bg: 'bg-green-50 dark:bg-green-900/20', icon: <CheckCircle className='w-16 h-16 text-green-600 dark:text-green-400' /> },
    loading: { bg: 'bg-slate-50 dark:bg-slate-900', icon: <div className='w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin' /> }
  };

  const style = variantStyles[variant];

  return (
    <div className={`flex items-center justify-center min-h-[400px] rounded-lg border border-border ${style.bg}`}>
      <div className='flex flex-col items-center gap-4 text-center px-6'>
        <div className='shrink-0'>
          {icon || style.icon}
        </div>
        
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold text-foreground'>
            {title}
          </h3>
          {description && (
            <p className='text-sm text-muted-foreground max-w-xs'>
              {description}
            </p>
          )}
        </div>

        {action && (
          <Button onClick={action.onClick} variant='default' size='sm' className='mt-2'>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We're sorry, but something didn't work as expected. Please try again.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant='error'
      title={title}
      description={description}
      action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
    />
  );
}

export function LoadingState({
  title = "Loading...",
  description = "Just a moment while we fetch your data."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      variant='loading'
      title={title}
      description={description}
    />
  );
}
