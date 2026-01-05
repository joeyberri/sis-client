import AccountantDashboard from '@/features/dashboards/accountant-dashboard';

export const metadata = {
  title: 'Financial Management Dashboard',
  description: 'Manage fees, invoices, payments, and financial reports',
};

export default function AccountantOverviewPage() {
  return <AccountantDashboard />;
}
