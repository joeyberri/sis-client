import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { useIsMobile } from '../use-mobile';

const MOBILE_BREAKPOINT = 768;

describe('useIsMobile', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let originalInnerWidth: number;

  beforeEach(() => {
    // Store original values
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query.includes(`${MOBILE_BREAKPOINT - 1}`)
          ? window.innerWidth < MOBILE_BREAKPOINT
          : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth
    });
  });

  it('returns false for desktop width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024 // Desktop width
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375 // Mobile width
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false for tablet width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 768 // Exactly breakpoint
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false); // Should be false since it's >= 768
  });

  it('updates when window is resized', () => {
    // Start with desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Mock window resize to mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375
    });

    // Trigger the media query change
    const mockMatchMedia = window.matchMedia as jest.MockedFunction<
      typeof window.matchMedia
    >;
    const mediaQueryList = mockMatchMedia.mock.results[0].value;

    act(() => {
      mediaQueryList.addEventListener.mock.calls[0][1](); // Call the change handler
    });

    expect(result.current).toBe(true);
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());

    const mockMatchMedia = window.matchMedia as jest.MockedFunction<
      typeof window.matchMedia
    >;
    const mediaQueryList = mockMatchMedia.mock.results[0].value;

    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('handles edge case at breakpoint boundary', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 767 // Just under breakpoint
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
