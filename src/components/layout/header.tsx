import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { NotificationBell } from '../notification-bell';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function Header() {
  return (
    <header className='bg-background/80 border-primary/5 sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur-xl transition-all duration-300'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='hover:bg-primary/5 text-muted-foreground -ml-1 rounded-xl transition-all duration-300' />
        <Separator orientation='vertical' className='bg-primary/10 mx-2 h-5' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2'>
        <div className='mr-4 hidden min-w-[300px] lg:flex'>
          <SearchInput />
        </div>

        <TooltipProvider>
          <div className='bg-muted/30 border-primary/5 flex items-center gap-1 rounded-xl border p-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-background h-9 w-9 rounded-lg shadow-sm transition-all duration-300'
                  asChild
                >
                  <Link href='/dashboard/calendar'>
                    <Icon
                      icon='solar:calendar-date-duotone'
                      className='text-muted-foreground h-5 w-5'
                    />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className='rounded-lg border-none bg-emerald-950 text-[10px] font-bold tracking-widest text-emerald-50 uppercase shadow-xl'>
                Calendar
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-background h-9 w-9 rounded-lg shadow-sm transition-all duration-300'
                  asChild
                >
                  <Link href='/dashboard/messages'>
                    <Icon
                      icon='solar:chat-dot-round-duotone'
                      className='text-muted-foreground h-5 w-5'
                    />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className='rounded-lg border-none bg-emerald-950 text-[10px] font-bold tracking-widest text-emerald-50 uppercase shadow-xl'>
                Messages
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <NotificationBell />
        <Separator orientation='vertical' className='bg-primary/10 mx-1 h-5' />
        <UserNav />
        <ModeToggle />
      </div>
    </header>
  );
}
