'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

// ============================================
// Dashboard Hero Section
// ============================================

interface DashboardHeroProps {
  badge?: {
    icon?: string;
    text: string;
  };
  title: string;
  subtitle: string;
  actions?: Array<{
    label: string;
    href: string;
    icon?: string;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  backgroundIcon?: string;
  children?: ReactNode;
}

export function DashboardHero({
  badge,
  title,
  subtitle,
  actions,
  backgroundIcon = 'solar:widget-2-bold-duotone',
  children
}: DashboardHeroProps) {
  return (
    <div className='from-primary/10 via-primary/5 to-background relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 md:p-8'>
      <div className='absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-20'>
        <Icon icon={backgroundIcon} className='text-primary size-64' />
      </div>
      <div className='relative z-10'>
        {badge && (
          <Badge className='bg-primary/10 text-primary hover:bg-primary/20 mb-3'>
            {badge.icon && <Icon icon={badge.icon} className='mr-1 size-3' />}
            {badge.text}
          </Badge>
        )}
        <h1 className='text-3xl font-bold md:text-4xl'>{title}</h1>
        <p className='text-muted-foreground mt-2 max-w-xl'>{subtitle}</p>
        {actions && actions.length > 0 && (
          <div className='mt-6 flex flex-wrap gap-3'>
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant || (i === 0 ? 'default' : 'outline')}
                asChild
              >
                <Link href={action.href}>
                  {action.icon && (
                    <Icon icon={action.icon} className='mr-2 size-4' />
                  )}
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ============================================
// Metric Card (Quick Stats)
// ============================================

interface MetricCardProps {
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({
  icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  value,
  label,
  trend
}: MetricCardProps) {
  return (
    <Card className='relative overflow-hidden'>
      <div className='absolute top-2 right-2 opacity-10'>
        <Icon icon={icon} className={cn('size-16', iconColor)} />
      </div>
      <CardContent className='pt-6'>
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-xl',
              iconBgColor
            )}
          >
            <Icon icon={icon} className={cn('size-5', iconColor)} />
          </div>
          <div>
            <p className={cn('text-2xl font-bold', iconColor)}>{value}</p>
            <p className='text-muted-foreground text-xs'>{label}</p>
          </div>
        </div>
        {trend && (
          <div
            className={cn(
              'mt-2 flex items-center gap-1 text-xs font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            <Icon
              icon={
                trend.isPositive
                  ? 'solar:arrow-up-linear'
                  : 'solar:arrow-down-linear'
              }
              className='size-3'
            />
            {trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Section Card with Header
// ============================================

interface SectionCardProps {
  title: string;
  titleIcon?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  titleIcon,
  description,
  viewAllHref,
  viewAllLabel = 'View All',
  children,
  className,
  headerClassName,
  contentClassName
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={cn('pb-3', headerClassName)}>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              {titleIcon && (
                <Icon icon={titleIcon} className='text-primary size-5' />
              )}
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {viewAllHref && (
            <Button variant='ghost' size='sm' asChild>
              <Link href={viewAllHref}>
                {viewAllLabel}
                <Icon icon='solar:arrow-right-linear' className='ml-1 size-4' />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

// ============================================
// Item Card (for courses, modules, etc.)
// ============================================

interface ItemCardProps {
  href?: string;
  accentColor?: string;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  };
  progress?: number;
  meta?: string;
  onClick?: () => void;
}

export function ItemCard({
  href,
  accentColor = 'from-primary to-primary/80',
  title,
  subtitle,
  badge,
  progress,
  meta,
  onClick
}: ItemCardProps) {
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href ? { href } : { onClick };

  const badgeVariantClasses = {
    default: 'bg-primary/10 text-primary',
    secondary: 'bg-muted text-muted-foreground',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-orange-100 text-orange-700',
    destructive: 'bg-red-100 text-red-700'
  };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className='group hover:border-primary/50 relative block cursor-pointer overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md'
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
          accentColor
        )}
      />
      <div className='space-y-3'>
        <div className='flex items-start justify-between'>
          <div>
            <h4 className='group-hover:text-primary font-semibold transition-colors'>
              {title}
            </h4>
            {subtitle && (
              <p className='text-muted-foreground text-xs'>{subtitle}</p>
            )}
          </div>
          {badge && (
            <Badge
              variant='secondary'
              className={badgeVariantClasses[badge.variant || 'success']}
            >
              {badge.text}
            </Badge>
          )}
        </div>
        {typeof progress === 'number' && (
          <div className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span className='text-muted-foreground'>Progress</span>
              <span className='font-medium'>{progress}%</span>
            </div>
            <Progress value={progress} className='h-1.5' />
          </div>
        )}
        {meta && (
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <Icon icon='solar:clock-circle-linear' className='size-3' />
            {meta}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

// ============================================
// List Item (for activities, tasks, etc.)
// ============================================

interface ListItemProps {
  icon: string;
  iconClassName?: string;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    className?: string;
  };
  meta?: string;
  onClick?: () => void;
}

export function ListItem({
  icon,
  iconClassName = 'text-primary bg-primary/10',
  title,
  subtitle,
  badge,
  meta,
  onClick
}: ListItemProps) {
  return (
    <div
      className={cn(
        'hover:bg-accent/50 flex items-center gap-4 rounded-xl border p-3 transition-colors',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-xl',
          iconClassName
        )}
      >
        <Icon icon={icon} className='size-5' />
      </div>
      <div className='min-w-0 flex-1'>
        <h4 className='truncate font-medium'>{title}</h4>
        {subtitle && (
          <p className='text-muted-foreground truncate text-xs'>{subtitle}</p>
        )}
      </div>
      <div className='flex-shrink-0 text-right'>
        {badge && (
          <Badge variant='outline' className={cn('text-xs', badge.className)}>
            {badge.text}
          </Badge>
        )}
        {meta && <p className='text-muted-foreground mt-1 text-xs'>{meta}</p>}
      </div>
    </div>
  );
}

// ============================================
// Schedule Item
// ============================================

interface ScheduleItemProps {
  time: string;
  title: string;
  subtitle?: string;
  isHighlighted?: boolean;
}

export function ScheduleItem({
  time,
  title,
  subtitle,
  isHighlighted
}: ScheduleItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        isHighlighted && 'bg-primary/5 -mx-2 rounded-lg px-2 py-1'
      )}
    >
      <div className='text-muted-foreground w-16 text-xs font-medium'>
        {time}
      </div>
      <div className='flex-1'>
        <p
          className={cn('text-sm font-medium', isHighlighted && 'text-primary')}
        >
          {title}
        </p>
        {subtitle && (
          <p className='text-muted-foreground text-xs'>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Quick Action Button Grid
// ============================================

interface QuickActionProps {
  icon: string;
  label: string;
  href: string;
}

export function QuickActionGrid({ actions }: { actions: QuickActionProps[] }) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {actions.map((action, i) => (
        <Button
          key={i}
          variant='outline'
          size='sm'
          className='h-auto flex-col gap-1 py-3'
          asChild
        >
          <Link href={action.href}>
            <Icon icon={action.icon} className='text-primary size-5' />
            <span className='text-xs'>{action.label}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}

// ============================================
// Achievement Badge
// ============================================

interface AchievementBadgeProps {
  icon: string;
  title: string;
  description: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-500 to-cyan-500',
  epic: 'from-purple-500 to-pink-500',
  legendary: 'from-amber-400 to-yellow-600'
};

export function AchievementBadge({
  icon,
  title,
  description,
  rarity = 'common'
}: AchievementBadgeProps) {
  return (
    <div className='hover:bg-accent/50 flex items-center gap-3 rounded-lg p-2 transition-colors'>
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-sm',
          RARITY_COLORS[rarity]
        )}
      >
        <Icon icon={icon} className='size-5 text-white' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{title}</p>
        <p className='text-muted-foreground truncate text-xs'>{description}</p>
      </div>
    </div>
  );
}

// ============================================
// Empty State
// ============================================

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-8 text-center'>
      <div className='bg-muted mb-3 flex size-12 items-center justify-center rounded-full'>
        <Icon icon={icon} className='text-muted-foreground size-6' />
      </div>
      <h4 className='font-medium'>{title}</h4>
      {description && (
        <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
      )}
      {action && (
        <Button variant='outline' size='sm' className='mt-4' asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

// ============================================
// Dashboard Loading State
// ============================================

interface DashboardLoadingProps {
  icon?: string;
  title?: string;
  description?: string;
}

export function DashboardLoading({
  icon = 'solar:widget-2-bold-duotone',
  title = 'Loading your dashboard',
  description = 'Preparing your overview...'
}: DashboardLoadingProps) {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='relative'>
          <div className='bg-primary/20 absolute inset-0 animate-ping rounded-full' />
          <div className='bg-primary/10 relative flex size-14 items-center justify-center rounded-full'>
            <Icon icon={icon} className='text-primary size-7 animate-pulse' />
          </div>
        </div>
        <div className='space-y-1'>
          <h3 className='font-medium'>{title}</h3>
          <p className='text-muted-foreground text-sm'>{description}</p>
        </div>
      </div>
    </div>
  );
}
