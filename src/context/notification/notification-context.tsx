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
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
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

  // Load notifications and preferences from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('sis_notifications');
    const storedPreferences = localStorage.getItem(
      'sis_notification_preferences'
    );

    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(
          parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }))
        );
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    }

    if (storedPreferences) {
      try {
        setPreferences(JSON.parse(storedPreferences));
      } catch (e) {
        console.error('Failed to parse preferences:', e);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('sis_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem(
      'sis_notification_preferences',
      JSON.stringify(preferences)
    );
  }, [preferences]);

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

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updatePreferences
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
