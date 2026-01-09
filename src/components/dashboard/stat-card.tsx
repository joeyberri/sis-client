'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export type StatCardVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // Solar icon name
  description?: string;
  href?: string;
  trend?: number | { value: number; label?: string };
  loading?: boolean;
  variant?: StatCardVariant;
  className?: string;
}

const variantColors = {
  default: {
    icon: 'text-primary',
    bg: 'bg-primary/10',
    solid: 'bg-primary',
    trend: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
  },
  success: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    solid: 'bg-emerald-500',
    trend: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
  },
  warning: {
    icon: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    solid: 'bg-amber-500',
    trend: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'
  },
  danger: {
    icon: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    solid: 'bg-rose-500',
    trend: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'
  },
  info: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    solid: 'bg-blue-500',
    trend: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
  }
};

export function StatCard({
  title,
  value,
  icon,
  description,
  href,
  trend,
  loading = false,
  variant = 'default',
  className
}: StatCardProps) {
  const colors = variantColors[variant];

  const content = (
    <Card
      className={cn(
        'group bg-background relative overflow-hidden border-none transition-all duration-300 hover:shadow-lg',
        href && 'cursor-pointer',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]',
          colors.solid
        )}
      />
      <CardContent className='p-6'>
        {loading ? (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-10 w-10 rounded-xl' />
              <Skeleton className='h-5 w-14 rounded-full' />
            </div>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-8 w-20' />
          </div>
        ) : (
          <>
            <div className='mb-4 flex items-center justify-between'>
              <div
                className={cn('rounded-xl p-2.5 transition-colors', colors.bg)}
              >
                <Icon icon={icon} className={cn('h-6 w-6', colors.icon)} />
              </div>
              {trend !== undefined &&
                (typeof trend === 'number'
                  ? trend !== 0
                  : trend.value !== 0) && (
                  <Badge
                    variant='outline'
                    className={cn(
                      'border-none px-2 font-medium',
                      (typeof trend === 'number' ? trend : trend.value) > 0
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
                    )}
                  >
                    {(typeof trend === 'number' ? trend : trend.value) > 0
                      ? '+'
                      : ''}
                    {typeof trend === 'number' ? trend : trend.value}%
                  </Badge>
                )}
            </div>
            <div>
              <p className='text-muted-foreground mb-1 text-sm font-medium'>
                {title}
              </p>
              <div className='flex items-end gap-2'>
                <div className='text-3xl font-bold tracking-tight'>{value}</div>
                {description && (
                  <p className='text-muted-foreground mb-1.5 text-xs'>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      {href && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full',
            colors.solid
          )}
        />
      )}
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function StatCardSkeleton() {
  return (
    <Card className='bg-background relative overflow-hidden border-none'>
      <CardContent className='p-6'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-10 rounded-xl' />
            <Skeleton className='h-5 w-14 rounded-full' />
          </div>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-8 w-20' />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardGrid({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-4', className)}>
      {children}
    </div>
  );
}
