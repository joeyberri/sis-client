'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  addDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  parseISO,
  addMinutes,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval,
  format,
  setHours,
  setMinutes,
  startOfDay
} from 'date-fns';
import {
  CalendarHeader,
  CalendarNavigation,
  CalendarGrid,
  CalendarDayView,
  CalendarAgenda,
  CalendarSidebar,
  EventDialog,
  CalendarEvent,
  CalendarFilter,
  EventType,
  EventPriority,
  ReminderTime
} from '@/components/calendar';

export default function CalendarPage() {
  const { user, isAdmin, isTeacher, isStudent, isParent } = useUser();
  const { getToken } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>(
    'month'
  );

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<CalendarFilter>({
    types: [
      'assignment',
      'quiz',
      'exam',
      'meeting',
      'holiday',
      'event',
      'deadline',
      'class',
      'reminder'
    ],
    priorities: ['low', 'medium', 'high', 'urgent'],
    showCompleted: true
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'event' as EventType,
    priority: 'medium' as EventPriority,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    location: '',
    reminders: ['1hour'] as ReminderTime[],
    isRecurring: false,
    recurringPattern: '' as 'daily' | 'weekly' | 'monthly' | ''
  });

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiBase}/events?startDate=${monthStart.toISOString()}&endDate=${monthEnd.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const formattedEvents = data.data.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            reminders: event.reminders || ['1hour']
          }));
          setEvents(formattedEvents);
          return;
        }
      }
      // Fallback to mock data if API fails
      console.log('[Calendar] Using mock events - API not available');
      setEvents(getMockEvents());
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Mock data for demonstration
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  }, [getToken, currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Get mock events for demonstration
  const getMockEvents = (): CalendarEvent[] => {
    const today = new Date();
    return [
      {
        id: '1',
        title: 'Mathematics Quiz',
        description: 'Chapter 5 - Algebra',
        type: 'quiz',
        priority: 'high',
        startDate: addDays(today, 2),
        endDate: addDays(today, 2),
        allDay: false,
        reminders: ['1day', '1hour'],
        createdBy: 'teacher1',
        classId: 'class1'
      },
      {
        id: '2',
        title: 'Science Assignment Due',
        description: 'Lab report on photosynthesis',
        type: 'assignment',
        priority: 'medium',
        startDate: addDays(today, 5),
        endDate: addDays(today, 5),
        allDay: true,
        reminders: ['1week', '1day'],
        createdBy: 'teacher2'
      },
      {
        id: '3',
        title: 'Parent-Teacher Meeting',
        description: 'Quarterly progress discussion',
        type: 'meeting',
        priority: 'high',
        startDate: addDays(today, 7),
        endDate: addDays(today, 7),
        allDay: false,
        location: 'Room 102',
        reminders: ['1day'],
        attendees: ['parent1', 'teacher1'],
        createdBy: 'admin1'
      },
      {
        id: '4',
        title: 'Mid-Term Examination',
        description: 'All subjects',
        type: 'exam',
        priority: 'urgent',
        startDate: addDays(today, 14),
        endDate: addDays(today, 18),
        allDay: true,
        reminders: ['1week', '1day'],
        createdBy: 'admin1'
      },
      {
        id: '5',
        title: 'School Holiday - Foundation Day',
        type: 'holiday',
        priority: 'low',
        startDate: addDays(today, 10),
        endDate: addDays(today, 10),
        allDay: true,
        reminders: [],
        createdBy: 'admin1'
      }
    ];
  };

  // Calendar grid generation
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!filters.types.includes(event.type)) return false;
      if (!filters.priorities.includes(event.priority)) return false;
      if (!filters.showCompleted && event.completed) return false;
      return true;
    });
  }, [events, filters]);

  // Get events for a specific day
  const getEventsForDay = useCallback(
    (day: Date) => {
      return filteredEvents.filter((event) => {
        return (
          isWithinInterval(day, {
            start: new Date(event.startDate.setHours(0, 0, 0, 0)),
            end: new Date(event.endDate.setHours(23, 59, 59, 999))
          }) || isSameDay(event.startDate, day)
        );
      });
    },
    [filteredEvents]
  );

  // Navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Create event
  const handleCreateEvent = async () => {
    try {
      const token = await getToken();
      const eventData = {
        ...formData,
        startDate: formData.allDay
          ? new Date(formData.startDate)
          : new Date(`${formData.startDate}T${formData.startTime}`),
        endDate: formData.allDay
          ? new Date(formData.endDate || formData.startDate)
          : new Date(
              `${formData.endDate || formData.startDate}T${formData.endTime || formData.startTime}`
            )
      };

      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        toast.success('Event created successfully');
        fetchEvents();
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Event deleted');
        fetchEvents();
        setIsViewDialogOpen(false);
      }
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  // Mark as completed
  const handleToggleComplete = async (event: CalendarEvent) => {
    try {
      const token = await getToken();
      await fetch(`/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !event.completed })
      });

      fetchEvents();
      toast.success(
        event.completed ? 'Marked as incomplete' : 'Marked as completed'
      );
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'event',
      priority: 'medium',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      allDay: false,
      location: '',
      reminders: ['1hour'],
      isRecurring: false,
      recurringPattern: ''
    });
    setIsEditing(false);
  };

  // Upcoming events for sidebar
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return filteredEvents
      .filter((event) => event.startDate >= today)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 5);
  }, [filteredEvents]);

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          filters={filters}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
          onViewChange={setView}
          onFiltersChange={setFilters}
          onCreateEvent={() => setIsCreateDialogOpen(true)}
          canCreateEvent={isAdmin || isTeacher}
        />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Main Calendar */}
          <div className='lg:col-span-3'>
            <Card className={cn(view === 'day' && 'overflow-hidden')}>
              <CardHeader className='pb-2'>
                <CalendarNavigation
                  currentDate={currentDate}
                  view={view}
                  onPreviousMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                  onToday={goToToday}
                  onViewChange={setView}
                />
              </CardHeader>
              <CardContent className={cn(view === 'day' && 'h-[600px] p-0')}>
                {view === 'month' && (
                  <CalendarGrid
                    currentDate={currentDate}
                    events={filteredEvents}
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      setSelectedDate(date);
                      // Switch to day view on date click
                      setView('day');
                      setCurrentDate(date);
                    }}
                    onEventClick={(event) => {
                      setSelectedEvent(event);
                      setIsViewDialogOpen(true);
                    }}
                  />
                )}

                {view === 'day' && (
                  <CalendarDayView
                    date={selectedDate || currentDate}
                    events={filteredEvents}
                    onEventClick={(event) => {
                      setSelectedEvent(event);
                      setIsViewDialogOpen(true);
                    }}
                    onTimeSlotClick={(time) => {
                      // Pre-fill form with clicked time
                      setFormData((prev) => ({
                        ...prev,
                        startDate: format(time, 'yyyy-MM-dd'),
                        startTime: format(time, 'HH:mm'),
                        endDate: format(time, 'yyyy-MM-dd'),
                        endTime: format(
                          setHours(time, time.getHours() + 1),
                          'HH:mm'
                        )
                      }));
                      setIsCreateDialogOpen(true);
                    }}
                    onCreateQuickEvent={(startTime, endTime) => {
                      setFormData((prev) => ({
                        ...prev,
                        startDate: format(startTime, 'yyyy-MM-dd'),
                        startTime: format(startTime, 'HH:mm'),
                        endDate: format(endTime, 'yyyy-MM-dd'),
                        endTime: format(endTime, 'HH:mm'),
                        allDay: false
                      }));
                      setIsCreateDialogOpen(true);
                    }}
                  />
                )}

                {view === 'agenda' && (
                  <CalendarAgenda
                    events={filteredEvents}
                    onEventClick={(event) => {
                      setSelectedEvent(event);
                      setIsViewDialogOpen(true);
                    }}
                    onToggleComplete={handleToggleComplete}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <CalendarSidebar
            selectedDate={selectedDate}
            events={filteredEvents}
            onEventClick={(event) => {
              setSelectedEvent(event);
              setIsViewDialogOpen(true);
            }}
          />
        </div>
      </div>

      <EventDialog
        isOpen={isCreateDialogOpen || isViewDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsViewDialogOpen(false);
            setSelectedEvent(null);
            setIsEditing(false);
            resetForm();
          }
        }}
        event={selectedEvent}
        isEditing={isEditing}
        formData={formData}
        onFormChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
        onSave={handleCreateEvent}
        onDelete={handleDeleteEvent}
        canEdit={isAdmin || isTeacher}
      />
    </PageContainer>
  );
}
