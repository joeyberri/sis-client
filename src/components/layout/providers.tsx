'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { UserProvider } from '@/context/user/user-context';
import { NotificationProvider } from '@/context/notification/notification-context';
import { ModuleProvider } from '@/context/modules/module-context';

function ThemeAwareClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#007b86'
        }
      }}
      // Let dashboard page handle role-based routing instead of forcing a specific URL
      signInFallbackRedirectUrl='/dashboard'
      signUpFallbackRedirectUrl='/onboarding'
    >
      {children}
    </ClerkProvider>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  return (
    <ModuleProvider defaultTier='standard'>
      <NotificationProvider>
        <UserProvider>{children}</UserProvider>
      </NotificationProvider>
    </ModuleProvider>
  );
}

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <ThemeAwareClerkProvider>
        <InnerProviders>{children}</InnerProviders>
      </ThemeAwareClerkProvider>
    </ActiveThemeProvider>
  );
}
