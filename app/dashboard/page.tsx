'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/empty-state';

export default function Dashboard() {
  const { role, isLoading } = useUser();
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Wait for both Clerk and our user context to load
    if (!clerkLoaded || isLoading || hasRedirected) return;

    // Prevent multiple redirects
    setHasRedirected(true);

    // Get role from our context, fallback to Clerk metadata, then default to overview
    const userRole =
      role || (clerkUser?.publicMetadata?.role as string) || null;

    // Route to role-specific dashboard
    const dashboardMap: Record<string, string> = {
      superadmin: '/dashboard/superadmin-overview',
      admin: '/dashboard/admin-overview',
      teacher: '/dashboard/teacher-overview',
      student: '/dashboard/student-overview',
      parent: '/dashboard/parent-overview',
      counselor: '/dashboard/counselor-overview',
      accountant: '/dashboard/accountant-overview'
    };

    const dashboardPath =
      userRole && dashboardMap[userRole]
        ? dashboardMap[userRole]
        : '/dashboard/overview';

    router.replace(dashboardPath);
  }, [role, isLoading, clerkLoaded, clerkUser, router, hasRedirected]);

  return (
    <LoadingState
      title='Loading...'
      description='Redirecting to your dashboard...'
    />
  );
}
