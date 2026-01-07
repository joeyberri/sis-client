/**
 * Authentication utilities for redirect state management
 */

import { redirect } from 'next/navigation';

/**
 * Check if current request is coming from a redirect to prevent loops
 */
export function isFromRedirect(searchParams: URLSearchParams): boolean {
  return searchParams.get('fromRedirect') === 'true';
}

/**
 * Create a redirect URL with state tracking
 */
export function createSafeRedirectUrl(url: string, baseUrl: string): URL {
  const redirectUrl = new URL(url, baseUrl);
  redirectUrl.searchParams.set('fromRedirect', 'true');
  return redirectUrl;
}

/**
 * Safe redirect that prevents loops
 */
export function safeRedirect(url: string, baseUrl: string): never {
  const redirectUrl = createSafeRedirectUrl(url, baseUrl);
  redirect(redirectUrl.toString());
  // This function never returns
  throw new Error('Redirect failed');
}

/**
 * Check if current path is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/auth/sign-in') || pathname.startsWith('/auth/sign-up')
  );
}

/**
 * Check if current path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/', '/api/webhooks'];
  return publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );
}
