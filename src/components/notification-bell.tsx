'use client';

import { Icon } from '@iconify/react';
import { Icons } from '@/components/icons';
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
import * as React from 'react';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'solar:check-circle-duotone';
      case 'error':
        return 'solar:danger-circle-duotone';
      case 'warning':
        return 'solar:danger-triangle-duotone';
      default:
        return 'solar:info-circle-duotone';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'error':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'warning':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-primary/5 relative rounded-xl transition-all duration-300'
        >
          <Icon
            icon='solar:bell-bing-duotone'
            className={cn(
              'h-6 w-6 transition-all duration-500',
              unreadCount > 0
                ? 'text-primary animate-pulse'
                : 'text-muted-foreground/50'
            )}
          />
          {unreadCount > 0 && (
            <Badge className='border-background absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center border-2 bg-rose-500 p-0 text-[10px] font-black shadow-lg hover:bg-rose-500'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='border-primary/10 w-96 overflow-hidden rounded-2xl p-0 shadow-2xl'
      >
        <div className='bg-primary/5 border-primary/10 border-b p-4'>
          <DropdownMenuLabel className='flex items-center justify-between p-0'>
            <div className='flex flex-col'>
              <span className='text-sm font-bold tracking-tight'>
                Activity Feed
              </span>
              <span className='text-muted-foreground text-[10px] font-medium tracking-widest uppercase'>
                {unreadCount} UNREAD UPDATES
              </span>
            </div>
            {unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='hover:bg-primary/10 hover:text-primary h-7 rounded-lg px-2 text-[10px] font-bold tracking-widest uppercase transition-all'
                onClick={markAllAsRead}
              >
                Clear All
              </Button>
            )}
          </DropdownMenuLabel>
        </div>

        <ScrollArea className='h-[450px]'>
          <div className='py-2'>
            {notifications.length === 0 ? (
              <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
                <div className='bg-primary/5 mb-4 rounded-full p-4'>
                  <Icon
                    icon='solar:bell-off-duotone'
                    className='text-primary/30 h-10 w-10'
                  />
                </div>
                <p className='text-foreground text-sm font-bold'>
                  All caught up!
                </p>
                <p className='text-muted-foreground mt-1 max-w-[200px] text-xs leading-relaxed'>
                  No new notifications to show right now. We&apos;ll notify you
                  when something happens.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'mx-2 mb-1 flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-transparent p-4 transition-all duration-200 outline-none',
                    !notification.read
                      ? 'bg-primary/[0.03] border-primary/5 shadow-sm'
                      : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className='flex w-full items-start gap-3'>
                    <div
                      className={cn(
                        'flex aspect-square size-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300',
                        getNotificationColor(notification.type)
                      )}
                    >
                      <Icon
                        icon={getNotificationIcon(notification.type)}
                        className='size-5'
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='mb-0.5 flex items-center justify-between gap-2'>
                        <span className='truncate text-sm font-bold tracking-tight'>
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <div className='bg-primary size-2 shrink-0 animate-pulse rounded-full' />
                        )}
                      </div>
                      <p className='text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed font-medium'>
                        {notification.message}
                      </p>
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground/60 flex items-center gap-1 text-[10px] font-bold tracking-tighter uppercase'>
                          <Icon
                            icon='solar:clock-circle-linear'
                            className='size-2.5'
                          />
                          {formatDistanceToNow(
                            new Date(notification.timestamp),
                            { addSuffix: true }
                          )}
                        </span>
                        {!notification.read && (
                          <span className='text-primary bg-primary/10 rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-widest uppercase'>
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </ScrollArea>

        {notifications.length > 0 && (
          <div className='border-primary/5 bg-muted/20 border-t p-2'>
            <Button
              variant='ghost'
              className='text-muted-foreground hover:text-primary h-9 w-full text-xs font-bold tracking-widest uppercase transition-colors'
              asChild
            >
              <Link href='/dashboard/notifications'>View All Activity</Link>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
