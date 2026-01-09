'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  actions?: ReactNode;
  showAddButton?: boolean;
  showBulkUpload?: boolean;
  onAdd?: () => void;
  onBulkUpload?: () => void;
  addButtonLabel?: string;
  addButton?: {
    label: string;
    icon?: any;
    onClick: () => void;
  };
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  showAddButton = false,
  showBulkUpload = false,
  onAdd,
  onBulkUpload,
  addButtonLabel = 'Add New',
  addButton,
  className = ''
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center',
        className
      )}
    >
      <div className='flex items-center gap-4'>
        {icon && (
          <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm'>
            <Icon icon={icon} className='h-7 w-7' />
          </div>
        )}
        <div className='space-y-1'>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            {title}
          </h1>
          {description && (
            <p className='text-muted-foreground max-w-2xl text-sm leading-relaxed'>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        {actions}

        {showBulkUpload && (
          <Button
            variant='outline'
            onClick={onBulkUpload}
            className='h-10 border-2 font-medium'
          >
            <Icons.Upload className='mr-2 h-4 w-4' />
            Bulk Upload
          </Button>
        )}

        {showAddButton && !addButton && (
          <Button
            onClick={onAdd}
            className='shadow-primary/20 h-10 px-5 font-medium shadow-lg'
          >
            <Icons.Plus className='mr-2 h-4 w-4' />
            {addButtonLabel}
          </Button>
        )}

        {addButton && (
          <Button
            onClick={addButton.onClick}
            className='shadow-primary/20 h-10 px-5 font-medium shadow-lg'
          >
            {addButton.icon && <addButton.icon className='mr-2 h-4 w-4' />}
            {addButton.label}
          </Button>
        )}
      </div>
    </div>
  );
}
