'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  differenceInDays
} from 'date-fns';

export interface UpcomingEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'exam' | 'holiday' | 'meeting' | 'deadline' | 'event' | 'assignment';
  href?: string;
}

export interface UpcomingEventsCardProps {
  title?: string;
  description?: string;
  events: UpcomingEvent[];
  maxItems?: number;
  viewAllHref?: string;
  className?: string;
}

const eventTypeConfig = {
  exam: {
    icon: 'solar:document-add-duotone',
    bg: 'bg-orange-500',
    textBg: 'bg-orange-50 dark:bg-orange-500/10',
    text: 'text-orange-900 dark:text-orange-100',
    subtext: 'text-orange-600 dark:text-orange-400'
  },
  holiday: {
    icon: 'solar:sun-fog-duotone',
    bg: 'bg-emerald-500',
    textBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-900 dark:text-emerald-100',
    subtext: 'text-emerald-600 dark:text-emerald-400'
  },
  meeting: {
    icon: 'solar:users-group-two-rounded-duotone',
    bg: 'bg-blue-500',
    textBg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-900 dark:text-blue-100',
    subtext: 'text-blue-600 dark:text-blue-400'
  },
  deadline: {
    icon: 'solar:alarm-duotone',
    bg: 'bg-rose-500',
    textBg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-900 dark:text-rose-100',
    subtext: 'text-rose-600 dark:text-rose-400'
  },
  event: {
    icon: 'solar:calendar-mark-duotone',
    bg: 'bg-purple-500',
    textBg: 'bg-purple-50 dark:bg-purple-500/10',
    text: 'text-purple-900 dark:text-purple-100',
    subtext: 'text-purple-600 dark:text-purple-400'
  },
  assignment: {
    icon: 'solar:clipboard-text-duotone',
    bg: 'bg-amber-500',
    textBg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-900 dark:text-amber-100',
    subtext: 'text-amber-600 dark:text-amber-400'
  }
};

function getDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  const days = differenceInDays(date, new Date());
  if (days < 7 && days > 0) return `In ${days} days`;
  return format(date, 'MMM d');
}

export function UpcomingEventsCard({
  title = 'Upcoming Events',
  description = 'From school calendar',
  events,
  maxItems = 5,
  viewAllHref = '/dashboard/calendar',
  className
}: UpcomingEventsCardProps) {
  const sortedEvents = [...events]
    .filter((e) => !isPast(e.date) || isToday(e.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, maxItems);

  return (
    <Card className={cn('border-none shadow-sm', className)}>
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
      <CardContent className='space-y-3'>
        {sortedEvents.length === 0 ? (
          <p className='text-muted-foreground py-4 text-center text-sm'>
            No upcoming events
          </p>
        ) : (
          sortedEvents.map((event) => {
            const config = eventTypeConfig[event.type];
            const content = (
              <div
                className={cn(
                  'group flex items-center gap-4 rounded-xl p-3 transition-colors',
                  config.textBg,
                  event.href && 'cursor-pointer hover:opacity-80'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 flex-col items-center justify-center rounded-lg text-white shadow-sm',
                    config.bg
                  )}
                >
                  <span className='text-xs font-bold uppercase'>
                    {format(event.date, 'MMM')}
                  </span>
                  <span className='text-lg leading-none font-bold'>
                    {format(event.date, 'd')}
                  </span>
                </div>
                <div className='min-w-0 flex-1'>
                  <p
                    className={cn(
                      'truncate text-sm font-semibold',
                      config.text
                    )}
                  >
                    {event.title}
                  </p>
                  <p className={cn('text-xs', config.subtext)}>
                    {getDateLabel(event.date)}
                    {event.description && ` · ${event.description}`}
                  </p>
                </div>
              </div>
            );

            return event.href ? (
              <Link key={event.id} href={event.href}>
                {content}
              </Link>
            ) : (
              <div key={event.id}>{content}</div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
