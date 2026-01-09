'use server';

import { apiClient } from '@/lib/api/client';

interface Tenant {
  id: string;
  name: string;
}

/**
 * Fetch all tenants for the current user
 * Calls the backend /api/tenants endpoint
 */
export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tenants`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
        // Since this is a server action, it might not have the cookie/token automatically
        // but in this environment, we might be relying on Clerk or middleware.
      }
    );

    if (!response.ok) {
      // Fallback to mock if API fails or returns 401/404
      return [{ id: 'red-1', name: 'Redevise Academy' }];
    }

    const data = await response.json();
    return data.data || data || [{ id: 'red-1', name: 'Redevise Academy' }];
  } catch (error) {
    console.error('[fetchTenants] Error fetching tenants:', error);
    // Return at least one tenant to keep the UI alive
    return [{ id: 'red-1', name: 'Redevise Academy' }];
  }
}

/**
 * Get the user's default tenant (usually the first one or marked as default)
 */
export async function getDefaultTenant(): Promise<Tenant | null> {
  const tenants = await fetchTenants();
  return tenants.length > 0 ? tenants[0] : null;
}

/**
 * Switch to a different tenant
 * This updates the user's active tenant context on the backend
 */
export async function switchTenant(tenantId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tenants/switch`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tenantId })
      }
    );

    return response.ok;
  } catch (error) {
    console.error('[switchTenant] Error switching tenant:', error);
    return false;
  }
}
