'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { ModuleName, PackageTier, ModuleConfig } from '@/types/modules';
import { MODULES, PACKAGES } from '@/config/modules';

interface ModuleContextType {
  enabledModules: ModuleName[];
  currentTier: PackageTier;
  isModuleEnabled: (moduleName: ModuleName) => boolean;
  canAccessModule: (moduleName: ModuleName) => boolean;
  getModuleConfig: (moduleName: ModuleName) => ModuleConfig | undefined;
  toggleModule: (moduleName: ModuleName) => void;
  updateTier: (tier: PackageTier) => void;
  getAvailableModules: () => ModuleConfig[];
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
  children: ReactNode;
  defaultTier?: PackageTier;
  customEnabledModules?: ModuleName[];
}

export function ModuleProvider({
  children,
  defaultTier = 'standard',
  customEnabledModules
}: ModuleProviderProps) {
  const [currentTier, setCurrentTier] = useState<PackageTier>(defaultTier);
  const [enabledModules, setEnabledModules] = useState<ModuleName[]>([]);

  // Initialize enabled modules based on tier
  useEffect(() => {
    if (customEnabledModules) {
      setEnabledModules(customEnabledModules);
    } else {
      const packageModules = PACKAGES[currentTier].includedModules;
      setEnabledModules(packageModules);
    }
  }, [currentTier, customEnabledModules]);

  // Load tier from localStorage or tenant settings
  useEffect(() => {
    const storedTier = localStorage.getItem('sis_package_tier');
    if (
      storedTier &&
      ['basic', 'standard', 'premium', 'enterprise'].includes(storedTier)
    ) {
      setCurrentTier(storedTier as PackageTier);
    }
  }, []);

  // Save tier to localStorage
  useEffect(() => {
    localStorage.setItem('sis_package_tier', currentTier);
  }, [currentTier]);

  const isModuleEnabled = (moduleName: ModuleName): boolean => {
    return enabledModules.includes(moduleName);
  };

  const canAccessModule = (moduleName: ModuleName): boolean => {
    const module = MODULES[moduleName];
    if (!module) return false;

    // Check if module is available in current tier
    if (!module.tier.includes(currentTier)) return false;

    // Check if module is enabled
    if (!isModuleEnabled(moduleName)) return false;

    // Check dependencies
    if (module.dependencies) {
      const dependenciesMet = module.dependencies.every((dep) =>
        isModuleEnabled(dep)
      );
      if (!dependenciesMet) return false;
    }

    return true;
  };

  const getModuleConfig = (
    moduleName: ModuleName
  ): ModuleConfig | undefined => {
    return MODULES[moduleName];
  };

  const toggleModule = (moduleName: ModuleName) => {
    const module = MODULES[moduleName];
    if (!module) return;

    // Can't toggle if not in current tier
    if (!module.tier.includes(currentTier)) {
      console.warn(
        `Module ${moduleName} is not available in ${currentTier} tier`
      );
      return;
    }

    setEnabledModules((prev) => {
      const isCurrentlyEnabled = prev.includes(moduleName);

      if (isCurrentlyEnabled) {
        // Disabling: Check if other modules depend on this one
        const dependentModules = Object.values(MODULES).filter((m) =>
          m.dependencies?.includes(moduleName)
        );

        const enabledDependents = dependentModules.filter((m) =>
          prev.includes(m.name)
        );

        if (enabledDependents.length > 0) {
          console.warn(
            `Cannot disable ${moduleName}. The following modules depend on it:`,
            enabledDependents.map((m) => m.displayName).join(', ')
          );
          return prev;
        }

        return prev.filter((m) => m !== moduleName);
      } else {
        // Enabling: Ensure dependencies are met
        if (module.dependencies) {
          const missingDeps = module.dependencies.filter(
            (dep) => !prev.includes(dep)
          );
          if (missingDeps.length > 0) {
            console.warn(
              `Cannot enable ${moduleName}. Missing dependencies:`,
              missingDeps.join(', ')
            );
            return prev;
          }
        }

        return [...prev, moduleName];
      }
    });
  };

  const updateTier = (tier: PackageTier) => {
    setCurrentTier(tier);
    // Reset to package defaults
    setEnabledModules(PACKAGES[tier].includedModules);
  };

  const getAvailableModules = (): ModuleConfig[] => {
    return Object.values(MODULES).filter((module) =>
      module.tier.includes(currentTier)
    );
  };

  const value: ModuleContextType = {
    enabledModules,
    currentTier,
    isModuleEnabled,
    canAccessModule,
    getModuleConfig,
    toggleModule,
    updateTier,
    getAvailableModules
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
}
