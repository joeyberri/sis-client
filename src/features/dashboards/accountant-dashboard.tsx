'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import {
  DashboardHero,
  MetricCard,
  SectionCard,
  ListItem,
  QuickActionGrid,
  DashboardLoading
} from '@/components/dashboard/dashboard-primitives';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

interface AccountantDashboardStats {
  totalFees: number;
  collectedFees: number;
  pendingPayments: number;
  totalInvoices: number;
  pendingInvoices: number;
  collectionRate: number;
}

const MOCK_STATS: AccountantDashboardStats = {
  totalFees: 2500000,
  collectedFees: 1875000,
  pendingPayments: 625000,
  totalInvoices: 1250,
  pendingInvoices: 156,
  collectionRate: 75
};

const MOCK_OVERDUE = [
  {
    id: '1',
    student: 'John Smith',
    amount: 50000,
    days: 15,
    invoiceId: 'INV-2024-001',
    grade: '10-A'
  },
  {
    id: '2',
    student: 'Emily Davis',
    amount: 35000,
    days: 8,
    invoiceId: 'INV-2024-015',
    grade: '9-B'
  },
  {
    id: '3',
    student: 'Michael Brown',
    amount: 75000,
    days: 25,
    invoiceId: 'INV-2024-023',
    grade: '11-A'
  },
  {
    id: '4',
    student: 'Sarah Wilson',
    amount: 28000,
    days: 5,
    invoiceId: 'INV-2024-042',
    grade: '8-C'
  }
];

const MOCK_RECENT_PAYMENTS = [
  {
    id: '1',
    student: 'Alex Martinez',
    amount: 45000,
    method: 'Bank Transfer',
    time: '2 hours ago'
  },
  {
    id: '2',
    student: 'Jessica Lee',
    amount: 32000,
    method: 'Online Payment',
    time: '5 hours ago'
  },
  {
    id: '3',
    student: 'David Kim',
    amount: 28000,
    method: 'Cash',
    time: '1 day ago'
  }
];

const QUICK_ACTIONS = [
  {
    icon: 'solar:document-add-duotone',
    label: 'Create Invoice',
    href: '/dashboard/invoices/create'
  },
  {
    icon: 'solar:wallet-duotone',
    label: 'Record Payment',
    href: '/dashboard/payments/record'
  },
  {
    icon: 'solar:chart-2-duotone',
    label: 'View Reports',
    href: '/dashboard/reports'
  },
  {
    icon: 'solar:printer-minimalistic-duotone',
    label: 'Print Statement',
    href: '/dashboard/statements'
  }
];

export default function AccountantDashboard() {
  const [stats, setStats] = useState<AccountantDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/accountant-dashboard');
        if (res?.data) {
          setStats(res.data);
        } else {
          setStats(MOCK_STATS);
        }
      } catch (err) {
        console.error('Failed to fetch accountant dashboard:', err);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <DashboardLoading
          icon='solar:wallet-bold-duotone'
          title='Loading financial dashboard'
          description='Gathering fee collection data...'
        />
      </PageContainer>
    );
  }

  const data = stats || MOCK_STATS;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <PageContainer scrollable>
      <div className='flex flex-col gap-8 pb-8'>
        {/* Hero Section */}
        <DashboardHero
          badge={{ icon: 'solar:wallet-linear', text: 'Finance Portal' }}
          title='Financial Management Center'
          subtitle='Track fee collection, manage invoices, and monitor payment status across all students.'
          actions={[
            {
              label: 'Create Invoice',
              href: '/dashboard/invoices/create',
              icon: 'solar:document-add-duotone'
            },
            {
              label: 'Record Payment',
              href: '/dashboard/payments/record',
              icon: 'solar:wallet-duotone',
              variant: 'outline'
            }
          ]}
          backgroundIcon='solar:wallet-bold-duotone'
        />

        {/* Quick Stats Row */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <MetricCard
            icon='solar:banknote-2-duotone'
            iconColor='text-blue-600'
            iconBgColor='bg-blue-100'
            value={formatCurrency(data.totalFees)}
            label='Total Expected'
          />
          <MetricCard
            icon='solar:check-circle-duotone'
            iconColor='text-emerald-600'
            iconBgColor='bg-emerald-100'
            value={formatCurrency(data.collectedFees)}
            label='Collected'
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            icon='solar:hourglass-duotone'
            iconColor='text-orange-600'
            iconBgColor='bg-orange-100'
            value={formatCurrency(data.pendingPayments)}
            label='Outstanding'
          />
          <MetricCard
            icon='solar:graph-up-duotone'
            iconColor='text-violet-600'
            iconBgColor='bg-violet-100'
            value={`${data.collectionRate}%`}
            label='Collection Rate'
          />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content - 2 columns */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Collection Progress */}
            <Card className='overflow-hidden'>
              <div className='h-1 bg-gradient-to-r from-emerald-500 to-emerald-600' />
              <CardContent className='p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <div>
                    <h3 className='flex items-center gap-2 font-semibold'>
                      <Icon
                        icon='solar:chart-2-duotone'
                        className='text-primary size-5'
                      />
                      Annual Collection Progress
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Academic Year 2024-2025
                    </p>
                  </div>
                  <Badge
                    variant='outline'
                    className='border-emerald-200 bg-emerald-50 text-emerald-700'
                  >
                    {data.collectionRate}% collected
                  </Badge>
                </div>
                <Progress value={data.collectionRate} className='mb-4 h-3' />
                <div className='grid grid-cols-3 gap-4 text-center'>
                  <div className='rounded-lg bg-emerald-50 p-3'>
                    <p className='text-lg font-bold text-emerald-600'>
                      {formatCurrency(data.collectedFees)}
                    </p>
                    <p className='text-muted-foreground text-xs'>Collected</p>
                  </div>
                  <div className='rounded-lg bg-orange-50 p-3'>
                    <p className='text-lg font-bold text-orange-600'>
                      {formatCurrency(data.pendingPayments)}
                    </p>
                    <p className='text-muted-foreground text-xs'>Pending</p>
                  </div>
                  <div className='rounded-lg bg-blue-50 p-3'>
                    <p className='text-lg font-bold text-blue-600'>
                      {formatCurrency(data.totalFees)}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Total Expected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overdue Payments */}
            <SectionCard
              title='Overdue Payments'
              titleIcon='solar:danger-triangle-duotone'
              description='Invoices requiring immediate attention'
              viewAllHref='/dashboard/invoices?status=overdue'
            >
              <div className='space-y-3'>
                {MOCK_OVERDUE.map((item) => {
                  const urgency =
                    item.days > 20
                      ? 'critical'
                      : item.days > 10
                        ? 'high'
                        : 'medium';
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md',
                        urgency === 'critical' && 'border-red-200 bg-red-50/50',
                        urgency === 'high' &&
                          'border-orange-200 bg-orange-50/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-10 items-center justify-center rounded-xl',
                          urgency === 'critical'
                            ? 'bg-red-100 text-red-600'
                            : urgency === 'high'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-yellow-100 text-yellow-600'
                        )}
                      >
                        <Icon
                          icon='solar:bill-cross-duotone'
                          className='size-5'
                        />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <h4 className='font-semibold'>{item.student}</h4>
                          <span className='text-muted-foreground text-xs'>
                            ({item.grade})
                          </span>
                        </div>
                        <p className='text-muted-foreground text-sm'>
                          {item.invoiceId}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold'>
                          {formatCurrency(item.amount)}
                        </p>
                        <Badge
                          variant='outline'
                          className={cn(
                            urgency === 'critical' &&
                              'border-red-200 text-red-600',
                            urgency === 'high' &&
                              'border-orange-200 text-orange-600',
                            urgency === 'medium' &&
                              'border-yellow-200 text-yellow-600'
                          )}
                        >
                          {item.days} days overdue
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* Payment Methods Breakdown */}
            <SectionCard
              title='Payment Methods'
              titleIcon='solar:card-duotone'
              description='Collection by payment method'
            >
              <div className='space-y-4'>
                {[
                  {
                    method: 'Bank Transfer',
                    amount: 1200000,
                    percentage: 64,
                    icon: 'solar:buildings-2-duotone',
                    color: 'bg-blue-500'
                  },
                  {
                    method: 'Online Payment',
                    amount: 487500,
                    percentage: 26,
                    icon: 'solar:card-duotone',
                    color: 'bg-violet-500'
                  },
                  {
                    method: 'Cash',
                    amount: 187500,
                    percentage: 10,
                    icon: 'solar:money-bag-duotone',
                    color: 'bg-emerald-500'
                  }
                ].map((item, i) => (
                  <div key={i} className='flex items-center gap-4'>
                    <div className='bg-muted flex size-10 items-center justify-center rounded-xl'>
                      <Icon
                        icon={item.icon}
                        className='text-muted-foreground size-5'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='mb-1 flex justify-between'>
                        <span className='text-sm font-medium'>
                          {item.method}
                        </span>
                        <span className='text-sm font-bold'>
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Progress
                          value={item.percentage}
                          className={cn('h-2 flex-1', `[&>div]:${item.color}`)}
                        />
                        <span className='text-muted-foreground w-10 text-xs'>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className='space-y-8'>
            {/* Recent Payments */}
            <SectionCard
              title='Recent Payments'
              titleIcon='solar:check-circle-duotone'
              viewAllHref='/dashboard/payments'
            >
              <div className='space-y-3'>
                {MOCK_RECENT_PAYMENTS.map((payment) => (
                  <ListItem
                    key={payment.id}
                    icon='solar:wallet-duotone'
                    iconClassName='text-emerald-600 bg-emerald-100'
                    title={payment.student}
                    subtitle={payment.method}
                    badge={{
                      text: formatCurrency(payment.amount),
                      className:
                        'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }}
                    meta={payment.time}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title='Quick Actions' titleIcon='solar:bolt-duotone'>
              <QuickActionGrid actions={QUICK_ACTIONS} />
            </SectionCard>

            {/* Invoice Summary */}
            <SectionCard
              title='Invoice Summary'
              titleIcon='solar:document-text-duotone'
            >
              <div className='space-y-3'>
                <div className='bg-muted/50 flex items-center justify-between rounded-lg p-3'>
                  <span className='text-sm'>Total Invoices</span>
                  <span className='font-bold'>
                    {data.totalInvoices.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-lg bg-emerald-50 p-3'>
                  <span className='text-sm text-emerald-700'>Paid</span>
                  <span className='font-bold text-emerald-700'>
                    {(
                      data.totalInvoices - data.pendingInvoices
                    ).toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-lg bg-orange-50 p-3'>
                  <span className='text-sm text-orange-700'>Pending</span>
                  <span className='font-bold text-orange-700'>
                    {data.pendingInvoices}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Monthly Trend */}
            <SectionCard
              title='This Month'
              titleIcon='solar:calendar-date-duotone'
            >
              <div className='space-y-4'>
                <div>
                  <div className='mb-1 flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Collected</span>
                    <span className='font-medium'>
                      {formatCurrency(245000)}
                    </span>
                  </div>
                  <Progress value={78} className='h-2' />
                </div>
                <div className='grid grid-cols-2 gap-3 text-center'>
                  <div className='bg-muted/50 rounded-lg p-3'>
                    <p className='text-xl font-bold'>156</p>
                    <p className='text-muted-foreground text-xs'>Payments</p>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3'>
                    <p className='text-xl font-bold'>23</p>
                    <p className='text-muted-foreground text-xs'>
                      New Invoices
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
