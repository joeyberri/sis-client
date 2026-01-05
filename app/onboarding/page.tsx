'use client';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use the tenantId from publicMetadata if available, otherwise fallback to userId
  // The onboarding flow will use this ID to create/update the school configuration
  const tenantId = (user?.publicMetadata?.tenantId as string) || user?.id || 'dev-tenant';

  return (
    <main>
      <OnboardingFlow tenantId={tenantId} />
    </main>
  );
}
