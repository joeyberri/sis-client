'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils'; // Standard shadcn utility

// --- Types ---

interface TrendIndicatorProps {
  value: number;
  label?: string;
  reverse?: boolean; // If true, negative numbers are "good" (e.g., churn rate)
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: TrendIndicatorProps;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  };
  loading?: boolean;
  className?: string;
  valueFormatter?: (value: number) => string;
  onClick?: () => void;
}

// --- Components ---

export function TrendIndicator({
  value,
  label,
  reverse = false
}: TrendIndicatorProps) {
  if (value === 0) {
    return (
      <div
        className='text-muted-foreground flex items-center text-xs font-medium'
        role='status'
        aria-label='No change'
      >
        <Minus className='mr-1 h-3 w-3' />
        0% {label}
      </div>
    );
  }

  // Determine sentiment
  const isPositiveMovement = value > 0;
  const isGood = reverse ? !isPositiveMovement : isPositiveMovement;

  const Icon = isPositiveMovement ? TrendingUp : TrendingDown;
  const colorClass = isGood ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={cn('flex items-center text-xs font-medium', colorClass)}
      role='status'
      aria-label={`${value}% ${isPositiveMovement ? 'increase' : 'decrease'}`}
    >
      <Icon className='mr-1 h-3 w-3' />
      {Math.abs(value)}% {label}
    </div>
  );
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  badge,
  loading = false,
  className,
  valueFormatter,
  onClick
}: StatsCardProps) {
  const formattedValue =
    typeof value === 'number' && valueFormatter
      ? valueFormatter(value)
      : typeof value === 'number'
        ? value.toLocaleString()
        : value;

  const Wrapper = onClick ? 'div' : 'div'; // Semantic div, simpler than button nesting issues

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-8 w-8 rounded-full' />
        </CardHeader>
        <CardContent>
          <Skeleton className='mb-2 h-8 w-[60px]' />
          <Skeleton className='h-3 w-[140px]' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        onClick &&
          'hover:border-primary/50 cursor-pointer hover:shadow-md active:scale-[0.99]',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Wrapper>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-muted-foreground text-sm font-medium tracking-tight'>
            {title}
          </CardTitle>
          {badge ? (
            <Badge
              variant={
                badge.variant === 'success'
                  ? 'default'
                  : badge.variant === 'destructive' ||
                      badge.variant === 'secondary' ||
                      badge.variant === 'outline'
                    ? badge.variant
                    : 'outline'
              }
              className='h-5 px-1.5 text-[10px]'
            >
              {badge.text}
            </Badge>
          ) : icon ? (
            <div className='text-muted-foreground/70'>{icon}</div>
          ) : null}
        </CardHeader>

        <CardContent>
          <div className='flex flex-col gap-1'>
            <div className='text-2xl font-bold tracking-tight'>
              {formattedValue}
            </div>

            {(description || trend) && (
              <div className='flex items-center gap-2 pt-1'>
                {trend && <TrendIndicator {...trend} />}

                {description && (
                  <p
                    className={cn(
                      'text-muted-foreground text-xs',
                      trend && 'ml-1 border-l pl-1' // Separator if trend exists
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Wrapper>
    </Card>
  );
}
