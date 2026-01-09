'use client';

import { useUser as useClerkUser, useAuth } from '@clerk/nextjs';
import apiClient from '@/lib/api/client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  isAccountant: boolean;
  isCounselor: boolean;
  isSuperAdmin: boolean;
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
  const initAttempted = useRef<string | null>(null);

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

      // Prevent multiple initialization attempts for the same user
      if (initAttempted.current === clerkUser.id) {
        return;
      }
      initAttempted.current = clerkUser.id;

      // Step 1: Attach token first - use default token (nextjs template lacks email claims)
      let token: string | null = null;
      try {
        // Use default token which includes email claims needed by backend
        token = await getToken({ skipCache: true });
        if (token) {
          apiClient.setAuthToken(token);
          // Mask token for safe debug logging
          const masked =
            token.length > 12
              ? `${token.slice(0, 6)}...${token.slice(-6)}`
              : '<<short-token>>';
          console.log(
            '[user-context] Token attached to apiClient (masked)=',
            masked
          );
        } else {
          console.warn(
            '[user-context] getToken returned null - user may not be fully authenticated'
          );
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
          console.warn(
            '[user-context] /auth/me returned no user, falling back to Clerk user where possible',
            apiResp
          );

          const role =
            (clerkUser?.publicMetadata?.role as UserRole) || USER_ROLES.STUDENT;
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
            metadata: clerkUser.publicMetadata as any
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
          updatedAt: userData.updatedAt
        });
      } catch (error: any) {
        console.warn(
          '[user-context] Failed to fetch user data from API:',
          error
        );

        // If it's a 401 error, the user doesn't exist in backend yet - create them
        if (error?.response?.status === 401) {
          console.log(
            '[user-context] User not found in backend, creating new user record...'
          );

          try {
            // Create user in backend using Clerk data
            const role =
              (clerkUser?.publicMetadata?.role as UserRole) ||
              USER_ROLES.STUDENT;
            const tenantId =
              (clerkUser?.publicMetadata?.tenantId as string) || 'default';

            // Try to create the user in the backend
            await apiClient.post('/auth/users', {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
              role: role,
              tenantId: tenantId
            });

            // After creating, try to fetch the user again
            const retryResp: any = await apiClient.get('/auth/me');
            let retryUserData = retryResp?.user ?? retryResp ?? null;

            if (retryUserData && retryUserData.id) {
              setUser({
                id: retryUserData.id,
                email: retryUserData.email,
                name: retryUserData.name,
                role: retryUserData.role,
                tenantId: retryUserData.tenantId,
                createdAt: retryUserData.createdAt,
                updatedAt: retryUserData.updatedAt
              });
              console.log(
                '[user-context] Successfully created and fetched new user'
              );
            } else {
              // If still no user data, fallback to Clerk data
              console.warn(
                '[user-context] User creation successful but still no user data, using Clerk fallback'
              );
              setUser({
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                firstName: clerkUser.firstName || undefined,
                lastName: clerkUser.lastName || undefined,
                role: role,
                avatar: clerkUser.imageUrl,
                tenantId: tenantId,
                createdAt: clerkUser.createdAt?.toISOString(),
                updatedAt: clerkUser.updatedAt?.toISOString(),
                metadata: clerkUser.publicMetadata as any
              });
            }
          } catch (createError) {
            console.error(
              '[user-context] Failed to create user in backend:',
              createError
            );
            // Fallback to Clerk data if user creation fails
            const role =
              (clerkUser?.publicMetadata?.role as UserRole) ||
              USER_ROLES.STUDENT;
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
              metadata: clerkUser.publicMetadata as any
            });
          }
        } else {
          // Only fallback to Clerk data for other errors (network issues, server errors, etc.)
          const role =
            (clerkUser?.publicMetadata?.role as UserRole) || USER_ROLES.STUDENT;
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
            metadata: clerkUser.publicMetadata as any
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
  }, [isLoaded, clerkUser?.id]);

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
    isAccountant: isRole(USER_ROLES.ACCOUNTANT),
    isCounselor: isRole(USER_ROLES.COUNSELOR),
    isSuperAdmin: isRole(USER_ROLES.SUPER_ADMIN)
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
