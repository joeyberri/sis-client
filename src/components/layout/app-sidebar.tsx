'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { SIDEBAR_CONFIGS } from '@/constants/sidebar';
import { useUser } from '@/context/user/user-context';
import { useMediaQuery } from '@/hooks/use-media-query';
import { fetchTenants, switchTenant } from '@/actions/tenant';
import { Icon } from '@iconify/react';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user, clerkUser } = useUser();
  const router = useRouter();
  const [tenants, setTenants] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [activeTenant, setActiveTenant] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch tenants on component mount
    const loadTenants = async () => {
      try {
        setIsLoading(true);
        const fetchedTenants = await fetchTenants();
        setTenants(fetchedTenants);
        if (fetchedTenants.length > 0) {
          setActiveTenant(fetchedTenants[0]);
        }
      } catch (error) {
        console.error('[AppSidebar] Failed to load tenants:', error);
        // Fallback to empty state
        setTenants([]);
      } finally {
        setIsLoading(false);
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
        console.error('[AppSidebar] Failed to switch tenant');
      }
    } catch (error) {
      console.error('[AppSidebar] Error switching tenant:', error);
    }
  };

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        {!isLoading && activeTenant ? (
          <OrgSwitcher
            tenants={tenants}
            defaultTenant={activeTenant}
            onTenantSwitch={handleSwitchTenant}
          />
        ) : (
          <div className='flex h-14 items-center px-4'>
            <div className='bg-muted h-8 w-32 animate-pulse rounded-md' />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        {(() => {
          // Prefer role-based SIDEBAR_CONFIGS if available, otherwise fall back to navItems
          const role = user?.role;
          const validRoles = Object.keys(SIDEBAR_CONFIGS) as Array<
            keyof typeof SIDEBAR_CONFIGS
          >;
          const config =
            role && validRoles.includes(role)
              ? SIDEBAR_CONFIGS[role]
              : undefined;

          // Use sidebarGroups if available, otherwise fall back to old structure
          const groupsToRender = config?.sidebarGroups || [
            {
              title: 'Overview',
              items: navItems.map((n) => ({
                title: n.title,
                href: n.url,
                children: n.items?.map((i) => ({ title: i.title, href: i.url }))
              }))
            }
          ];

          return groupsToRender.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className='text-muted-foreground/70 mb-2 px-4 text-xs font-semibold tracking-wider uppercase'>
                {group.title}
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item: any) => {
                  const hasChildren = item.children && item.children.length > 0;

                  // Render icon - support both Iconify strings and local Icons components
                  const renderIcon = () => {
                    if (!item.icon) return <Icons.logo className='size-5' />;
                    if (
                      typeof item.icon === 'string' &&
                      item.icon.includes(':')
                    ) {
                      return (
                        <Icon
                          icon={item.icon}
                          className={cn(
                            'size-5',
                            pathname === item.href
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                      );
                    }
                    const IconComp = (Icons as any)[item.icon] || Icons.logo;
                    return (
                      <IconComp
                        className={cn(
                          'size-5',
                          pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                    );
                  };

                  if (hasChildren) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={false}
                        className='group/collapsible'
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={pathname === item.href}
                            >
                              {renderIcon()}
                              <span className='font-medium tracking-tight'>
                                {item.title}
                              </span>
                              <Icon
                                icon='solar:alt-arrow-right-linear'
                                className='ml-auto size-3 opacity-40 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map((subItem: any) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.href}
                                  >
                                    <Link href={subItem.href || '#'}>
                                      <span className='text-xs font-medium'>
                                        {subItem.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={pathname === item.href}
                      >
                        <Link
                          href={item.href || '#'}
                          className='flex items-center gap-3'
                        >
                          {renderIcon()}
                          <span
                            className={cn(
                              'font-medium tracking-tight',
                              pathname === item.href
                                ? 'text-primary font-bold'
                                : 'text-foreground'
                            )}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ));
        })()}
      </SidebarContent>
      <SidebarFooter className='border-sidebar-border bg-sidebar-footer/40 border-t p-4 backdrop-blur-sm'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group hover:bg-sidebar-accent/50 h-12 rounded-xl transition-all'
                >
                  {(clerkUser || user) && (
                    <UserAvatarProfile
                      className='h-9 w-9 rounded-lg shadow-sm transition-transform group-hover:scale-105'
                      showInfo
                      user={clerkUser ?? (user as any)}
                    />
                  )}
                  <Icons.chevronDown className='text-muted-foreground/50 group-hover:text-muted-foreground ml-auto size-4 transition-colors' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='border-muted/50 w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-2xl p-2 shadow-2xl'
                side='bottom'
                align='end'
                sideOffset={8}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='bg-muted/30 mb-2 flex items-center gap-3 rounded-xl px-3 py-3'>
                    {(clerkUser || user) && (
                      <UserAvatarProfile
                        className='border-background h-10 w-10 rounded-xl border-2 shadow-md'
                        showInfo
                        user={clerkUser ?? (user as any)}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuGroup className='space-y-1'>
                  <DropdownMenuItem
                    className='focus:bg-primary/5 focus:text-primary flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors'
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <div className='bg-muted group-focus:bg-primary/10 flex size-8 items-center justify-center rounded-md'>
                      <Icons.user className='h-4 w-4' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        Account Settings
                      </span>
                      <span className='text-muted-foreground text-[10px]'>
                        Profile & Preferences
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='focus:bg-primary/5 focus:text-primary flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors'>
                    <div className='bg-muted group-focus:bg-primary/10 flex size-8 items-center justify-center rounded-md'>
                      <Icons.billing className='h-4 w-4' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>Billing</span>
                      <span className='text-muted-foreground text-[10px]'>
                        Manage subscriptions
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='focus:bg-primary/5 focus:text-primary flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-colors'>
                    <div className='bg-muted group-focus:bg-primary/10 flex size-8 items-center justify-center rounded-md'>
                      <Icons.Bell className='h-4 w-4' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>
                        Notifications
                      </span>
                      <span className='text-muted-foreground text-[10px]'>
                        Alerts & Messaging
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className='my-2' />
                <DropdownMenuItem className='flex cursor-pointer items-center gap-3 rounded-lg p-2.5 text-rose-500 transition-colors focus:bg-rose-500/10 focus:text-rose-600'>
                  <div className='flex size-8 items-center justify-center rounded-md bg-rose-500/10'>
                    <Icons.logout className='h-4 w-4' />
                  </div>
                  <div className='flex flex-col'>
                    <SignOutButton redirectUrl='/auth/sign-in' />
                    <span className='text-[10px] opacity-70'>
                      Close current session
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
