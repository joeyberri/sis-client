# Performance Optimization Guide

## Overview
This document outlines the performance optimizations implemented in the SIS application.

## Optimizations Implemented

### 1. Code Splitting & Lazy Loading
- **Dynamic Imports**: Use `lazyLoad()` helper for heavy components
- **Route-based Splitting**: Each page is automatically split into separate chunks
- **Component Lazy Loading**: Use `lazyLoadOnView()` for below-the-fold components

Example:
```tsx
import { lazyLoad } from '@/lib/lazy-load';

const HeavyChart = lazyLoad(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
});
```

### 2. API Caching
- **Cached Fetch**: Use `cachedFetch()` to cache API responses for 5 minutes
- **Request Deduplication**: Prevents multiple identical requests with `deduplicatedFetch()`
- **Prefetching**: Use `prefetchData()` to preload data for faster navigation

Example:
```tsx
import { cachedFetch, prefetchData } from '@/lib/api/cache';

// Cached API call
const data = await cachedFetch('/api/students');

// Prefetch on hover
<Link onMouseEnter={() => prefetchData('/api/teachers')}>
  Teachers
</Link>
```

### 3. Image Optimization
- **Next.js Image Component**: Automatic optimization with WebP/AVIF
- **Lazy Loading**: Images below fold are loaded on scroll
- **Responsive Images**: Multiple sizes generated automatically

Example:
```tsx
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  width={100}
  height={100}
  alt="User"
  loading="lazy"
/>
```

### 4. Bundle Optimization
- **Package Imports**: Optimized imports for `@radix-ui`, `lucide-react`, `recharts`
- **Code Splitting**: Vendor, UI, and Clerk libraries split into separate chunks
- **Tree Shaking**: Unused code automatically removed in production

### 5. Performance Hooks
- **useDebounce**: Debounce search inputs and frequently changing values
- **useThrottle**: Throttle scroll and resize handlers
- **useIntersectionObserver**: Lazy load content when visible in viewport

Example:
```tsx
import { useDebounce } from '@/hooks/use-performance';

const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

### 6. Next.js Configuration
- **Strict Mode**: Enabled for better performance debugging
- **Console Removal**: Production builds remove console.log (keeps error/warn)
- **Source Maps**: Disabled in production for faster builds
- **On-Demand Entries**: Reduces memory usage during development

### 7. Render Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive computations and callbacks
- **Key Props**: Proper keys for list items to optimize reconciliation

Example:
```tsx
import { memo, useMemo } from 'react';

const StudentList = memo(({ students }) => {
  const sortedStudents = useMemo(
    () => students.sort((a, b) => a.name.localeCompare(b.name)),
    [students]
  );

  return sortedStudents.map(student => <StudentCard key={student.id} {...student} />);
});
```

## Performance Monitoring

### Development
```bash
# Run with performance monitoring
npm run dev

# Check bundle size
npm run build
```

### Production
- Web Vitals are automatically tracked
- Performance metrics sent to analytics (if configured)
- Use `measureApiCall()` to track API performance

## Best Practices

1. **Avoid Large Client Components**: Keep client components small and focused
2. **Use Server Components**: Default to Server Components, only use Client Components when needed
3. **Minimize Third-party Scripts**: Only load essential external scripts
4. **Optimize Fonts**: Use `next/font` for automatic font optimization
5. **Database Query Optimization**: Use indexes, pagination, and caching
6. **CDN for Static Assets**: Serve static files from CDN when possible

## Performance Checklist

- [ ] Images use Next.js Image component
- [ ] Heavy components are lazy loaded
- [ ] API responses are cached when appropriate
- [ ] Search inputs are debounced
- [ ] Lists use proper key props
- [ ] Expensive calculations use useMemo
- [ ] Event handlers use useCallback
- [ ] Components use React.memo when appropriate
- [ ] Bundle size is monitored
- [ ] Lighthouse score > 90

## Measuring Performance

```tsx
import { measureRender, measureApiCall } from '@/lib/performance';

// Measure component render
measureRender('StudentList', () => {
  // Component render logic
});

// Measure API call
const students = await measureApiCall('fetchStudents', () =>
  fetch('/api/students').then(r => r.json())
);
```

## Target Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
