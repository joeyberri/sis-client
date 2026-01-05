'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/user/user-context';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/empty-state';

export default function Dashboard() {
  const { role, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Route to role-specific dashboard
    const dashboardMap: Record<string, string> = {
      superadmin: '/dashboard/superadmin-overview',
      admin: '/dashboard/admin-overview',
      teacher: '/dashboard/teacher-overview',
      student: '/dashboard/student-overview',
      parent: '/dashboard/parent-overview',
      counselor: '/dashboard/counselor-overview',
      accountant: '/dashboard/accountant-overview',
    };

    const dashboardPath = dashboardMap[role as string] || '/dashboard/overview';
    router.push(dashboardPath);
  }, [role, isLoading, router]);

  return <LoadingState title="Loading..." description="Redirecting to your dashboard..." />;
}
