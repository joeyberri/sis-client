import { create } from 'zustand';
import apiClient from '@/lib/api/client';

interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SubjectsState {
  subjects: Subject[];
  currentSubject: Subject | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setSubjects: (subjects: Subject[]) => void;
  setCurrentSubject: (subject: Subject | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<SubjectsState['pagination']>) => void;

  // API Actions
  fetchSubjects: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchSubject: (id: string) => Promise<void>;
  createSubject: (data: { name: string; code: string; description?: string }) => Promise<void>;
  updateSubject: (id: string, data: Partial<{ name: string; code: string; description?: string }>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
}

export const useSubjectsStore = create<SubjectsState>((set, get) => ({
  subjects: [],
  currentSubject: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  setSubjects: (subjects) => set({ subjects }),

  setCurrentSubject: (subject) => set({ currentSubject: subject }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination }
  })),

  fetchSubjects: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.getSubjects(params);

      set({
        subjects: response.data || [],
        pagination: {
          page: (response as any).page || params.page || 1,
          limit: (response as any).limit || params.limit || 10,
          total: response.total || 0,
          totalPages: (response as any).totalPages || 0,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch subjects',
        isLoading: false,
      });
    }
  },

  fetchSubject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const subject = await apiClient.getSubject(id);
      set({ currentSubject: subject, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch subject:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch subject',
        isLoading: false,
      });
    }
  },

  createSubject: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newSubject = await apiClient.createSubject(data);
      const { subjects } = get();
      set({
        subjects: [newSubject, ...subjects],
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to create subject:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create subject',
        isLoading: false,
      });
    }
  },

  updateSubject: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSubject = await apiClient.updateSubject(id, data);
      const { subjects, currentSubject } = get();

      set({
        subjects: subjects.map(subject =>
          subject.id === id ? updatedSubject : subject
        ),
        currentSubject: currentSubject?.id === id ? updatedSubject : currentSubject,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to update subject:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update subject',
        isLoading: false,
      });
    }
  },

  deleteSubject: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.deleteSubject(id);
      const { subjects, currentSubject } = get();

      set({
        subjects: subjects.filter(subject => subject.id !== id),
        currentSubject: currentSubject?.id === id ? null : currentSubject,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to delete subject:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to delete subject',
        isLoading: false,
      });
    }
  },
}));