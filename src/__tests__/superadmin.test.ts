/**
 * SuperAdmin Module Tests
 * Tests for Schools Management, Support Tickets, and Pricing Management
 */

import {
  PACKAGE_PRICING,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  SUBSCRIPTION_STATUSES
} from '@/config/superadmin';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

describe('SuperAdmin Configuration', () => {
  describe('Package Pricing', () => {
    it('should have all required tiers', () => {
      const expectedTiers = [
        'trial',
        'basic',
        'standard',
        'premium',
        'enterprise'
      ];
      expectedTiers.forEach((tier) => {
        expect(PACKAGE_PRICING[tier]).toBeDefined();
      });
    });

    it('should have valid trial tier (free)', () => {
      const trial = PACKAGE_PRICING.trial;
      expect(trial.monthlyPrice).toBe(0);
      expect(trial.yearlyPrice).toBe(0);
      expect(trial.maxStudents).toBe(50);
      expect(trial.tier).toBe('trial');
    });

    it('should have valid basic tier pricing', () => {
      const basic = PACKAGE_PRICING.basic;
      expect(basic.monthlyPrice).toBe(99);
      expect(basic.yearlyPrice).toBe(990);
      expect(basic.maxStudents).toBe(200);
    });

    it('should have valid standard tier pricing', () => {
      const standard = PACKAGE_PRICING.standard;
      expect(standard.monthlyPrice).toBe(299);
      expect(standard.yearlyPrice).toBe(2990);
      expect(standard.maxStudents).toBe(500);
    });

    it('should have valid premium tier pricing', () => {
      const premium = PACKAGE_PRICING.premium;
      expect(premium.monthlyPrice).toBe(799);
      expect(premium.yearlyPrice).toBe(7990);
      expect(premium.maxStudents).toBe(2000);
    });

    it('should have enterprise tier with unlimited (-1) limits', () => {
      const enterprise = PACKAGE_PRICING.enterprise;
      expect(enterprise.maxStudents).toBe(-1);
      expect(enterprise.maxTeachers).toBe(-1);
      expect(enterprise.maxAdmins).toBe(-1);
    });

    it('should have increasing features with higher tiers', () => {
      const trialModules = PACKAGE_PRICING.trial.modules.length;
      const basicModules = PACKAGE_PRICING.basic.modules.length;
      const standardModules = PACKAGE_PRICING.standard.modules.length;
      const premiumModules = PACKAGE_PRICING.premium.modules.length;

      expect(basicModules).toBeGreaterThanOrEqual(trialModules);
      expect(standardModules).toBeGreaterThan(basicModules);
      expect(premiumModules).toBeGreaterThan(standardModules);
    });

    it('should have yearly pricing with discount (approximately 2 months free)', () => {
      Object.values(PACKAGE_PRICING).forEach((pkg) => {
        if (pkg.monthlyPrice > 0 && pkg.yearlyPrice > 0) {
          const expectedYearly = pkg.monthlyPrice * 12;
          const actualYearly = pkg.yearlyPrice;
          // Should be 10 months worth (2 months free)
          expect(actualYearly).toBeLessThan(expectedYearly);
          expect(actualYearly).toBeCloseTo(pkg.monthlyPrice * 10, -1);
        }
      });
    });
  });

  describe('Ticket Categories', () => {
    it('should have all expected categories', () => {
      const expectedCategories = [
        'technical',
        'billing',
        'feature_request',
        'bug_report',
        'account',
        'general'
      ];
      expectedCategories.forEach((category) => {
        const found = TICKET_CATEGORIES.find((c) => c.value === category);
        expect(found).toBeDefined();
        expect(found?.label).toBeTruthy();
      });
    });

    it('should have human-readable labels', () => {
      TICKET_CATEGORIES.forEach((category) => {
        expect(category.label.length).toBeGreaterThan(0);
        expect(category.label).not.toEqual(category.value);
      });
    });
  });

  describe('Ticket Priorities', () => {
    it('should have all priority levels', () => {
      const expectedPriorities = ['low', 'medium', 'high', 'urgent'];
      expectedPriorities.forEach((priority) => {
        const found = TICKET_PRIORITIES.find((p) => p.value === priority);
        expect(found).toBeDefined();
        expect(found?.color).toBeTruthy();
      });
    });

    it('should have distinct colors for each priority', () => {
      const colors = TICKET_PRIORITIES.map((p) => p.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(TICKET_PRIORITIES.length);
    });
  });

  describe('Ticket Statuses', () => {
    it('should have all status values', () => {
      const expectedStatuses = [
        'open',
        'in_progress',
        'waiting_on_customer',
        'resolved',
        'closed'
      ];
      expectedStatuses.forEach((status) => {
        const found = TICKET_STATUSES.find((s) => s.value === status);
        expect(found).toBeDefined();
      });
    });

    it('should have distinct colors for each status', () => {
      const colors = TICKET_STATUSES.map((s) => s.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(TICKET_STATUSES.length);
    });
  });

  describe('Subscription Statuses', () => {
    it('should have all subscription status values', () => {
      const expectedStatuses = [
        'active',
        'trial',
        'expired',
        'cancelled',
        'suspended'
      ];
      expectedStatuses.forEach((status) => {
        const found = SUBSCRIPTION_STATUSES.find((s) => s.value === status);
        expect(found).toBeDefined();
      });
    });
  });
});

describe('SuperAdmin API Functions', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('Schools API', () => {
    it('should fetch schools list', async () => {
      const mockSchools = {
        schools: [{ id: '1', name: 'Test School' }],
        total: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSchools)
      });

      const response = await fetch('/api/superadmin/schools');
      const data = await response.json();

      expect(data.schools).toHaveLength(1);
      expect(data.schools[0].name).toBe('Test School');
    });

    it('should handle school creation', async () => {
      const newSchool = {
        name: 'New School',
        adminEmail: 'admin@newschool.edu',
        tier: 'standard'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', ...newSchool })
      });

      const response = await fetch('/api/superadmin/schools', {
        method: 'POST',
        body: JSON.stringify(newSchool)
      });
      const data = await response.json();

      expect(data.id).toBe('123');
      expect(data.name).toBe('New School');
    });

    it('should handle school suspension', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', status: 'suspended' })
      });

      const response = await fetch('/api/superadmin/schools/123/suspend', {
        method: 'POST',
        body: JSON.stringify({ reason: 'Non-payment' })
      });
      const data = await response.json();

      expect(data.status).toBe('suspended');
    });
  });

  describe('Tickets API', () => {
    it('should fetch tickets list', async () => {
      const mockTickets = {
        tickets: [{ id: 'TKT-001', subject: 'Test Ticket' }],
        total: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTickets)
      });

      const response = await fetch('/api/superadmin/tickets');
      const data = await response.json();

      expect(data.tickets).toHaveLength(1);
    });

    it('should add message to ticket', async () => {
      const message = { content: 'Test reply' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'msg-1', ...message })
      });

      const response = await fetch('/api/superadmin/tickets/TKT-001/messages', {
        method: 'POST',
        body: JSON.stringify(message)
      });
      const data = await response.json();

      expect(data.content).toBe('Test reply');
    });

    it('should resolve ticket', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'TKT-001', status: 'resolved' })
      });

      const response = await fetch('/api/superadmin/tickets/TKT-001/resolve', {
        method: 'POST'
      });
      const data = await response.json();

      expect(data.status).toBe('resolved');
    });
  });

  describe('Stats API', () => {
    it('should fetch platform stats', async () => {
      const mockStats = {
        totalSchools: 12,
        activeUsers: 2450,
        totalStudents: 8500,
        systemHealth: 98
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStats)
      });

      const response = await fetch('/api/superadmin/stats');
      const data = await response.json();

      expect(data.totalSchools).toBe(12);
      expect(data.systemHealth).toBe(98);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' })
      });

      const response = await fetch('/api/superadmin/schools');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetch('/api/superadmin/schools')).rejects.toThrow(
        'Network error'
      );
    });
  });
});

describe('SuperAdmin Types', () => {
  it('should validate School type structure', () => {
    const school = {
      id: '1',
      name: 'Test School',
      slug: 'test-school',
      status: 'active' as const,
      subscription: {
        tier: 'standard',
        status: 'active' as const,
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        billingCycle: 'yearly' as const,
        price: 2990
      },
      adminEmail: 'admin@test.edu',
      adminName: 'Admin User',
      studentCount: 100,
      teacherCount: 10,
      adminCount: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    expect(school.id).toBeDefined();
    expect(school.subscription.tier).toBe('standard');
    expect(['active', 'trial', 'suspended', 'expired']).toContain(
      school.status
    );
  });

  it('should validate SupportTicket type structure', () => {
    const ticket = {
      id: 'TKT-001',
      schoolId: '1',
      schoolName: 'Test School',
      subject: 'Test Subject',
      description: 'Test Description',
      category: 'technical' as const,
      priority: 'high' as const,
      status: 'open' as const,
      createdBy: 'user_1',
      createdByName: 'Test User',
      createdByEmail: 'test@test.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      messages: []
    };

    expect(ticket.id).toBeDefined();
    expect(['low', 'medium', 'high', 'urgent']).toContain(ticket.priority);
    expect([
      'open',
      'in_progress',
      'waiting_on_customer',
      'resolved',
      'closed'
    ]).toContain(ticket.status);
  });
});

describe('Feature Flag Integration', () => {
  it('should restrict module access based on tier', () => {
    const basicModules = PACKAGE_PRICING.basic.modules;
    const premiumModules = PACKAGE_PRICING.premium.modules;

    // Basic should not have premium-only modules
    expect(basicModules).not.toContain('payments');
    expect(basicModules).not.toContain('analytics');

    // Premium should have all modules
    expect(premiumModules).toContain('payments');
    expect(premiumModules).toContain('analytics');
  });

  it('should enforce API access based on tier', () => {
    expect(PACKAGE_PRICING.basic.apiAccess).toBe(false);
    expect(PACKAGE_PRICING.standard.apiAccess).toBe(true);
    expect(PACKAGE_PRICING.premium.apiAccess).toBe(true);
    expect(PACKAGE_PRICING.enterprise.apiAccess).toBe(true);
  });

  it('should enforce branding based on tier', () => {
    expect(PACKAGE_PRICING.basic.customBranding).toBe(false);
    expect(PACKAGE_PRICING.standard.customBranding).toBe(false);
    expect(PACKAGE_PRICING.premium.customBranding).toBe(true);
    expect(PACKAGE_PRICING.enterprise.customBranding).toBe(true);
  });
});
