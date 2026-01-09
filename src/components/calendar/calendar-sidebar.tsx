'use client';

import { format, isWithinInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import {
  CalendarEvent,
  EVENT_COLORS,
  EVENT_ICON_NAMES,
  EventType
} from './types';

interface CalendarSidebarProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarSidebar({
  selectedDate,
  events,
  onEventClick
}: CalendarSidebarProps) {
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      return (
        isWithinInterval(day, {
          start: new Date(event.startDate.setHours(0, 0, 0, 0)),
          end: new Date(event.endDate.setHours(23, 59, 59, 999))
        }) || isSameDay(event.startDate, day)
      );
    });
  };

  const upcomingEvents = events
    .filter((event) => event.startDate >= new Date())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 5);

  return (
    <div className='space-y-4'>
      {/* Selected Date Info */}
      {selectedDate && (
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg'>
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDay(selectedDate).length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No events scheduled
              </p>
            ) : (
              <div className='space-y-2'>
                {getEventsForDay(selectedDate).map((event) => {
                  const iconName = EVENT_ICON_NAMES[event.type];
                  return (
                    <div
                      key={event.id}
                      className='hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg p-2'
                      onClick={() => onEventClick(event)}
                    >
                      <div
                        className={cn('rounded p-1', EVENT_COLORS[event.type])}
                      >
                        <Icon icon={iconName} className='size-3 text-white' />
                      </div>
                      <span className='truncate text-sm'>{event.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Upcoming</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className='text-muted-foreground text-sm'>No upcoming events</p>
          ) : (
            <div className='space-y-3'>
              {upcomingEvents.map((event) => {
                const iconName = EVENT_ICON_NAMES[event.type];
                return (
                  <div
                    key={event.id}
                    className='hover:bg-accent -mx-2 flex cursor-pointer items-start gap-2 rounded-lg p-2'
                    onClick={() => onEventClick(event)}
                  >
                    <div
                      className={cn('rounded p-1.5', EVENT_COLORS[event.type])}
                    >
                      <Icon icon={iconName} className='size-3 text-white' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {event.title}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {format(event.startDate, 'MMM d')}
                        {!event.allDay &&
                          ` · ${format(event.startDate, 'h:mm a')}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
