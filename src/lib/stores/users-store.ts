import { create } from 'zustand';
import apiClient from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<UsersState['pagination']>) => void;

  // API Actions
  fetchUsers: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  createUser: (data: { email: string; name: string; role?: string }) => Promise<void>;
  updateUser: (id: string, data: Partial<{ email: string; name: string; role?: string }>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  setUsers: (users) => set({ users }),

  setCurrentUser: (user) => set({ currentUser: user }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination }
  })),

  fetchUsers: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.getUsers(params);

      set({
        users: response.data || response || [],
        pagination: {
          page: response.page || (params as any).page || 1,
          limit: response.limit || (params as any).limit || 10,
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        isLoading: false,
      });
    }
  },

  fetchUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const user = await apiClient.getUser(id);
      set({ currentUser: user, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLoading: false,
      });
    }
  },

  createUser: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newUser = await apiClient.createUser(data);
      const { users } = get();
      set({
        users: [newUser, ...users],
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create user',
        isLoading: false,
      });
    }
  },

  updateUser: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await apiClient.updateUser(id, data);
      const { users, currentUser } = get();

      set({
        users: users.map(user =>
          user.id === id ? updatedUser : user
        ),
        currentUser: currentUser?.id === id ? updatedUser : currentUser,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update user',
        isLoading: false,
      });
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.deleteUser(id);
      const { users, currentUser } = get();

      set({
        users: users.filter(user => user.id !== id),
        currentUser: currentUser?.id === id ? null : currentUser,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete user',
        isLoading: false,
      });
    }
  },
}));