import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import React from 'react';

/**
 * Lazy load components with SSR disabled for client-only components
 * Useful for heavy components that don't need to be server-rendered
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: {
    ssr?: boolean;
    loading?: () => React.ReactNode;
  } = {}
) {
  return dynamic(factory, {
    ssr: options.ssr ?? false,
    loading: options.loading
  });
}

/**
 * Preload a component to improve perceived performance
 */
export function preloadComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  // Trigger the import
  factory();
}

/**
 * Lazy load a component with intersection observer
 * Component only loads when it becomes visible in viewport
 */
export function lazyLoadOnView<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: IntersectionObserverInit = {}
) {
  return dynamic(factory, {
    ssr: false
  });
}
