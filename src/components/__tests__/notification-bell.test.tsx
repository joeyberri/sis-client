import { render, screen } from '@testing-library/react';
import { NotificationBell } from '../notification-bell';
import { NotificationProvider } from '@/context/notification/notification-context';

const MockNotificationBell = () => (
  <NotificationProvider>
    <NotificationBell />
  </NotificationProvider>
);

describe('NotificationBell', () => {
  it('should render without errors', () => {
    render(<MockNotificationBell />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not show badge when no unread notifications', () => {
    render(<MockNotificationBell />);
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });
});
