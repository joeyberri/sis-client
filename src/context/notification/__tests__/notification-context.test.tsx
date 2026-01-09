import { render, screen, waitFor } from '@testing-library/react';
import {
  NotificationProvider,
  useNotifications
} from '../notification-context';
import { act } from 'react';

// Mock fetch
global.fetch = jest.fn();

// Test component to access context
function TestComponent() {
  const { notifications, unreadCount, addNotification, markAsRead } =
    useNotifications();

  return (
    <div>
      <div data-testid='unread-count'>{unreadCount}</div>
      <div data-testid='notification-count'>{notifications.length}</div>
      <button
        onClick={() =>
          addNotification({
            type: 'info',
            priority: 'medium',
            title: 'Test Notification',
            message: 'This is a test'
          })
        }
      >
        Add Notification
      </button>
      <button
        onClick={() => notifications[0] && markAsRead(notifications[0].id)}
      >
        Mark First as Read
      </button>
      {notifications.map((n) => (
        <div key={n.id} data-testid={`notification-${n.id}`}>
          {n.title}
        </div>
      ))}
    </div>
  );
}

describe('NotificationContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/read')) {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error('Network error'));
    });
  });

  it('should provide notification context', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
  });

  it('should add notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addButton = screen.getByText('Add Notification');

    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
  });

  it('should mark notifications as read', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addButton = screen.getByText('Add Notification');
    const markReadButton = screen.getByText('Mark First as Read');

    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('unread-count')).toHaveTextContent('1');

    act(() => {
      markReadButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
  });

  it('should persist notifications to localStorage', async () => {
    const { unmount } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    const addButton = screen.getByText('Add Notification');

    act(() => {
      addButton.click();
    });

    // Wait for localStorage to be updated
    await waitFor(() => {
      const stored = localStorage.getItem('sis_notifications');
      expect(stored).toBeTruthy();
    });

    // Unmount and check localStorage still has it
    unmount();

    const stored = localStorage.getItem('sis_notifications');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Test Notification');
  });
});
