'use client';

import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { CalendarEvent, EVENT_COLORS, EVENT_ICON_NAMES } from './types';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onEventClick
}: CalendarGridProps) {
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate))
  });

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

  return (
    <>
      {/* Week day headers */}
      <div className='mb-2 grid grid-cols-7 gap-px'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='text-muted-foreground py-2 text-center text-sm font-medium'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className='bg-muted grid grid-cols-7 gap-px overflow-hidden rounded-lg'>
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={idx}
              className={cn(
                'bg-background hover:bg-accent/50 min-h-[100px] cursor-pointer p-1 transition-colors',
                !isCurrentMonth && 'bg-muted/50',
                isSelected && 'ring-primary ring-2',
                isToday(day) && 'bg-primary/5'
              )}
              onClick={() => onDateSelect(day)}
            >
              <div
                className={cn(
                  'mb-1 text-sm font-medium',
                  !isCurrentMonth && 'text-muted-foreground',
                  isToday(day) &&
                    'bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full'
                )}
              >
                {format(day, 'd')}
              </div>
              <div className='space-y-1'>
                {dayEvents.slice(0, 3).map((event) => {
                  const iconName = EVENT_ICON_NAMES[event.type];
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-1 truncate rounded px-1 py-0.5 text-xs',
                        EVENT_COLORS[event.type],
                        'text-white',
                        event.completed && 'line-through opacity-50'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <Icon icon={iconName} className='size-3 flex-shrink-0' />
                      <span className='truncate'>{event.title}</span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className='text-muted-foreground text-xs'>
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
