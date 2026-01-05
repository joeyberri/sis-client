import StudentDashboard from '@/features/dashboards/student-dashboard';

export const metadata = {
  title: 'Student Dashboard',
  description: 'Track your courses, assignments, and academic progress',
};

export default function StudentOverviewPage() {
  return <StudentDashboard />;
}
