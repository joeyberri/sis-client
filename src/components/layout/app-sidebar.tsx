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
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle
} from '@tabler/icons-react';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user, clerkUser } = useUser();
  const router = useRouter();
  const [tenants, setTenants] = React.useState<Array<{ id: string; name: string }>>([]);
  const [activeTenant, setActiveTenant] = React.useState<{ id: string; name: string } | null>(null);
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
        ) : null}
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        {(() => {
          // Prefer role-based SIDEBAR_CONFIGS if available, otherwise fall back to navItems
          const role = user?.role;
          const validRoles = Object.keys(SIDEBAR_CONFIGS) as Array<keyof typeof SIDEBAR_CONFIGS>;
          const config = role && validRoles.includes(role) ? SIDEBAR_CONFIGS[role] : undefined;

          // Use sidebarGroups if available, otherwise fall back to old structure
          const groupsToRender = config?.sidebarGroups || [
            {
              title: 'Overview',
              items: navItems.map((n) => ({ title: n.title, href: n.url, children: n.items?.map(i => ({ title: i.title, href: i.url })) }))
            }
          ];

          return groupsToRender.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item: any) => {
                  const hasChildren = item.children && item.children.length > 0;
                  // Resolve icon from Icons map when possible; else fallback to logo
                  const IconComp = (item.icon && (Icons as any)[item.icon]) ? (Icons as any)[item.icon] : Icons.logo;

                  if (hasChildren) {
                    return (
                      <Collapsible key={item.title} asChild defaultOpen={false} className='group/collapsible'>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title} isActive={pathname === item.href}>
                              {item.icon && <IconComp />}
                              <span>{item.title}</span>
                              <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map((subItem: any) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                    <Link href={subItem.href || '#'}>
                                      <span>{subItem.title}</span>
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
                      <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.href}>
                        <Link href={item.href || '#'}>
                          <IconComp />
                          <span>{item.title}</span>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  { (clerkUser || user) && (
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={clerkUser ?? (user as any)}
                    />
                  )}
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    { (clerkUser || user) && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={clerkUser ?? (user as any)}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard className='mr-2 h-4 w-4' />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconBell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className='mr-2 h-4 w-4' />
                  <SignOutButton redirectUrl='/auth/sign-in' />
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
