'use client';

import { useUser as useClerkUser, useAuth } from '@clerk/nextjs';
import apiClient from '@/lib/api/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types/user';
import { USER_ROLES } from '@/constants/roles';

interface UserContextType {
  user: User | null;
  clerkUser: any; // Clerk user object
  role: UserRole | null;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  isRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const { getToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeUser() {
      if (!isLoaded) {
        return; // Wait for Clerk to load
      }

      if (!clerkUser) {
        // User signed out
        apiClient.setAuthToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Step 1: Attach token first
      try {
        const token = await getToken({ skipCache: true });
        if (token) {
          apiClient.setAuthToken(token);
          console.log('[user-context] Token attached to apiClient');
        } else {
          console.warn('[user-context] getToken returned null - user may not be fully authenticated');
          setUser(null);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn('[user-context] Failed to get Clerk token:', e);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Step 2: Now fetch user data with the token attached
      try {
        // apiClient.get now returns response.data (not the full Axios response).
        // Some servers may still return { data: {...} } or { user: {...} } shapes.
        let apiResp: any = await apiClient.get('/auth/me');

        // Normalize common shapes: { data: {...} } or { user: {...} }
        if (apiResp && typeof apiResp === 'object' && 'data' in apiResp) {
          apiResp = apiResp.data;
        }

        const userData = apiResp?.user ?? apiResp ?? null;

        if (!userData || !userData.id) {
          // No usable user returned — log and fallback to Clerk info
          console.warn('[user-context] /auth/me returned no user, falling back to Clerk user where possible', apiResp);

          const role = (clerkUser?.publicMetadata?.role as UserRole) || USER_ROLES.STUDENT;
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            role,
            avatar: clerkUser.imageUrl,
            tenantId: clerkUser.publicMetadata?.tenantId as string,
            createdAt: clerkUser.createdAt?.toISOString(),
            updatedAt: clerkUser.updatedAt?.toISOString(),
            metadata: clerkUser.publicMetadata as any,
          });

          setIsLoading(false);
          return;
        }

        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          tenantId: userData.tenantId,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        });
      } catch (error: any) {
        console.warn('[user-context] Failed to fetch user data from API:', error);
        
        // If it's a 401 error, don't fallback to Clerk data - user needs proper authentication
        if (error?.response?.status === 401) {
          console.warn('[user-context] Unauthorized - token may be invalid or expired');
          setUser(null);
        } else {
          // Only fallback to Clerk data for other errors (network issues, server errors, etc.)
          const role = (clerkUser?.publicMetadata?.role as UserRole) || USER_ROLES.STUDENT;
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            role,
            avatar: clerkUser.imageUrl,
            tenantId: clerkUser.publicMetadata?.tenantId as string,
            createdAt: clerkUser.createdAt?.toISOString(),
            updatedAt: clerkUser.updatedAt?.toISOString(),
            metadata: clerkUser.publicMetadata as any,
          });
        }
      }
      
      setIsLoading(false);
    }

    initializeUser();

    // Set up token refresh interval (refresh every 45 seconds to stay ahead of 1-minute expiry)
    let refreshInterval: NodeJS.Timeout | null = null;
    if (clerkUser && getToken) {
      refreshInterval = setInterval(async () => {
        try {
          const token = await getToken({ skipCache: true });
          if (token) {
            apiClient.setAuthToken(token);
            // eslint-disable-next-line no-console
            console.log('[user-context] Token refreshed');
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[user-context] Failed to refresh token:', e);
        }
      }, 45000); // Refresh every 45 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [clerkUser, isLoaded, getToken]);

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === USER_ROLES.SUPER_ADMIN) return true;

    // Check role permissions (this would be expanded with actual permission checking)
    // For now, return true if user has the role that typically has access
    return true; // Placeholder - implement actual permission checking
  };

  const isRole = (checkRole: UserRole): boolean => {
    return user?.role === checkRole;
  };

  const value: UserContextType = {
    user,
    clerkUser,
    role: user?.role || null,
    isLoading,
    hasPermission,
    isRole,
    isAdmin: isRole(USER_ROLES.ADMIN) || isRole(USER_ROLES.SUPER_ADMIN),
    isTeacher: isRole(USER_ROLES.TEACHER),
    isStudent: isRole(USER_ROLES.STUDENT),
    isParent: isRole(USER_ROLES.PARENT),
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}