'use server';

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
    // Clerk auth temporarily disabled
    // For now, just return empty array
    return [];
  } catch (error) {
    console.error('[fetchTenants] Error fetching tenants:', error);
    return [];
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
    // Clerk auth temporarily disabled
    return false;
  } catch (error) {
    console.error('[switchTenant] Error switching tenant:', error);
    return false;
  }
}
