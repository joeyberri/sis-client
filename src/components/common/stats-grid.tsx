'use client';

import { ReactNode } from 'react';
import { StatsCard } from './stats-card';

interface StatsGridProps {
  stats: Array<{
    title: string;
    value: string | number;
    description?: string;
    icon?: ReactNode;
    trend?: {
      value: number;
      label: string;
      reverse?: boolean;
    };
    badge?: {
      text: string;
      variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    };
    onClick?: () => void;
  }>;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({
  stats,
  columns = 3,
  className = ''
}: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
          badge={stat.badge}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
}
