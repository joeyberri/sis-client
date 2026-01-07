'use client';

import { useModules } from '@/context/modules/module-context';
import { ModuleName } from '@/types/modules';
import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface ModuleGuardProps {
  moduleName: ModuleName;
  children: ReactNode;
  fallback?: ReactNode;
  showAlert?: boolean;
}

export function ModuleGuard({
  moduleName,
  children,
  fallback,
  showAlert = true
}: ModuleGuardProps) {
  const { canAccessModule, getModuleConfig } = useModules();

  if (!canAccessModule(moduleName)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showAlert) {
      const moduleConfig = getModuleConfig(moduleName);
      return (
        <div className='flex min-h-[400px] items-center justify-center p-8'>
          <Alert className='max-w-md'>
            <Lock className='h-4 w-4' />
            <AlertTitle>Module Not Available</AlertTitle>
            <AlertDescription>
              {moduleConfig?.displayName || moduleName} is not available in your
              current package. Please upgrade to access this feature.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}
