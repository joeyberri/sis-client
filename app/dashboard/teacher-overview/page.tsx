import TeacherDashboard from '@/features/dashboards/teacher-dashboard';

export const metadata = {
  title: 'Teacher Dashboard',
  description: 'Manage classes, grade assignments, and track student progress',
};

export default function TeacherOverviewPage() {
  return <TeacherDashboard />;
}
