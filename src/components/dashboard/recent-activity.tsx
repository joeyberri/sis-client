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
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: Date | string;
  type?: 'success' | 'warning' | 'error' | 'info';
  icon?: string;
  href?: string;
}

export interface RecentActivityCardProps {
  title?: string;
  description?: string;
  activities: ActivityItem[];
  maxItems?: number;
  viewAllHref?: string;
  className?: string;
}

const typeConfig = {
  success: {
    dot: 'bg-emerald-500',
    icon: 'solar:check-circle-duotone',
    iconColor: 'text-emerald-500'
  },
  warning: {
    dot: 'bg-amber-500',
    icon: 'solar:danger-triangle-duotone',
    iconColor: 'text-amber-500'
  },
  error: {
    dot: 'bg-rose-500',
    icon: 'solar:close-circle-duotone',
    iconColor: 'text-rose-500'
  },
  info: {
    dot: 'bg-blue-500',
    icon: 'solar:info-circle-duotone',
    iconColor: 'text-blue-500'
  }
};

export function RecentActivityCard({
  title = 'Recent Activity',
  description = 'Latest updates across the system',
  activities,
  maxItems = 5,
  viewAllHref,
  className
}: RecentActivityCardProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card
      className={cn(
        'from-background to-muted/20 overflow-hidden border-none bg-gradient-to-br shadow-sm',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {viewAllHref && (
          <Button variant='ghost' size='sm' asChild>
            <Link href={viewAllHref} className='text-xs'>
              View all
              <Icon
                icon='solar:arrow-right-up-linear'
                className='ml-1 h-3 w-3'
              />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <p className='text-muted-foreground py-4 text-center text-sm'>
            No recent activity
          </p>
        ) : (
          <div className='space-y-6'>
            {displayActivities.map((activity) => {
              const config = typeConfig[activity.type || 'info'];
              const timestamp =
                typeof activity.timestamp === 'string'
                  ? activity.timestamp
                  : formatDistanceToNow(activity.timestamp, {
                      addSuffix: true
                    });

              const content = (
                <div className='flex gap-4'>
                  {activity.icon ? (
                    <Icon
                      icon={activity.icon}
                      className={cn(
                        'mt-0.5 h-5 w-5 shrink-0',
                        config.iconColor
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        config.dot
                      )}
                    />
                  )}
                  <div className='min-w-0 flex-1 space-y-1'>
                    <p className='text-sm leading-snug font-medium'>
                      {activity.message}
                    </p>
                    <p className='text-muted-foreground text-xs'>{timestamp}</p>
                  </div>
                </div>
              );

              return activity.href ? (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className='hover:bg-muted/50 -mx-2 block rounded-lg px-2 py-1 transition-colors'
                >
                  {content}
                </Link>
              ) : (
                <div key={activity.id}>{content}</div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
