'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/context/notification/notification-context';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs'
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='h-auto p-0 text-xs'
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className='h-[400px]'>
          {notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Bell className='text-muted-foreground mb-2 h-12 w-12' />
              <p className='text-muted-foreground text-sm'>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-2 p-3',
                  !notification.read && 'bg-muted/50'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className='flex w-full items-start gap-2'>
                  <span
                    className={cn(
                      'text-lg',
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      {notification.title}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {notification.message}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true
                      })}
                    </p>
                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className='text-primary mt-1 inline-block text-xs hover:underline'
                      >
                        {notification.actionLabel || 'View Details'}
                      </Link>
                    )}
                  </div>
                  {!notification.read && (
                    <div className='bg-primary h-2 w-2 rounded-full' />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href='/dashboard/notifications'
                className='w-full cursor-pointer text-center'
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
