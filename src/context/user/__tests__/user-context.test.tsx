import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock Clerk hooks BEFORE importing user-context
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(() => ({
    user: null,
    isLoaded: true
  })),
  useAuth: jest.fn(() => ({
    getToken: jest.fn().mockResolvedValue('mock-token'),
    isLoaded: true,
    isSignedIn: false
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  )
}));

// Mock API client
jest.mock('@/lib/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: { user: null } }),
    setAuthToken: jest.fn()
  }
}));

// Import after mocks
import { useUser, UserProvider } from '../user-context';

// Create a mock ClerkProvider for tests
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

describe('UserContext', () => {
  it('should provide user context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockClerkProvider>
        <UserProvider>{children}</UserProvider>
      </MockClerkProvider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.role).toBeNull();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useUser());
    }).toThrow('useUser must be used within a UserProvider');

    consoleSpy.mockRestore();
  });
});
