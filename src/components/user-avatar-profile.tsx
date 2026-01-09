import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    imageUrl?: string;
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    emailAddresses: Array<{ emailAddress: string }>;
  } | null;
}

// Generate initials from name
function getInitials(
  fullName?: string | null,
  firstName?: string | null,
  lastName?: string | null
): string {
  // If we have firstName and lastName, use those
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  // If we have fullName, parse it
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
  }

  // Fallback
  return 'U';
}

// Generate background color based on name for visual distinction
function getAvatarColor(name?: string | null): string {
  if (!name) return 'bg-muted';

  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500'
  ];

  // Simple hash based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  const initials = getInitials(user?.fullName, user?.firstName, user?.lastName);
  const avatarColor = getAvatarColor(user?.fullName || user?.firstName);

  // Ensure consistent rendering between server and client
  if (!user) {
    return (
      <div className='flex items-center gap-2'>
        <div
          className={cn(
            'bg-muted flex h-9 w-9 items-center justify-center rounded-lg',
            className
          )}
        >
          <span className='text-muted-foreground text-xs font-medium'>U</span>
        </div>
        {showInfo && (
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>Loading...</span>
            <span className='truncate text-xs'>Loading...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2' suppressHydrationWarning>
      <Avatar className={className}>
        <AvatarImage src={user?.imageUrl || ''} alt={user?.fullName || ''} />
        <AvatarFallback
          className={cn('rounded-lg font-medium text-white', avatarColor)}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{user?.fullName || ''}</span>
          <span className='truncate text-xs'>
            {user?.emailAddresses?.[0]?.emailAddress ||
              (user as any)?.email ||
              ''}
          </span>
        </div>
      )}
    </div>
  );
}
