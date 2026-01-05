'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================
// Stat Card Component
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  highlight?: boolean;
  highlightColor?: 'green' | 'orange' | 'red' | 'blue' | 'purple';
  onClick?: () => void;
}

const HIGHLIGHT_COLORS = {
  green: {
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-600 dark:text-green-400',
  },
  orange: {
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
  },
  red: {
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-600 dark:text-red-400',
  },
  blue: {
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  iconTextColor = 'text-primary',
  trend,
  trendValue,
  highlight = false,
  highlightColor = 'green',
  onClick,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const colors = HIGHLIGHT_COLORS[highlightColor];

  return (
    <Card 
      className={cn(
        'hover:shadow-lg transition-all',
        highlight && colors.border,
        onClick && 'cursor-pointer hover:ring-2 hover:ring-primary/20'
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn(
              'text-3xl font-bold',
              highlight && colors.text
            )}>
              {value}
            </p>
            {subtitle && (
              <p className={cn(
                'text-xs',
                highlight ? `${colors.text} font-medium` : 'text-muted-foreground'
              )}>
                {subtitle}
              </p>
            )}
            {trend && trendValue && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-green-600',
                trend === 'down' && 'text-red-600',
                trend === 'neutral' && 'text-muted-foreground'
              )}>
                <TrendIcon className="w-3 h-3" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', iconBgColor)}>
            <Icon className={cn('w-6 h-6', iconTextColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Quick Actions Grid
// ============================================

interface QuickAction {
  label: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
}

export function QuickActions({ 
  actions, 
  title = 'Quick Actions', 
  description = 'Frequently used tasks',
  columns = 4,
}: QuickActionsProps) {
  const gridCols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-3', gridCols[columns])}>
          {actions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              className="justify-start h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/30"
              onClick={action.onClick}
            >
              <action.icon className="w-4 h-4 mr-2 text-primary" />
              <div className="text-left">
                <p className="font-medium text-sm">{action.label}</p>
                {action.description && (
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Activity Timeline
// ============================================

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  status?: 'completed' | 'pending' | 'in-progress' | 'warning';
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  title?: string;
  description?: string;
  maxItems?: number;
  onViewAll?: () => void;
}

export function ActivityTimeline({
  items,
  title = 'Recent Activity',
  description = 'Latest updates and events',
  maxItems = 5,
  onViewAll,
}: ActivityTimelineProps) {
  const displayItems = items.slice(0, maxItems);

  const statusColors = {
    completed: 'bg-green-100 text-green-600',
    pending: 'bg-orange-100 text-orange-600',
    'in-progress': 'bg-blue-100 text-blue-600',
    warning: 'bg-red-100 text-red-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((item, i) => {
            const Icon = item.icon;
            const bgColor = item.status 
              ? statusColors[item.status] 
              : item.iconBgColor || 'bg-primary/10';
            const textColor = item.iconTextColor || 'text-primary';
            
            return (
              <div key={item.id} className="flex gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  bgColor
                )}>
                  {Icon && <Icon className={cn('w-5 h-5', textColor)} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Alerts/Notices Card
// ============================================

interface AlertItem {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertsCardProps {
  alerts: AlertItem[];
  title?: string;
  description?: string;
}

export function AlertsCard({
  alerts,
  title = 'Notices',
  description = 'Important updates and alerts',
}: AlertsCardProps) {
  if (alerts.length === 0) return null;

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    warning: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
  };

  const badgeVariants = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'p-4 rounded-lg border',
              typeStyles[alert.type]
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={badgeVariants[alert.type]}>
                    {alert.type}
                  </Badge>
                  <p className="text-sm font-medium">{alert.title}</p>
                </div>
                {alert.description && (
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                )}
              </div>
              {alert.action && (
                <Button size="sm" variant="outline" onClick={alert.action.onClick}>
                  {alert.action.label}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================
// Dashboard Header
// ============================================

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  greeting?: boolean;
  actions?: ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  userName,
  greeting = true,
  actions,
}: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        {greeting && userName ? (
          <>
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <h1 className="text-3xl font-bold">{userName}</h1>
          </>
        ) : (
          <h1 className="text-3xl font-bold">{title}</h1>
        )}
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// ============================================
// Progress Card
// ============================================

interface ProgressItem {
  label: string;
  value: number;
  max: number;
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red';
}

interface ProgressCardProps {
  title: string;
  description?: string;
  items: ProgressItem[];
}

export function ProgressCard({ title, description, items }: ProgressCardProps) {
  const colorStyles = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => {
          const percentage = Math.round((item.value / item.max) * 100);
          return (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.value}/{item.max} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full transition-all',
                    colorStyles[item.color || 'blue']
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ============================================
// List Card
// ============================================

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  icon?: LucideIcon;
  onClick?: () => void;
}

interface ListCardProps {
  title: string;
  description?: string;
  items: ListItem[];
  maxItems?: number;
  emptyMessage?: string;
  onViewAll?: () => void;
}

export function ListCard({
  title,
  description,
  items,
  maxItems = 5,
  emptyMessage = 'No items to display',
  onViewAll,
}: ListCardProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {onViewAll && items.length > maxItems && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg bg-muted/50',
                    item.onClick && 'cursor-pointer hover:bg-muted'
                  )}
                  onClick={item.onClick}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || 'secondary'}>{item.badge}</Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
