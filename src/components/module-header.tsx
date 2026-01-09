'use client';

import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ModuleHeaderProps {
  title: string;
  description?: string;
  icon: string;
  actions?: ReactNode;
  className?: string;
}

export function ModuleHeader({
  title,
  description,
  icon,
  actions,
  className
}: ModuleHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center',
        className
      )}
    >
      <div className='flex items-center gap-4'>
        <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm'>
          <Icon icon={icon} className='h-7 w-7' />
        </div>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            {title}
          </h1>
          {description && (
            <p className='text-muted-foreground mt-0.5 max-w-2xl text-sm leading-relaxed'>
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className='flex items-center gap-3'>{actions}</div>}
    </div>
  );
}
