'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { role, isLoading } = useUser();
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    // Wait for both Clerk and our user context to load
    if (!clerkLoaded || isLoading || hasRedirected) return;

    // Get role from our context, fallback to Clerk metadata
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

    if (userRole && dashboardMap[userRole]) {
      // We have a valid role - redirect to role-specific dashboard
      setHasRedirected(true);
      router.replace(dashboardMap[userRole]);
    } else if (retryCount < maxRetries) {
      // No role found yet - retry a few times before giving up
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Max retries reached - redirect to onboarding
      setHasRedirected(true);
      router.replace('/onboarding');
    }
  }, [
    role,
    isLoading,
    clerkLoaded,
    clerkUser,
    router,
    hasRedirected,
    retryCount
  ]);

  // Premium loading experience while resolving role
  return (
    <div className='from-background via-background to-muted/30 flex min-h-screen items-center justify-center bg-gradient-to-br'>
      <div className='flex flex-col items-center gap-6 text-center'>
        {/* Animated logo/icon */}
        <div className='relative'>
          <div className='bg-primary/20 absolute inset-0 animate-ping rounded-full' />
          <div className='bg-primary/10 relative flex size-16 items-center justify-center rounded-full'>
            <Icon
              icon='solar:diploma-bold-duotone'
              className='text-primary size-8 animate-pulse'
            />
          </div>
        </div>

        {/* Loading text */}
        <div className='space-y-2'>
          <h2 className='text-foreground text-lg font-medium'>
            Preparing your dashboard
          </h2>
          <p className='text-muted-foreground text-sm'>
            Just a moment while we personalize your experience...
          </p>
        </div>

        {/* Progress indicator */}
        <div className='flex items-center gap-1.5'>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'bg-primary/40 size-2 rounded-full transition-all duration-300',
                i <= retryCount && 'bg-primary scale-110'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
