'use client';

import { Icon } from '@iconify/react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tenant {
  id: string;
  name: string;
}

export function OrgSwitcher({
  tenants,
  defaultTenant,
  onTenantSwitch
}: {
  tenants: Tenant[];
  defaultTenant: Tenant;
  onTenantSwitch?: (tenantId: string) => void;
}) {
  const [selectedTenant, setSelectedTenant] = React.useState<
    Tenant | undefined
  >(defaultTenant || (tenants.length > 0 ? tenants[0] : undefined));

  React.useEffect(() => {
    if (defaultTenant) {
      setSelectedTenant(defaultTenant);
    }
  }, [defaultTenant]);

  const handleTenantSwitch = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    if (onTenantSwitch) {
      onTenantSwitch(tenant.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasMultipleOrgs = tenants.length > 1;

  if (!selectedTenant) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' className='cursor-default'>
            <div className='bg-primary/5 border-primary/10 flex aspect-square size-9 items-center justify-center rounded-xl border'>
              <Icon
                icon='solar:buildings-duotone'
                className='text-primary/40 size-5'
              />
            </div>
            <div className='ml-2 flex flex-col gap-0.5 leading-tight'>
              <span className='text-foreground text-sm font-bold tracking-tight'>
                Redevise SIS
              </span>
              <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
                No workspace context
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const SwitcherButton = (
    <SidebarMenuButton
      size='lg'
      className={cn(
        'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group transition-all duration-300',
        !hasMultipleOrgs &&
          'cursor-default hover:bg-transparent active:bg-transparent'
      )}
    >
      <div className='bg-primary/10 text-primary border-primary/20 group-hover:border-primary/30 flex aspect-square size-9 items-center justify-center rounded-xl border font-bold shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md'>
        {getInitials(selectedTenant.name)}
      </div>
      <div className='ml-2 flex flex-col gap-0.5 text-left leading-tight'>
        <span className='text-foreground max-w-[140px] truncate text-sm font-bold tracking-tight'>
          {selectedTenant.name}
        </span>
        <span className='text-muted-foreground flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase opacity-70'>
          <Icon
            icon='solar:shield-check-duotone'
            className='size-2.5 text-emerald-500'
          />
          {hasMultipleOrgs ? 'Switch Workspace' : 'Official Portal'}
        </span>
      </div>
      {hasMultipleOrgs && (
        <Icon
          icon='solar:alt-arrow-down-duotone'
          className='text-muted-foreground/50 ml-auto size-4 transition-transform duration-300 group-data-[state=open]:rotate-180'
        />
      )}
    </SidebarMenuButton>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {hasMultipleOrgs ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>{SwitcherButton}</DropdownMenuTrigger>
            <DropdownMenuContent
              className='border-primary/10 w-[--radix-dropdown-menu-trigger-width] min-w-[280px] rounded-2xl p-2 shadow-2xl'
              align='start'
              side='bottom'
              sideOffset={8}
            >
              <DropdownMenuLabel className='text-muted-foreground px-3 py-2 text-[11px] font-bold tracking-widest uppercase opacity-60'>
                Current Workspace
              </DropdownMenuLabel>

              <div className='bg-primary/5 border-primary/10 mb-2 rounded-xl border p-3 shadow-inner'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary text-primary-foreground flex aspect-square size-12 items-center justify-center rounded-xl text-lg font-black shadow-lg'>
                    {getInitials(selectedTenant.name)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-foreground truncate font-bold'>
                      {selectedTenant.name}
                    </p>
                    <p className='text-muted-foreground font-mono text-[10px] opacity-60'>
                      ID: {selectedTenant.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <Badge className='bg-primary/20 text-primary hover:bg-primary/20 border-none text-[9px] font-black tracking-tighter'>
                    ACTIVE
                  </Badge>
                </div>
              </div>

              <DropdownMenuLabel className='text-muted-foreground px-3 py-2 text-[11px] font-bold tracking-widest uppercase opacity-60'>
                Your Workspaces
              </DropdownMenuLabel>
              <div className='space-y-1'>
                {tenants
                  .filter((t) => t.id !== selectedTenant.id)
                  .map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => handleTenantSwitch(tenant)}
                      className='focus:bg-primary/5 focus:text-primary group cursor-pointer gap-3 rounded-xl p-3 transition-colors'
                    >
                      <div className='bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex aspect-square size-9 items-center justify-center rounded-xl text-xs font-bold shadow-sm transition-colors'>
                        {getInitials(tenant.name)}
                      </div>
                      <div className='flex flex-col leading-none'>
                        <span className='truncate font-bold'>
                          {tenant.name}
                        </span>
                        <span className='text-muted-foreground mt-1 font-mono text-[10px]'>
                          Switch to this context
                        </span>
                      </div>
                      <Icon
                        icon='solar:arrow-right-up-duotone'
                        className='ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-100'
                      />
                    </DropdownMenuItem>
                  ))}
              </div>

              <DropdownMenuSeparator className='bg-primary/5 my-2' />
              <DropdownMenuItem className='group cursor-pointer gap-3 rounded-xl p-3 transition-colors focus:bg-orange-50 focus:text-orange-600'>
                <div className='flex size-9 items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 shadow-sm transition-all group-hover:border-orange-500/50 group-hover:bg-orange-50/100'>
                  <Icon
                    icon='solar:add-circle-duotone'
                    className='size-5 text-orange-400 group-hover:text-orange-500'
                  />
                </div>
                <div className='flex flex-col leading-none'>
                  <span className='font-bold text-orange-950/70 group-hover:text-orange-600'>
                    Register School
                  </span>
                  <span className='mt-1 text-[10px] font-medium text-orange-400 group-hover:text-orange-500'>
                    Add a new organization
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          SwitcherButton
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
