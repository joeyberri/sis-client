'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserX,
  UserCheck
} from 'lucide-react';

export interface ActionItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface ActionDropdownProps {
  actions: ActionItem[];
  trigger?: ReactNode;
  className?: string;
}

export function ActionDropdown({
  actions,
  trigger,
  className
}: ActionDropdownProps) {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant='ghost' className={`h-8 w-8 p-0 ${className}`}>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={
              action.variant === 'destructive'
                ? 'text-destructive focus:text-destructive'
                : ''
            }
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Predefined action helpers
export const createViewAction = (onClick: () => void): ActionItem => ({
  label: 'View Details',
  icon: <Eye className='mr-2 h-4 w-4' />,
  onClick
});

export const createEditAction = (onClick: () => void): ActionItem => ({
  label: 'Edit',
  icon: <Edit className='mr-2 h-4 w-4' />,
  onClick
});

export const createDeleteAction = (onClick: () => void): ActionItem => ({
  label: 'Delete',
  icon: <Trash2 className='mr-2 h-4 w-4' />,
  onClick,
  variant: 'destructive'
});

export const createSuspendAction = (onClick: () => void): ActionItem => ({
  label: 'Suspend',
  icon: <UserX className='mr-2 h-4 w-4' />,
  onClick,
  variant: 'destructive'
});

export const createActivateAction = (onClick: () => void): ActionItem => ({
  label: 'Activate',
  icon: <UserCheck className='mr-2 h-4 w-4' />,
  onClick
});
