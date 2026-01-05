import { useCallback, useState } from 'react';
import { apiClient } from '@/lib/api/client';

export interface QueryOptions {
  where?: Array<{ field: string; operator: string; value: any }>;
  orderBy?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  offset?: number;
  select?: string[];
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  module: string;
  query: QueryOptions;
  isPublic: boolean;
  shareToken?: string;
}

/**
 * Hook for smart querying and saved views
 */
export function useSmartQuery(resource: string) {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useCallback(
    async (options?: QueryOptions) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.query(resource, options);
        setData(result.data || []);
        setTotal(result.total || 0);
        return result;
      } catch (err: any) {
        setError(err.message || 'Query failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [resource]
  );

  return { data, total, loading, error, query };
}

/**
 * Hook for managing saved views
 */
export function useSavedViews(module: string) {
  const [views, setViews] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listViews = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiClient.listViews(module);
      setViews(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [module]);

  const createView = useCallback(
    async (name: string, query: QueryOptions, description?: string, isPublic?: boolean) => {
      try {
        const view = await apiClient.createView({
          name,
          description,
          module,
          query,
          isPublic
        });
        setViews([...views, view.data]);
        return view.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [module, views]
  );

  const updateView = useCallback(
    async (viewId: string, updates: Partial<SavedView>) => {
      try {
        const view = await apiClient.updateView(viewId, updates);
        setViews(views.map((v) => (v.id === viewId ? view.data : v)));
        return view.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [views]
  );

  const deleteView = useCallback(
    async (viewId: string) => {
      try {
        await apiClient.deleteView(viewId);
        setViews(views.filter((v) => v.id !== viewId));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [views]
  );

  const shareView = useCallback(
    async (viewId: string, makePublic: boolean) => {
      try {
        const view = await apiClient.shareView(viewId, makePublic);
        setViews(views.map((v) => (v.id === viewId ? view.data : v)));
        return view.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [views]
  );

  const cloneView = useCallback(
    async (viewId: string, newName?: string) => {
      try {
        const view = await apiClient.cloneView(viewId, newName);
        setViews([...views, view.data]);
        return view.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [views]
  );

  return {
    views,
    loading,
    error,
    listViews,
    createView,
    updateView,
    deleteView,
    shareView,
    cloneView
  };
}

/**
 * Hook for bulk operations
 */
export function useBulkOperation(resource: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkCreate = useCallback(
    async (items: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.bulkUpsert(resource, items);
        return result;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [resource]
  );

  return { loading, error, bulkCreate };
}
