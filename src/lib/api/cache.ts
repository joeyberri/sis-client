// API Response Cache
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cached API fetch with automatic cache invalidation
 */
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  cacheDuration: number = CACHE_DURATION
): Promise<T> {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const cached = apiCache.get(cacheKey);

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return cached.data;
  }

  // Fetch fresh data
  const response = await fetch(url, options);
  const data = await response.json();

  // Store in cache
  apiCache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Clear all API cache
 */
export function clearApiCache() {
  apiCache.clear();
}

/**
 * Clear specific cache entry
 */
export function clearCacheEntry(url: string, options?: RequestInit) {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  apiCache.delete(cacheKey);
}

/**
 * Prefetch data for faster navigation
 */
export function prefetchData(url: string, options?: RequestInit) {
  cachedFetch(url, options).catch(console.error);
}

/**
 * Batch multiple API calls
 */
export async function batchFetch<T>(
  requests: Array<{ url: string; options?: RequestInit }>
): Promise<T[]> {
  return Promise.all(
    requests.map((req) => cachedFetch<T>(req.url, req.options))
  );
}

/**
 * Request deduplication - prevent multiple identical requests
 */
const pendingRequests = new Map<string, Promise<any>>();

export async function deduplicatedFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = `${url}:${JSON.stringify(options)}`;

  // Return existing pending request if available
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  // Create new request
  const requestPromise = cachedFetch<T>(url, options, CACHE_DURATION).finally(
    () => {
      pendingRequests.delete(cacheKey);
    }
  );

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}
