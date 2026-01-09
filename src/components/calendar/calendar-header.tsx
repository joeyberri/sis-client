'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EVENT_COLORS, EventType, CalendarFilter } from './types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day' | 'agenda';
  filters: CalendarFilter;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewChange: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  onFiltersChange: (filters: CalendarFilter) => void;
  onCreateEvent?: () => void;
  canCreateEvent?: boolean;
}

export function CalendarHeader({
  currentDate,
  view,
  filters,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onViewChange,
  onFiltersChange,
  onCreateEvent,
  canCreateEvent = false
}: CalendarHeaderProps) {
  return (
    <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
      <div>
        <h1 className='text-3xl font-bold'>Calendar</h1>
        <p className='text-muted-foreground'>
          Track assignments, events, and important dates
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              <Filter className='mr-2 h-4 w-4' />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            {(
              [
                'assignment',
                'quiz',
                'exam',
                'meeting',
                'holiday',
                'event',
                'deadline'
              ] as EventType[]
            ).map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    types: filters.types.includes(type)
                      ? filters.types.filter((t) => t !== type)
                      : [...filters.types, type]
                  });
                }}
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full',
                      EVENT_COLORS[type],
                      !filters.types.includes(type) && 'opacity-30'
                    )}
                  />
                  <span className='capitalize'>{type}</span>
                  {filters.types.includes(type) && (
                    <CheckCircle2 className='ml-auto h-4 w-4' />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  showCompleted: !filters.showCompleted
                })
              }
            >
              <div className='flex items-center gap-2'>
                <span>Show Completed</span>
                {filters.showCompleted && (
                  <CheckCircle2 className='ml-auto h-4 w-4' />
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {canCreateEvent && onCreateEvent && (
          <Button onClick={onCreateEvent}>
            <Plus className='mr-2 h-4 w-4' />
            Add Event
          </Button>
        )}
      </div>
    </div>
  );
}

interface CalendarNavigationProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day' | 'agenda';
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewChange: (view: 'month' | 'week' | 'day' | 'agenda') => void;
}

export function CalendarNavigation({
  currentDate,
  view,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onViewChange
}: CalendarNavigationProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Button variant='outline' size='icon' onClick={onPreviousMonth}>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <h2 className='min-w-[200px] text-center text-xl font-semibold'>
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant='outline' size='icon' onClick={onNextMonth}>
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' onClick={onToday}>
          Today
        </Button>
      </div>
      <Tabs
        value={view}
        onValueChange={(v) =>
          onViewChange(v as 'month' | 'week' | 'day' | 'agenda')
        }
      >
        <TabsList>
          <TabsTrigger value='month'>Month</TabsTrigger>
          <TabsTrigger value='week'>Week</TabsTrigger>
          <TabsTrigger value='agenda'>Agenda</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
