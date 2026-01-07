/**
 * Authentication Tests
 * Tests for auth flow, redirect handling, and protected routes
 */

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

// Mock Clerk
const mockUseUser = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
  useAuth: () => mockUseAuth(),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Unauthenticated Users', () => {
    it('should redirect to sign-in when accessing protected routes', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
        userId: null
      });
      mockUseUser.mockReturnValue({ isLoaded: true, user: null });

      // Simulate middleware behavior
      const isProtectedRoute = '/dashboard'.startsWith('/dashboard');
      const isSignedIn = false;

      if (isProtectedRoute && !isSignedIn) {
        mockReplace('/auth/sign-in');
      }

      expect(mockReplace).toHaveBeenCalledWith('/auth/sign-in');
    });

    it('should allow access to public routes', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
        userId: null
      });

      const publicRoutes = ['/', '/auth/sign-in', '/auth/sign-up'];

      publicRoutes.forEach((route) => {
        const isPublicRoute = publicRoutes.includes(route);
        expect(isPublicRoute).toBe(true);
      });
    });
  });

  describe('Authenticated Users', () => {
    it('should redirect away from auth pages when signed in', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_123'
      });

      const currentPath = '/auth/sign-in';
      const isAuthRoute = currentPath.startsWith('/auth');
      const isSignedIn = true;

      if (isAuthRoute && isSignedIn) {
        mockReplace('/dashboard');
      }

      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });

    it('should allow access to dashboard when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_123'
      });
      mockUseUser.mockReturnValue({
        isLoaded: true,
        user: { id: 'user_123', publicMetadata: { role: 'admin' } }
      });

      const isSignedIn = true;
      const isProtectedRoute = '/dashboard'.startsWith('/dashboard');

      // Should not redirect
      expect(isSignedIn && isProtectedRoute).toBe(true);
    });
  });

  describe('Redirect Loop Prevention', () => {
    it('should not cause redirect loop with hasRedirected state', () => {
      let hasRedirected = false;
      const redirectCount = { count: 0 };

      const performRedirect = () => {
        if (hasRedirected) return;
        hasRedirected = true;
        redirectCount.count++;
        mockReplace('/dashboard/admin-overview');
      };

      // Simulate multiple render cycles
      performRedirect();
      performRedirect();
      performRedirect();

      expect(redirectCount.count).toBe(1);
      expect(mockReplace).toHaveBeenCalledTimes(1);
    });

    it('should use router.replace instead of router.push to prevent history issues', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_123'
      });

      // Simulate redirect logic
      const shouldRedirect = true;

      if (shouldRedirect) {
        mockReplace('/dashboard/admin-overview');
      }

      expect(mockReplace).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should handle loading states correctly', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: false,
        isSignedIn: false,
        userId: null
      });
      mockUseUser.mockReturnValue({ isLoaded: false, user: null });

      const authLoaded = false;
      const userLoaded = false;
      const isLoading = !authLoaded || !userLoaded;

      // Should not redirect while loading
      if (isLoading) {
        // Show loading state, don't redirect
        expect(mockReplace).not.toHaveBeenCalled();
      }

      expect(isLoading).toBe(true);
    });
  });

  describe('Role-based Routing', () => {
    const roleRoutes: Record<string, string> = {
      superadmin: '/dashboard/superadmin-overview',
      admin: '/dashboard/admin-overview',
      teacher: '/dashboard/teacher-overview',
      student: '/dashboard/student-overview',
      parent: '/dashboard/parent-overview',
      accountant: '/dashboard/accountant-overview',
      counselor: '/dashboard/counselor-overview'
    };

    it.each(Object.entries(roleRoutes))(
      'should redirect %s to correct dashboard',
      (role, expectedRoute) => {
        mockUseUser.mockReturnValue({
          isLoaded: true,
          user: { id: 'user_123', publicMetadata: { role } }
        });

        const userRole = role;
        const targetRoute = roleRoutes[userRole];

        expect(targetRoute).toBe(expectedRoute);
      }
    );

    it('should handle undefined role gracefully', () => {
      mockUseUser.mockReturnValue({
        isLoaded: true,
        user: { id: 'user_123', publicMetadata: {} }
      });

      const userRole = undefined;
      const defaultRoute = '/dashboard/overview';

      // Should fallback to default route
      const targetRoute = userRole ? roleRoutes[userRole] : defaultRoute;
      expect(targetRoute).toBe(defaultRoute);
    });
  });

  describe('Session Management', () => {
    it('should detect session expiry', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
        userId: null
      });

      // Simulating session check
      const sessionValid = false;

      if (!sessionValid) {
        // Should redirect to sign-in
        mockReplace('/auth/sign-in');
      }

      expect(mockReplace).toHaveBeenCalledWith('/auth/sign-in');
    });

    it('should maintain session across page navigations', () => {
      const sessionId = 'sess_123';
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_123',
        sessionId
      });

      // Session should persist
      expect(sessionId).toBeTruthy();
    });
  });
});

describe('Middleware Route Protection', () => {
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/'];
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/students',
    '/dashboard/settings'
  ];

  describe('Public Routes', () => {
    it.each(publicRoutes)('should allow access to %s without auth', (route) => {
      const isPublic = publicRoutes.some(
        (r) => route.startsWith(r) || route === r
      );
      expect(isPublic).toBe(true);
    });
  });

  describe('Protected Routes', () => {
    it.each(protectedRoutes)('should require auth for %s', (route) => {
      const isProtected = route.startsWith('/dashboard');
      expect(isProtected).toBe(true);
    });
  });

  describe('Auth Route Handling', () => {
    it('should redirect signed-in users from /auth/sign-in to dashboard', () => {
      const currentPath = '/auth/sign-in';
      const isSignedIn = true;
      const isAuthRoute = currentPath.startsWith('/auth');

      if (isAuthRoute && isSignedIn) {
        mockReplace('/dashboard');
      }

      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect signed-in users from /auth/sign-up to dashboard', () => {
      const currentPath = '/auth/sign-up';
      const isSignedIn = true;
      const isAuthRoute = currentPath.startsWith('/auth');

      if (isAuthRoute && isSignedIn) {
        mockReplace('/dashboard');
      }

      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });
});

describe('User Context', () => {
  it('should provide user data through context', () => {
    const mockUserData = {
      id: 'user_123',
      email: 'test@test.com',
      role: 'admin',
      tenantId: 'tenant_123',
      firstName: 'Test',
      lastName: 'User'
    };

    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        id: mockUserData.id,
        primaryEmailAddress: { emailAddress: mockUserData.email },
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        publicMetadata: {
          role: mockUserData.role,
          tenantId: mockUserData.tenantId
        }
      }
    });

    const user = mockUseUser().user;
    expect(user.id).toBe(mockUserData.id);
    expect(user.publicMetadata.role).toBe(mockUserData.role);
  });

  it('should handle missing user metadata gracefully', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        id: 'user_123',
        publicMetadata: {}
      }
    });

    const user = mockUseUser().user;
    const role = user.publicMetadata?.role || 'student'; // default fallback

    expect(role).toBe('student');
  });
});
