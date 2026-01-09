'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode
} from 'react';
import { Notification, NotificationPreferences } from '@/types/notification';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isLoading: boolean;
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  inApp: true,
  sound: false,
  categories: {
    attendance: true,
    grades: true,
    assignments: true,
    announcements: true,
    fees: true,
    events: true
  }
};

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('sis_notifications');
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('sis_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/notifications?limit=50');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const apiNotifications: Notification[] = data.data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || 'info',
            priority: n.priority || 'normal',
            read: n.isRead || false,
            timestamp: new Date(n.createdAt),
            actionUrl: n.entityType
              ? `/${n.entityType}/${n.entityId}`
              : undefined,
            actionLabel: n.entityType ? 'View' : undefined
          }));
          setNotifications(apiNotifications);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    // Only fetch if no stored notifications
    if (notifications.length === 0) {
      fetchNotifications();
    }
  }, [fetchNotifications, notifications.length]);

  // Refresh notifications function
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 100)); // Keep only 100 most recent

      // Show toast if in-app notifications are enabled
      if (preferences.inApp) {
        const toastOptions = {
          description: notification.message,
          action: notification.actionUrl
            ? {
                label: notification.actionLabel || 'View',
                onClick: () => (window.location.href = notification.actionUrl!)
              }
            : undefined
        };

        switch (notification.type) {
          case 'success':
            toast.success(notification.title, toastOptions);
            break;
          case 'error':
            toast.error(notification.title, toastOptions);
            break;
          case 'warning':
            toast.warning(notification.title, toastOptions);
            break;
          default:
            toast.info(notification.title, toastOptions);
        }
      }

      // Play sound if enabled
      if (preferences.sound && notification.priority === 'urgent') {
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(console.error);
        } catch (e) {
          console.error('Failed to play notification sound:', e);
        }
      }
    },
    [preferences]
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Fallback to local state update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Fallback to local state update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('sis_notifications');
  }, []);

  const updatePreferences = useCallback(
    (newPreferences: Partial<NotificationPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updatePreferences,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}
