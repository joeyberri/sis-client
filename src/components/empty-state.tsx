'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | React.ReactNode;
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
    empty: {
      bg: 'bg-transparent',
      icon: (
        <Icon
          icon='solar:inbox-line-duotone'
          className='text-muted-foreground/30 h-20 w-20'
        />
      )
    },
    error: {
      bg: 'bg-red-50/30 dark:bg-red-900/10',
      icon: (
        <Icon
          icon='solar:danger-circle-duotone'
          className='text-destructive/70 h-20 w-20'
        />
      )
    },
    success: {
      bg: 'bg-green-50/30 dark:bg-green-900/10',
      icon: (
        <Icon
          icon='solar:check-circle-duotone'
          className='h-20 w-20 text-green-500/70'
        />
      )
    },
    loading: {
      bg: 'bg-transparent',
      icon: (
        <div className='relative flex items-center justify-center'>
          <div className='border-primary/10 absolute h-20 w-20 rounded-full border-4' />
          <div className='border-t-primary h-20 w-20 animate-spin rounded-full border-4 border-r-transparent border-b-transparent border-l-transparent' />
          <Icons.logo className='text-primary/50 absolute size-8 animate-pulse' />
        </div>
      )
    }
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        'flex min-h-[400px] items-center justify-center rounded-3xl transition-all duration-300',
        style.bg
      )}
    >
      <div className='flex max-w-sm flex-col items-center gap-6 px-6 text-center'>
        <div className='shrink-0'>{icon || style.icon}</div>

        <div className='space-y-2'>
          <h3 className='text-foreground text-lg font-semibold'>{title}</h3>
          {description && (
            <p className='text-muted-foreground max-w-xs text-sm'>
              {description}
            </p>
          )}
        </div>

        {action && (
          <>
            {React.isValidElement(action) ? (
              action
            ) : (
              <Button
                onClick={
                  (action as { label: string; onClick: () => void }).onClick
                }
                variant='default'
                size='sm'
                className='mt-2'
              >
                {(action as { label: string; onClick: () => void }).label}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something's not quite right",
  description = 'We hit a little snag while loading this. Would you like to try again?',
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
      action={
        onRetry ? { label: 'Give it another go', onClick: onRetry } : undefined
      }
    />
  );
}

export function LoadingState({
  title = 'Just a moment...',
  description = "We're finding what you need. It won't be long!"
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState variant='loading' title={title} description={description} />
  );
}
