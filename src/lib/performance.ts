/**
 * Performance monitoring utilities
 */

// Track component render times
export function measureRender(componentName: string, callback: () => void) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(
      `[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`
    );
  } else {
    callback();
  }
}

// Track API call performance
export async function measureApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await apiCall();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[API Performance] ${name} completed in ${(end - start).toFixed(2)}ms`
      );
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      reportWebVitals({
        name,
        value: end - start,
        rating:
          end - start < 1000
            ? 'good'
            : end - start < 2500
              ? 'needs-improvement'
              : 'poor'
      });
    }

    return result;
  } catch (error) {
    const end = performance.now();
    console.error(
      `[API Performance] ${name} failed after ${(end - start).toFixed(2)}ms`,
      error
    );
    throw error;
  }
}

// Web Vitals reporting
interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function reportWebVitals(metric: Metric) {
  // Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  }
}

// Image loading performance
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Lazy load images below the fold
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img: any) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Memory usage monitoring
export function logMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) return;

  const memory = (performance as any).memory;
  console.log('[Memory Usage]', {
    used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
    total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
    limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
  });
}

// Bundle size analysis helper
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((acc, script) => {
    const src = (script as HTMLScriptElement).src;
    // This is a rough estimate - actual size would need network inspection
    return acc + src.length;
  }, 0);

  console.log('[Bundle Analysis]', {
    scriptCount: scripts.length,
    estimatedSize: `${(totalSize / 1024).toFixed(2)} KB`
  });
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
