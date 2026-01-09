'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { CalendarEvent, EVENT_COLORS, EVENT_ICON_NAMES } from './types';

interface CalendarAgendaProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onToggleComplete?: (event: CalendarEvent) => void;
}

export function CalendarAgenda({
  events,
  onEventClick,
  onToggleComplete
}: CalendarAgendaProps) {
  const sortedEvents = events.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <div className='space-y-4'>
      {sortedEvents.map((event) => {
        const iconName = EVENT_ICON_NAMES[event.type];
        return (
          <div
            key={event.id}
            className={cn(
              'hover:bg-accent/50 flex cursor-pointer items-start gap-4 rounded-lg border p-4',
              event.completed && 'opacity-60'
            )}
            onClick={() => onEventClick(event)}
          >
            <div className={cn('rounded-lg p-2', EVENT_COLORS[event.type])}>
              <Icon icon={iconName} className='size-5 text-white' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <h4
                  className={cn(
                    'font-medium',
                    event.completed && 'line-through'
                  )}
                >
                  {event.title}
                </h4>
                <Badge
                  variant={
                    event.priority === 'urgent'
                      ? 'destructive'
                      : event.priority === 'high'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {event.priority}
                </Badge>
              </div>
              <p className='text-muted-foreground text-sm'>
                {format(event.startDate, 'PPP')}
                {!event.allDay && ` at ${format(event.startDate, 'p')}`}
              </p>
              {event.description && (
                <p className='text-muted-foreground mt-1 text-sm'>
                  {event.description}
                </p>
              )}
            </div>
            {(event.type === 'assignment' || event.type === 'quiz') &&
              onToggleComplete && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(event);
                  }}
                >
                  {event.completed ? 'Undo' : 'Complete'}
                </Button>
              )}
          </div>
        );
      })}
    </div>
  );
}
