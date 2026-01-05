/**
 * Auth module exports
 * 
 * Usage:
 * 
 * // Server-side (Server Components, Server Actions, Route Handlers)
 * import { getAuth, requireAuth, hasPermission } from '@/lib/auth/server';
 * 
 * // Client-side (Client Components with 'use client')
 * import { useOrgAuth, useGradePermissions } from '@/lib/auth/client';
 * 
 * // Types and constants (both server and client)
 * import { ROLE_PERMISSIONS, ROLE_DISPLAY_NAMES } from '@/lib/auth/types';
 */

// Re-export types
export * from './types';

// Note: Server and client exports are separate files
// Import directly from '@/lib/auth/server' or '@/lib/auth/client'
// This avoids bundling issues with 'use client' directives
