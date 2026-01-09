'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { fetchTenants, switchTenant } from '@/actions/tenant';
import { useUser } from '@/context/user/user-context';
import { SignOutButton, useUser as useClerkUser } from '@clerk/nextjs';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

export function UserNav() {
  const { user } = useUser();
  const { user: clerkUser } = useClerkUser();
  const router = useRouter();
  const [tenants, setTenants] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [activeTenant, setActiveTenant] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  React.useEffect(() => {
    // Fetch tenants on component mount
    const loadTenants = async () => {
      try {
        const fetchedTenants = await fetchTenants();
        setTenants(fetchedTenants);
        if (fetchedTenants.length > 0) {
          setActiveTenant(fetchedTenants[0]);
        }
      } catch (error) {
        console.error('[UserNav] Failed to load tenants:', error);
      }
    };

    loadTenants();
  }, []);

  const handleSwitchTenant = async (tenantId: string) => {
    try {
      const success = await switchTenant(tenantId);
      if (success) {
        const selected = tenants.find((t) => t.id === tenantId);
        if (selected) {
          setActiveTenant(selected);
        }
      } else {
        console.error('[UserNav] Failed to switch tenant');
      }
    } catch (error) {
      console.error('[UserNav] Error switching tenant:', error);
    }
  };

  if (clerkUser) {
    return (
      <div className='flex items-center gap-2'>
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='group hover:bg-primary/5 relative h-10 w-10 rounded-xl p-0 transition-all duration-300'
            >
              <div className='border-primary/10 group-hover:border-primary/30 absolute inset-0 rounded-xl border transition-colors' />
              <UserAvatarProfile user={clerkUser} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='border-primary/10 w-72 overflow-hidden rounded-2xl p-2 shadow-2xl'
            align='end'
            sideOffset={10}
            forceMount
          >
            <div className='bg-primary/5 border-primary/5 mb-2 rounded-xl border px-3 py-4'>
              <div className='flex items-center gap-3'>
                <UserAvatarProfile
                  user={clerkUser}
                  className='border-background h-12 w-12 rounded-xl border-2 shadow-md'
                />
                <div className='flex min-w-0 flex-col'>
                  <p className='text-foreground mb-1 truncate text-sm leading-none font-black tracking-tight'>
                    {clerkUser.fullName}
                  </p>
                  <p className='text-muted-foreground mb-2 truncate text-[10px] font-medium'>
                    {clerkUser.primaryEmailAddress?.emailAddress}
                  </p>
                  <Badge className='bg-primary/20 text-primary h-4 w-fit border-none px-1.5 text-[8px] font-black tracking-widest uppercase'>
                    {user?.role || 'Guest'}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenuGroup className='space-y-1'>
              <DropdownMenuItem className='group focus:bg-primary/5 focus:text-primary flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200'>
                <div className='bg-muted text-muted-foreground group-focus:bg-primary/10 group-focus:text-primary flex aspect-square size-8 items-center justify-center rounded-lg transition-colors'>
                  <Icon icon='solar:user-circle-duotone' className='size-5' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold'>Your Profile</span>
                  <span className='text-[10px] opacity-60'>
                    Personal info & security
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className='group focus:bg-primary/5 focus:text-primary flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200'>
                <div className='bg-muted text-muted-foreground group-focus:bg-primary/10 group-focus:text-primary flex aspect-square size-8 items-center justify-center rounded-lg transition-colors'>
                  <Icon
                    icon='solar:settings-minimalistic-duotone'
                    className='size-5'
                  />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold'>Account Settings</span>
                  <span className='text-[10px] opacity-60'>
                    Control your experience
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className='bg-primary/5 my-2' />

            <SignOutButton>
              <DropdownMenuItem className='group text-muted-foreground/80 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 focus:bg-rose-50 focus:text-rose-600'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-rose-500/5 text-rose-500 transition-colors group-focus:bg-rose-500/20'>
                  <Icon
                    icon='solar:logout-3-duotone'
                    className='size-5 rotate-180'
                  />
                </div>
                <span className='text-sm font-bold'>Log Out</span>
                <Icon
                  icon='solar:alt-arrow-right-linear'
                  className='ml-auto size-3 opacity-30'
                />
              </DropdownMenuItem>
            </SignOutButton>

            <div className='mt-2 px-3 py-2 text-center'>
              <p className='text-muted-foreground text-[9px] font-bold tracking-[0.2em] uppercase opacity-40'>
                Redevise Core v1.0.4
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return null;
}
