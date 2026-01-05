import SuperAdminDashboard from '@/features/dashboards/superadmin-dashboard';

export const metadata = {
  title: 'System Administration Dashboard',
  description: 'Platform-wide overview and management',
};

export default function SuperAdminOverviewPage() {
  return <SuperAdminDashboard />;
}
