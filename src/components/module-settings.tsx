'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useModules } from '@/context/modules/module-context';
import { MODULES } from '@/config/modules';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ModuleSettings() {
  const {
    enabledModules,
    currentTier,
    isModuleEnabled,
    canAccessModule,
    toggleModule,
    getAvailableModules
  } = useModules();

  const availableModules = getAvailableModules();

  const getTierBadgeColor = () => {
    switch (currentTier) {
      case 'basic':
        return 'bg-gray-500';
      case 'standard':
        return 'bg-blue-500';
      case 'premium':
        return 'bg-purple-500';
      case 'enterprise':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Module Settings</h2>
          <p className='text-muted-foreground'>
            Manage which modules are enabled for your school
          </p>
        </div>
        <Badge className={getTierBadgeColor()}>
          {currentTier.toUpperCase()} Tier
        </Badge>
      </div>

      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Your current tier includes {availableModules.length} modules. Upgrade
          to access more features.
        </AlertDescription>
      </Alert>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Object.values(MODULES).map((module) => {
          const isAvailable = module.tier.includes(currentTier);
          const isEnabled = isModuleEnabled(module.name);
          const canAccess = canAccessModule(module.name);
          const hasDependencies =
            module.dependencies && module.dependencies.length > 0;

          return (
            <Card
              key={module.name}
              className={!isAvailable ? 'opacity-50' : ''}
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='flex items-center gap-2'>
                      {module.displayName}
                      {!isAvailable && <Lock className='h-4 w-4' />}
                      {canAccess && (
                        <CheckCircle2 className='h-4 w-4 text-green-500' />
                      )}
                    </CardTitle>
                    <CardDescription className='mt-2'>
                      {module.description}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleModule(module.name)}
                    disabled={!isAvailable}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                    <span className='font-medium'>Available in:</span>
                    <div className='flex gap-1'>
                      {module.tier.map((tier) => (
                        <Badge
                          key={tier}
                          variant={tier === currentTier ? 'default' : 'outline'}
                          className='text-xs'
                        >
                          {tier}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {hasDependencies && (
                    <div className='text-muted-foreground flex items-start gap-2 text-xs'>
                      <span className='font-medium'>Requires:</span>
                      <div className='flex flex-wrap gap-1'>
                        {module.dependencies!.map((dep) => (
                          <Badge
                            key={dep}
                            variant='secondary'
                            className='text-xs'
                          >
                            {MODULES[dep].displayName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {module.route && (
                    <div className='text-muted-foreground text-xs'>
                      <span className='font-medium'>Route:</span> {module.route}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
