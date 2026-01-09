'use client';

import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icon } from '@iconify/react';
import {
  CalendarEvent,
  EventType,
  EventPriority,
  ReminderTime,
  REMINDER_OPTIONS,
  EVENT_COLORS,
  EVENT_ICON_NAMES
} from './types';

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  isEditing: boolean;
  formData: {
    title: string;
    description: string;
    type: EventType;
    priority: EventPriority;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    allDay: boolean;
    location: string;
    reminders: ReminderTime[];
    isRecurring: boolean;
    recurringPattern: 'daily' | 'weekly' | 'monthly' | '';
  };
  onFormChange: (data: Partial<EventDialogProps['formData']>) => void;
  onSave: () => void;
  onDelete?: (eventId: string) => void;
  canEdit?: boolean;
}

export function EventDialog({
  isOpen,
  onOpenChange,
  event,
  isEditing,
  formData,
  onFormChange,
  onSave,
  onDelete,
  canEdit = false
}: EventDialogProps) {
  const handleReminderToggle = (reminder: ReminderTime) => {
    onFormChange({
      reminders: formData.reminders.includes(reminder)
        ? formData.reminders.filter((r) => r !== reminder)
        : [...formData.reminders, reminder]
    });
  };

  if (!isEditing && event) {
    // View mode
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-3'>
                <div className={cn('rounded-lg p-2', EVENT_COLORS[event.type])}>
                  <Icon
                    icon={EVENT_ICON_NAMES[event.type]}
                    className='size-5 text-white'
                  />
                </div>
                <div>
                  <DialogTitle>{event.title}</DialogTitle>
                  <Badge
                    variant={
                      event.priority === 'urgent'
                        ? 'destructive'
                        : event.priority === 'high'
                          ? 'default'
                          : 'secondary'
                    }
                    className='mt-1'
                  >
                    {event.priority} priority
                  </Badge>
                </div>
              </div>
              {canEdit && onDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <Icon
                        icon='solar:menu-dots-bold-duotone'
                        className='size-4'
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => {
                        // Switch to edit mode
                        onOpenChange(false);
                      }}
                    >
                      <Icon
                        icon='solar:pen-bold-duotone'
                        className='mr-2 size-4'
                      />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={() => onDelete(event.id)}
                    >
                      <Icon
                        icon='solar:trash-bin-trash-bold-duotone'
                        className='mr-2 size-4'
                      />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='flex items-center gap-2 text-sm'>
              <Icon
                icon='solar:calendar-bold-duotone'
                className='text-muted-foreground size-4'
              />
              <span>
                {format(event.startDate, 'PPPP')}
                {!event.allDay && ` · ${format(event.startDate, 'p')}`}
                {event.endDate &&
                  !isSameDay(event.startDate, event.endDate) &&
                  ` - ${format(event.endDate, 'PPPP')}`}
              </span>
            </div>

            {event.location && (
              <div className='flex items-center gap-2 text-sm'>
                <Icon
                  icon='solar:map-point-bold-duotone'
                  className='text-muted-foreground size-4'
                />
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <div className='border-t pt-2'>
                <p className='text-muted-foreground text-sm'>
                  {event.description}
                </p>
              </div>
            )}

            {event.reminders.length > 0 && (
              <div className='flex items-center gap-2'>
                <Icon
                  icon='solar:bell-bold-duotone'
                  className='text-muted-foreground size-4'
                />
                <div className='flex flex-wrap gap-1'>
                  {event.reminders.map((r) => (
                    <Badge key={r} variant='outline'>
                      {REMINDER_OPTIONS.find((opt) => opt.value === r)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {event &&
              (event.type === 'assignment' || event.type === 'quiz') && (
                <Button
                  variant={event.completed ? 'outline' : 'default'}
                  onClick={() => {
                    // This would be handled by parent component
                  }}
                >
                  {event.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Create/Edit mode
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            Add a new event to the calendar. It will be visible to relevant
            users.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder='Event title'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='type'>Event Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => onFormChange({ type: v as EventType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='assignment'>Assignment</SelectItem>
                  <SelectItem value='quiz'>Quiz</SelectItem>
                  <SelectItem value='exam'>Exam</SelectItem>
                  <SelectItem value='meeting'>Meeting</SelectItem>
                  <SelectItem value='holiday'>Holiday</SelectItem>
                  <SelectItem value='event'>Event</SelectItem>
                  <SelectItem value='deadline'>Deadline</SelectItem>
                  <SelectItem value='reminder'>Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) =>
                  onFormChange({ priority: v as EventPriority })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='urgent'>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Switch
              id='allDay'
              checked={formData.allDay}
              onCheckedChange={(v) => onFormChange({ allDay: v })}
            />
            <Label htmlFor='allDay'>All day event</Label>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='startDate'>Start Date</Label>
              <Input
                id='startDate'
                type='date'
                value={formData.startDate}
                onChange={(e) => onFormChange({ startDate: e.target.value })}
              />
            </div>
            {!formData.allDay && (
              <div className='space-y-2'>
                <Label htmlFor='startTime'>Start Time</Label>
                <Input
                  id='startTime'
                  type='time'
                  value={formData.startTime}
                  onChange={(e) => onFormChange({ startTime: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='endDate'>End Date</Label>
              <Input
                id='endDate'
                type='date'
                value={formData.endDate}
                onChange={(e) => onFormChange({ endDate: e.target.value })}
              />
            </div>
            {!formData.allDay && (
              <div className='space-y-2'>
                <Label htmlFor='endTime'>End Time</Label>
                <Input
                  id='endTime'
                  type='time'
                  value={formData.endTime}
                  onChange={(e) => onFormChange({ endTime: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='location'>Location (optional)</Label>
            <Input
              id='location'
              value={formData.location}
              onChange={(e) => onFormChange({ location: e.target.value })}
              placeholder='e.g., Room 102, Online, etc.'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description (optional)</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder='Add details about this event'
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label>Reminders</Label>
            <div className='flex flex-wrap gap-2'>
              {REMINDER_OPTIONS.map((option) => (
                <Badge
                  key={option.value}
                  variant={
                    formData.reminders.includes(option.value)
                      ? 'default'
                      : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => handleReminderToggle(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!formData.title || !formData.startDate}
          >
            {isEditing ? 'Save Changes' : 'Create Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
