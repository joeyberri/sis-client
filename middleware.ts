import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/',
  '/api/webhooks(.*)' // Allow webhook routes (Clerk, Stripe, etc.)
]);

const isAuthRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // If user is signed in and trying to access auth pages, redirect to dashboard
  if (userId && isAuthRoute(request)) {
    // Prevent redirect loops by checking if we're already coming from a redirect
    const url = new URL(request.url);
    const fromRedirect = url.searchParams.get('fromRedirect');

    if (!fromRedirect) {
      const redirectUrl = new URL('/dashboard', request.url);
      redirectUrl.searchParams.set('fromRedirect', 'true');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
