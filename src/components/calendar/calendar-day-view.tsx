'use client';

import {
  format,
  isSameDay,
  addHours,
  startOfDay,
  setHours,
  setMinutes,
  differenceInMinutes
} from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent, EVENT_COLORS, EventType, EventPriority } from './types';
import { Icon } from '@iconify/react';

interface CalendarDayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (time: Date) => void;
  onCreateQuickEvent?: (startTime: Date, endTime: Date) => void;
}

// Time slots from 6 AM to 11 PM (18 hours)
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => i + 6);
const SLOT_HEIGHT = 60; // pixels per hour

export function CalendarDayView({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
  onCreateQuickEvent
}: CalendarDayViewProps) {
  // Get events for this specific day
  const dayEvents = events.filter((event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    return (
      isSameDay(eventStart, date) ||
      isSameDay(eventEnd, date) ||
      (eventStart < date && eventEnd > date)
    );
  });

  // Separate all-day events from timed events
  const allDayEvents = dayEvents.filter((event) => event.allDay);
  const timedEvents = dayEvents.filter((event) => !event.allDay);

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    const startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
    const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60;

    // Clamp to visible hours (6 AM - 11 PM)
    const visibleStart = Math.max(startHour, 6);
    const visibleEnd = Math.min(endHour, 23);

    const top = (visibleStart - 6) * SLOT_HEIGHT;
    const height = Math.max((visibleEnd - visibleStart) * SLOT_HEIGHT, 30); // Min 30px height

    return { top, height };
  };

  // Get current time indicator position
  const now = new Date();
  const isCurrentDay = isSameDay(date, now);
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentTimeTop =
    isCurrentDay && currentHour >= 6 && currentHour <= 23
      ? (currentHour - 6) * SLOT_HEIGHT
      : null;

  // Handle time slot click
  const handleTimeSlotClick = (hour: number) => {
    const clickedTime = setHours(setMinutes(startOfDay(date), 0), hour);
    onTimeSlotClick(clickedTime);
  };

  // Handle drag to create event (simplified - just click for now)
  const handleQuickCreate = (hour: number) => {
    if (onCreateQuickEvent) {
      const startTime = setHours(setMinutes(startOfDay(date), 0), hour);
      const endTime = addHours(startTime, 1);
      onCreateQuickEvent(startTime, endTime);
    }
  };

  return (
    <div className='flex h-full flex-col'>
      {/* Date header */}
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex h-14 w-14 flex-col items-center justify-center rounded-xl',
              isCurrentDay ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            <span className='text-xs font-medium uppercase'>
              {format(date, 'EEE')}
            </span>
            <span className='text-2xl font-bold'>{format(date, 'd')}</span>
          </div>
          <div>
            <h2 className='text-lg font-semibold'>
              {format(date, 'MMMM yyyy')}
            </h2>
            <p className='text-muted-foreground text-sm'>
              {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}{' '}
              scheduled
            </p>
          </div>
        </div>
      </div>

      {/* All-day events section */}
      {allDayEvents.length > 0 && (
        <div className='bg-muted/30 border-b px-4 py-2'>
          <div className='text-muted-foreground mb-2 text-xs font-medium'>
            All day
          </div>
          <div className='space-y-1'>
            {allDayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={cn(
                  'w-full rounded-lg px-3 py-1.5 text-left text-sm font-medium text-white transition-colors hover:opacity-90',
                  EVENT_COLORS[event.type]
                )}
              >
                {event.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable time grid */}
      <div className='flex-1 overflow-y-auto'>
        <div
          className='relative'
          style={{ height: TIME_SLOTS.length * SLOT_HEIGHT }}
        >
          {/* Time labels and grid lines */}
          {TIME_SLOTS.map((hour) => (
            <div
              key={hour}
              className='border-muted hover:bg-accent/30 group absolute right-0 left-0 cursor-pointer border-b transition-colors'
              style={{ top: (hour - 6) * SLOT_HEIGHT, height: SLOT_HEIGHT }}
              onClick={() => handleTimeSlotClick(hour)}
              onDoubleClick={() => handleQuickCreate(hour)}
            >
              <div className='flex'>
                {/* Time label */}
                <div className='text-muted-foreground w-16 flex-shrink-0 px-2 py-1 text-xs'>
                  {format(setHours(new Date(), hour), 'h a')}
                </div>
                {/* Click hint */}
                <div className='flex flex-1 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                  <span className='text-muted-foreground bg-background/80 rounded px-2 py-0.5 text-xs'>
                    Click to add event
                  </span>
                </div>
              </div>
              {/* Half-hour line */}
              <div
                className='border-muted/50 absolute right-0 left-16 border-b border-dashed'
                style={{ top: SLOT_HEIGHT / 2 }}
              />
            </div>
          ))}

          {/* Current time indicator */}
          {currentTimeTop !== null && (
            <div
              className='pointer-events-none absolute right-0 left-0 z-20'
              style={{ top: currentTimeTop }}
            >
              <div className='flex items-center'>
                <div className='flex w-16 justify-end pr-1'>
                  <div className='rounded bg-red-500 px-1 text-xs text-white'>
                    {format(now, 'h:mm')}
                  </div>
                </div>
                <div className='h-0.5 flex-1 bg-red-500' />
                <div className='h-2 w-2 rounded-full bg-red-500' />
              </div>
            </div>
          )}

          {/* Timed events */}
          <div className='absolute top-0 right-4 bottom-0 left-16'>
            {timedEvents.map((event, idx) => {
              const style = getEventStyle(event);
              // Basic collision detection - offset overlapping events
              const overlappingCount = timedEvents.slice(0, idx).filter((e) => {
                const eStyle = getEventStyle(e);
                return Math.abs(eStyle.top - style.top) < 30;
              }).length;

              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    'absolute z-10 rounded-lg px-3 py-2 text-left text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md',
                    EVENT_COLORS[event.type],
                    event.completed && 'opacity-50'
                  )}
                  style={{
                    top: style.top + 2,
                    height: style.height - 4,
                    left: overlappingCount * 20,
                    right: overlappingCount * 20,
                    width:
                      overlappingCount > 0
                        ? `calc(100% - ${overlappingCount * 40}px)`
                        : undefined
                  }}
                >
                  <div className='flex h-full flex-col overflow-hidden'>
                    <div className='truncate text-sm font-medium'>
                      {event.title}
                    </div>
                    {style.height > 40 && (
                      <div className='truncate text-xs opacity-80'>
                        {format(new Date(event.startDate), 'h:mm a')} -{' '}
                        {format(new Date(event.endDate), 'h:mm a')}
                      </div>
                    )}
                    {style.height > 60 && event.location && (
                      <div className='mt-1 flex items-center gap-1 truncate text-xs opacity-70'>
                        <Icon
                          icon='solar:map-point-bold-duotone'
                          className='size-3'
                        />
                        {event.location}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
