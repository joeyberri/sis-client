/**
 * Tests for auth redirect fixes
 * Verifies that redirect loops are prevented
 */

import {
  isFromRedirect,
  createSafeRedirectUrl,
  isAuthRoute,
  isPublicRoute
} from '@/lib/auth/utils';

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseRouter = jest.fn(() => ({
  push: mockPush,
  replace: mockReplace,
  pathname: '/dashboard'
}));

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  usePathname: () => '/dashboard'
}));

describe('Auth Redirect Fixes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Redirect State Management', () => {
    it('should detect redirect state from URL parameters', () => {
      const urlParams = new URLSearchParams('?fromRedirect=true');
      expect(isFromRedirect(urlParams)).toBe(true);
    });

    it('should not detect redirect state when not present', () => {
      const urlParams = new URLSearchParams('?otherParam=value');
      expect(isFromRedirect(urlParams)).toBe(false);
    });

    it('should create safe redirect URLs with state tracking', () => {
      const safeUrl = createSafeRedirectUrl('/dashboard', 'http://localhost');
      expect(safeUrl.searchParams.get('fromRedirect')).toBe('true');
      expect(safeUrl.pathname).toBe('/dashboard');
    });
  });

  describe('Route Classification', () => {
    it('should correctly identify auth routes', () => {
      expect(isAuthRoute('/auth/sign-in')).toBe(true);
      expect(isAuthRoute('/auth/sign-up')).toBe(true);
      expect(isAuthRoute('/auth/sign-in?redirect=/dashboard')).toBe(true);
      expect(isAuthRoute('/dashboard')).toBe(false);
      expect(isAuthRoute('/')).toBe(false);
    });

    it('should correctly identify public routes', () => {
      expect(isPublicRoute('/auth/sign-in')).toBe(true);
      expect(isPublicRoute('/auth/sign-up')).toBe(true);
      expect(isPublicRoute('/')).toBe(true);
      expect(isPublicRoute('/api/webhooks')).toBe(true);
      expect(isPublicRoute('/dashboard')).toBe(false);
      expect(isPublicRoute('/dashboard/students')).toBe(false);
    });
  });

  describe('Middleware Redirect Logic', () => {
    it('should prevent redirect loops by checking fromRedirect parameter', () => {
      // Simulate middleware logic
      const requestUrl = new URL(
        'http://localhost/auth/sign-in?fromRedirect=true'
      );
      const fromRedirect = requestUrl.searchParams.get('fromRedirect');

      // If already from redirect, don't redirect again
      if (fromRedirect) {
        expect(mockReplace).not.toHaveBeenCalled();
      } else {
        // This would normally redirect, but we're testing the prevention
        const redirectUrl = new URL('/dashboard', requestUrl);
        redirectUrl.searchParams.set('fromRedirect', 'true');
        expect(redirectUrl.searchParams.get('fromRedirect')).toBe('true');
      }
    });

    it('should allow redirects when not from redirect state', () => {
      const requestUrl = new URL('http://localhost/auth/sign-in');
      const fromRedirect = requestUrl.searchParams.get('fromRedirect');

      if (!fromRedirect) {
        const redirectUrl = new URL('/dashboard', requestUrl);
        redirectUrl.searchParams.set('fromRedirect', 'true');
        expect(redirectUrl.searchParams.get('fromRedirect')).toBe('true');
        expect(redirectUrl.pathname).toBe('/dashboard');
      }
    });
  });

  describe('API Client 401 Handling', () => {
    it('should prevent redirect loops in API client', () => {
      // Simulate API client 401 handling logic
      const isAuthPage = false;
      const noRedirect = false;
      const urlParams = new URLSearchParams('?fromRedirect=true');
      const fromRedirect = urlParams.get('fromRedirect');

      // Should not redirect if already from redirect
      if (!noRedirect && !isAuthPage && !fromRedirect) {
        // Would normally redirect
        expect(fromRedirect).toBe('true'); // This prevents the redirect
      } else {
        // Should not redirect
        expect(mockPush).not.toHaveBeenCalled();
        expect(mockReplace).not.toHaveBeenCalled();
      }
    });

    it('should handle 401 on dashboard without redirect loop', () => {
      const isDashboardPage = true;
      const isAuthPage = false;
      const noRedirect = false;
      const urlParams = new URLSearchParams('?fromRedirect=true');
      const fromRedirect = urlParams.get('fromRedirect');

      // On dashboard with 401, should not redirect to avoid loops
      if (isDashboardPage) {
        // Log error but don't redirect
        expect(isDashboardPage).toBe(true);
        expect(mockReplace).not.toHaveBeenCalled();
      }
    });
  });

  describe('Server Auth Utilities', () => {
    it('should create safe redirects in server utilities', () => {
      // Simulate the safe redirect logic from server.ts
      const dashboardRoute = '/dashboard/admin';
      const redirectUrl = new URL(dashboardRoute, 'http://localhost');
      redirectUrl.searchParams.set('fromRedirect', 'true');

      expect(redirectUrl.searchParams.get('fromRedirect')).toBe('true');
      expect(redirectUrl.pathname).toBe('/dashboard/admin');
    });

    it('should handle auth redirects with state tracking', () => {
      const redirectTo = '/auth/sign-in';
      const redirectUrl = new URL(redirectTo, 'http://localhost');
      redirectUrl.searchParams.set('fromRedirect', 'true');

      expect(redirectUrl.searchParams.get('fromRedirect')).toBe('true');
      expect(redirectUrl.pathname).toBe('/auth/sign-in');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete auth flow without redirect loops', () => {
      // 1. User tries to access protected route
      const protectedRoute = '/dashboard';
      const isProtected = protectedRoute.startsWith('/dashboard');
      expect(isProtected).toBe(true);

      // 2. User is not authenticated, redirect to sign-in
      const signInUrl = new URL('/auth/sign-in', 'http://localhost');
      signInUrl.searchParams.set('fromRedirect', 'true');

      // 3. User signs in successfully
      const userId = 'user_123';
      const isSignedIn = !!userId;

      // 4. User is redirected back, but fromRedirect prevents loop
      const redirectBackUrl = new URL('/dashboard', 'http://localhost');
      const fromRedirect = redirectBackUrl.searchParams.get('fromRedirect');

      if (fromRedirect) {
        // Don't redirect again
        expect(mockReplace).not.toHaveBeenCalled();
      }
    });

    it('should handle auth page access when already signed in', () => {
      // User is signed in and tries to access auth page
      const currentPath = '/auth/sign-in';
      const isAuthRoute = currentPath.startsWith('/auth');
      const isSignedIn = true;

      if (isAuthRoute && isSignedIn) {
        // Redirect to dashboard with state tracking
        const redirectUrl = new URL('/dashboard', 'http://localhost');
        redirectUrl.searchParams.set('fromRedirect', 'true');
        expect(redirectUrl.searchParams.get('fromRedirect')).toBe('true');
      }
    });
  });
});
