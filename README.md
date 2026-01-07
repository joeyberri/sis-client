# 🚀 Quick Start Guide - Recent Updates

## What's New?

We've made significant improvements to the platform! Here's what changed:

### ✅ Fixed Issues
1. **Auth Loop Fixed** - No more endless redirect loops on login
2. **UI Cleanup** - Theme selector removed, green theme set as default
3. **Performance Boost** - Pages load significantly faster

### 🎉 New Features
1. **Notification System** - Bell icon in header with real-time notifications
2. **Module System** - Package-based feature access control
3. **Test Suite** - Full testing infrastructure for reliability

---

## Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Run the App
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 3. Run Tests
```bash
npm test                # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

---

## Using New Features

### 📬 Notifications

**Add a notification:**
```tsx
import { useNotifications } from '@/context/notification/notification-context';

function MyComponent() {
  const { addNotification } = useNotifications();
  
  const handleSuccess = () => {
    addNotification({
      type: 'success',
      priority: 'high',
      title: 'Success!',
      message: 'Action completed successfully',
      actionUrl: '/dashboard/students',
      actionLabel: 'View Students'
    });
  };
  
  return <button onClick={handleSuccess}>Do Something</button>;
}
```

**Notification Types:**
- `info` - Blue, informational
- `success` - Green, success messages  
- `warning` - Yellow, warnings
- `error` - Red, errors

**Priority Levels:**
- `low` - Normal priority
- `medium` - Medium priority
- `high` - High priority  
- `urgent` - Plays sound (if enabled)

---

### 🧩 Module System

**Protect a page:**
```tsx
import { ModuleGuard } from '@/components/module-guard';

export default function PaymentsPage() {
  return (
    <ModuleGuard moduleName="payments">
      <div>Payment content here</div>
    </ModuleGuard>
  );
}
```

**Check module access:**
```tsx
import { useModules } from '@/context/modules/module-context';

function MyComponent() {
  const { canAccessModule, isModuleEnabled } = useModules();
  
  if (canAccessModule('analytics')) {
    return <AnalyticsWidget />;
  }
  
  return <p>Analytics not available in your package</p>;
}
```

**Available Packages:**
- **Basic** ($99/mo) - Core features
- **Standard** ($299/mo) - Most features
- **Premium** ($799/mo) - All features
- **Enterprise** (Custom) - Unlimited everything

---

### ⚡ Performance Tools

**Lazy load heavy components:**
```tsx
import { lazyLoad } from '@/lib/lazy-load';

const HeavyChart = lazyLoad(() => import('./HeavyChart'), {
  loading: () => <div>Loading chart...</div>
});

function Dashboard() {
  return (
    <div>
      <HeavyChart data={chartData} />
    </div>
  );
}
```

**Cache API calls:**
```tsx
import { cachedFetch } from '@/lib/api/cache';

async function getStudents() {
  // Cached for 5 minutes
  const students = await cachedFetch('/api/students');
  return students;
}
```

**Debounce search:**
```tsx
import { useDebounce } from '@/hooks/use-performance';

function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  useEffect(() => {
    // Only runs after user stops typing for 300ms
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);
  
  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}
```

---

## Testing Your Code

### Writing Tests

**Component test:**
```tsx
// MyComponent.test.tsx
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Hook test:**
```tsx
import { renderHook } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should return correct value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(expected);
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

Coverage reports are saved to `coverage/` directory.

---

## Package Tiers

### Basic ($99/month)
- ✅ Students & Teachers
- ✅ Classes & Attendance  
- ✅ Basic Grades
- ✅ Announcements
- 📊 Up to 200 students

### Standard ($299/month)
- ✅ All Basic features
- ✅ Parent Portal
- ✅ Assessments & Reports
- ✅ Fee Management
- ✅ Document Storage (50GB)
- 📊 Up to 500 students

### Premium ($799/month)
- ✅ All Standard features
- ✅ Payment Processing
- ✅ Advanced Analytics
- ✅ Library & Transportation
- ✅ Cafeteria Management
- 📊 Up to 2000 students

### Enterprise (Custom)
- ✅ All Premium features
- ✅ Unlimited users
- ✅ Custom modules
- ✅ White-label option
- ✅ Dedicated support

---

## Troubleshooting

### Auth Loop Issue
If you still see redirect loops:
1. Clear browser cookies/cache
2. Sign out completely
3. Close all tabs
4. Sign in again

### Module Not Available
If a module shows as locked:
1. Check your package tier
2. Contact admin to upgrade
3. Verify module dependencies are enabled

### Performance Issues
1. Check browser console for errors
2. Ensure you're using production build
3. Check network tab for slow requests
4. Review PERFORMANCE.md for optimization tips

---

## File Structure

```
client/
├── src/
│   ├── components/
│   │   ├── notification-bell.tsx     # Notification UI
│   │   ├── module-guard.tsx          # Module access control
│   │   └── module-settings.tsx       # Module management UI
│   ├── context/
│   │   ├── notification/             # Notification state
│   │   ├── modules/                  # Module state
│   │   └── user/                     # User state
│   ├── hooks/
│   │   └── use-performance.ts        # Performance hooks
│   ├── lib/
│   │   ├── lazy-load.ts             # Lazy loading utilities
│   │   ├── performance.ts           # Performance monitoring
│   │   └── api/
│   │       └── cache.ts             # API caching
│   ├── types/
│   │   ├── notification.ts          # Notification types
│   │   └── modules.ts               # Module types
│   └── config/
│       └── modules.ts               # Module configuration
├── jest.config.ts                    # Test configuration
├── jest.setup.ts                    # Test setup
└── PERFORMANCE.md                   # Performance guide
```

---

## Next Steps

1. ✅ Test the auth fix
2. ✅ Try the notification system
3. ✅ Review module access controls
4. ✅ Run the test suite
5. ✅ Check performance improvements

---

## Support

**Documentation:**
- [UPDATES.md](../UPDATES.md) - Detailed changelog
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance guide

**Questions?**
- Check existing tests for examples
- Review component documentation
- Ask the team!

---

**Last Updated:** January 5, 2026
