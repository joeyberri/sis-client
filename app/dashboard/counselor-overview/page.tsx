import CounselorDashboard from '@/features/dashboards/counselor-dashboard';

export const metadata = {
  title: 'Counselor Dashboard',
  description: 'Track at-risk students, interventions, and student wellness',
};

export default function CounselorOverviewPage() {
  return <CounselorDashboard />;
}
