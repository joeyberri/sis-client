import AdminDashboard from '@/features/dashboards/admin-dashboard';

export const metadata = {
  title: 'School Admin Dashboard',
  description: 'Manage school operations, students, teachers, and academic activities',
};

export default function AdminOverviewPage() {
  return <AdminDashboard />;
}
