'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface QuickAction {
  id: string;
  title: string;
  description?: string;
  icon: string; // Solar icon name
  href: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export interface QuickActionsCardProps {
  title?: string;
  description?: string;
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const variantStyles = {
  default: 'hover:bg-muted/50',
  primary: 'hover:bg-primary/5 hover:border-primary/20',
  success:
    'hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-500/5',
  warning: 'hover:bg-amber-50 hover:border-amber-200 dark:hover:bg-amber-500/5',
  danger: 'hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-500/5'
};

const iconStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-rose-600'
};

export function QuickActionsCard({
  title = 'Quick Actions',
  description = 'Common tasks and shortcuts',
  actions,
  columns = 4,
  className
}: QuickActionsCardProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <Card className={cn('border-none shadow-sm', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn('grid grid-cols-1 gap-3', gridCols[columns])}>
          {actions.map((action) => (
            <Link key={action.id} href={action.href}>
              <Button
                asChild={false}
                variant='outline'
                className={cn(
                  'h-auto w-full justify-start px-4 py-3 transition-all',
                  variantStyles[action.variant || 'default']
                )}
              >
                <span className='flex items-center'>
                  <Icon
                    icon={action.icon}
                    className={cn(
                      'mr-3 h-5 w-5',
                      iconStyles[action.variant || 'default']
                    )}
                  />
                  <span className='text-left'>
                    <span className='block text-sm font-medium'>
                      {action.title}
                    </span>
                    {action.description && (
                      <span className='text-muted-foreground mt-0.5 block text-xs'>
                        {action.description}
                      </span>
                    )}
                  </span>
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionButton({
  action,
  className
}: {
  action: QuickAction;
  className?: string;
}) {
  return (
    <Button
      asChild
      variant='outline'
      className={cn(
        'h-auto justify-start px-4 py-3 transition-all',
        variantStyles[action.variant || 'default'],
        className
      )}
    >
      <Link href={action.href}>
        <Icon
          icon={action.icon}
          className={cn(
            'mr-3 h-5 w-5',
            iconStyles[action.variant || 'default']
          )}
        />
        <div className='text-left'>
          <p className='text-sm font-medium'>{action.title}</p>
          {action.description && (
            <p className='text-muted-foreground mt-0.5 text-xs'>
              {action.description}
            </p>
          )}
        </div>
      </Link>
    </Button>
  );
}
