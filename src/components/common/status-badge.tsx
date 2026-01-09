'use client';

import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

export type StatusVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'on-leave'
  | 'completed'
  | 'draft'
  | 'published';

interface StatusBadgeProps {
  status: StatusVariant | string;
  customVariants?: Record<
    string,
    {
      variant: 'default' | 'secondary' | 'destructive' | 'outline';
      label: string;
    }
  >;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const defaultStatusConfig: Record<
  StatusVariant,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    label: string;
  }
> = {
  active: { variant: 'default', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'outline', label: 'Pending' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  'on-leave': { variant: 'secondary', label: 'On Leave' },
  completed: { variant: 'default', label: 'Completed' },
  draft: { variant: 'outline', label: 'Draft' },
  published: { variant: 'default', label: 'Published' }
};

export function StatusBadge({
  status,
  customVariants,
  variant
}: StatusBadgeProps) {
  const config = customVariants?.[status] ||
    defaultStatusConfig[status as StatusVariant] || {
      variant: 'outline' as const,
      label: status
    };

  return <Badge variant={variant || config.variant}>{config.label}</Badge>;
}
