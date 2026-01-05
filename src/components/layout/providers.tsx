'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { UserProvider } from '@/context/user/user-context';

function ThemeAwareClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#007b86',
        }
      }}
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      signInFallbackRedirectUrl="/dashboard/overview"
      signUpFallbackRedirectUrl="/dashboard/overview"
    >
      {children}
    </ClerkProvider>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
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
        <InnerProviders>
          {children}
        </InnerProviders>
      </ThemeAwareClerkProvider>
    </ActiveThemeProvider>
  );
}
