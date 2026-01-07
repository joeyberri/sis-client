import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Extend Window interface to include Clerk
declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: (options?: { template?: string }) => Promise<string>;
      };
    };
  }
}

export class BaseApiClient {
  protected client: AxiosInstance;
  public currentToken: string | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL:
        baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Try to get Clerk token automatically if not already set
        if (!this.currentToken && typeof window !== 'undefined') {
          try {
            // Check if Clerk is available in the browser
            if (window.Clerk) {
              try {
                // Try to get token without template first
                const token = await window.Clerk.session?.getToken();
                if (token) {
                  this.currentToken = token;
                } else {
                  // If no token without template, try with 'nextjs' template if it exists
                  try {
                    const nextjsToken = await window.Clerk.session?.getToken({
                      template: 'nextjs'
                    });
                    if (nextjsToken) {
                      this.currentToken = nextjsToken;
                    }
                  } catch (templateError) {
                    // If 'nextjs' template doesn't exist, fall back to default token
                    console.warn(
                      '[apiClient] No JWT template exists with name: nextjs, using default token'
                    );
                  }
                }
              } catch (e) {
                console.warn('[apiClient] Could not get Clerk token:', e);
              }
            }
          } catch (e) {
            console.warn('[apiClient] Could not get Clerk token:', e);
          }
        }

        // Use Clerk token if available
        if (this.currentToken) {
          config.headers.Authorization = `Bearer ${this.currentToken}`;
        }

        // Dev: allow a local debug flag to prevent automatic redirect on 401 and to help debugging
        try {
          const noRedirect =
            typeof window !== 'undefined' &&
            window.localStorage?.getItem('DEV_NO_REDIRECT') === '1';
          if (noRedirect) {
            config.headers['X-DEV-NO-REDIRECT'] = '1';
          }
        } catch (e) {
          // ignore in non-browser environments
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        try {
          if (error.response?.status === 401) {
            // If developer debugging flag is set, skip redirect so dev can inspect the response
            const noRedirect =
              typeof window !== 'undefined' &&
              window.localStorage?.getItem('DEV_NO_REDIRECT') === '1';
            const isAuthPage =
              typeof window !== 'undefined' &&
              window.location?.pathname?.startsWith('/auth');
            const isDashboardPage =
              typeof window !== 'undefined' &&
              window.location?.pathname?.startsWith('/dashboard');

            // Check if we're already in a redirect loop by checking URL parameters
            const urlParams =
              typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search)
                : null;
            const fromRedirect = urlParams?.get('fromRedirect');

            if (!noRedirect && !isAuthPage && !fromRedirect) {
              // Handle unauthorized - redirect to sign in (but not if already on auth page)
              // If we are on dashboard, a 401 might mean the backend is out of sync with Clerk.
              // Instead of a hard redirect which can cause loops, we'll log it and let the UI handle it
              // unless it's a critical failure.
              if (isDashboardPage) {
                console.error(
                  '[apiClient] 401 Unauthorized on dashboard. Backend might be out of sync with Clerk.'
                );
                // We don't redirect here to avoid the infinite loop with middleware
              } else {
                window.location.href = '/auth/sign-in';
              }
            } else {
              // eslint-disable-next-line no-console
              console.warn(
                '[apiClient] 401 received but not redirecting (isAuthPage=' +
                  isAuthPage +
                  ', DEV_NO_REDIRECT=' +
                  noRedirect +
                  ', fromRedirect=' +
                  fromRedirect +
                  ')'
              );
            }
          }
        } catch (e) {
          // ignore errors reading localStorage
        }
        return Promise.reject(error);
      }
    );
  }

  // Allow external code to set the auth token (Clerk token) explicitly
  setAuthToken(token: string | null) {
    this.currentToken = token;
    // Development helper: optionally log (masked) token for local debugging when explicitly enabled
    try {
      if (process.env.NODE_ENV !== 'production') {
        const show =
          typeof window !== 'undefined' &&
          window.localStorage?.getItem('DEV_SHOW_TOKEN') === '1';
        if (show) {
          const masked = token ? `***${token.slice(-6)}` : null;
          // eslint-disable-next-line no-console
          console.log('[apiClient] setAuthToken (masked)=', masked);
        }
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }

  // Generic HTTP methods
  protected async get<T = any>(path: string, params?: any): Promise<T> {
    const response = await this.client.get(path, { params });
    return response.data;
  }

  protected async post<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.client.post(path, data);
    return response.data;
  }

  protected async put<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.client.put(path, data);
    return response.data;
  }

  protected async patch<T = any>(path: string, data?: any): Promise<T> {
    const response = await this.client.patch(path, data);
    return response.data;
  }

  protected async delete<T = any>(path: string): Promise<T> {
    const response = await this.client.delete(path);
    return response.data;
  }
}
