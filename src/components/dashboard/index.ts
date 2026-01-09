// Dashboard Shared Components
// ============================

export {
  StatCard,
  QuickActions,
  ActivityTimeline,
  AlertsCard,
  DashboardHeader,
  ProgressCard,
  ListCard
} from './shared-components';

// New reusable dashboard components with Solar icons
export {
  StatCard as SolarStatCard,
  StatCardSkeleton,
  StatCardGrid
} from './stat-card';
export type { StatCardProps, StatCardVariant } from './stat-card';

export { QuickActionsCard, QuickActionButton } from './quick-actions';
export type { QuickAction, QuickActionsCardProps } from './quick-actions';

export { UpcomingEventsCard } from './upcoming-events';
export type { UpcomingEvent, UpcomingEventsCardProps } from './upcoming-events';

export { RecentActivityCard } from './recent-activity';
export type { ActivityItem, RecentActivityCardProps } from './recent-activity';

// Premium Dashboard Primitives (new unified design system)
export {
  DashboardHero,
  MetricCard,
  SectionCard,
  ItemCard,
  ListItem,
  ScheduleItem,
  QuickActionGrid,
  AchievementBadge,
  EmptyState,
  DashboardLoading
} from './dashboard-primitives';

// Re-export types for convenience
export type {} from // Add any specific types you want to export
'./shared-components';
