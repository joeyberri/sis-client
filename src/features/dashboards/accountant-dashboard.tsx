'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { LoadingState } from '@/components/empty-state';
import { DollarSign, TrendingUp, AlertTriangle, FileText, CreditCard, BarChart3 } from 'lucide-react';

interface AccountantDashboardStats {
  totalFees: number;
  collectedFees: number;
  pendingPayments: number;
  totalInvoices: number;
  pendingInvoices: number;
  collectionRate: number;
}

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
          setStats(null);
        }
      } catch (err) {
        console.error('Failed to fetch accountant dashboard:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your financial overview..." />;
  }

  if (!stats) {
    return <LoadingState title="Loading Dashboard..." description="Preparing your financial overview..." />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Financial Management Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage fees, invoices, payments, and financial reports</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Fees Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Expected Fees</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalFees)}</p>
                  <p className="text-xs text-muted-foreground">This academic year</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collected Fees Card */}
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Collected Fees</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.collectedFees)}</p>
                  <p className="text-xs text-green-600 font-medium">{stats.collectionRate}% collection rate</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments Card */}
          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.pendingPayments)}</p>
                  <p className="text-xs text-orange-600 font-medium">Action required</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Invoices Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                  <p className="text-3xl font-bold">{stats.totalInvoices}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invoices Card */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                  <p className="text-3xl font-bold text-red-600">{stats.pendingInvoices}</p>
                  <p className="text-xs text-red-600 font-medium">Awaiting payment</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.collectedFees / 12)}</p>
                  <p className="text-xs text-muted-foreground">Average per month</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common financial tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Create Invoice</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Record Payment</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">View Reconciliation</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overdue Payments</CardTitle>
            <CardDescription>Invoices requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { student: 'Student A', amount: 50000, daysOverdue: 15, invoiceId: 'INV-001' },
                { student: 'Student B', amount: 35000, daysOverdue: 8, invoiceId: 'INV-002' },
                { student: 'Student C', amount: 75000, daysOverdue: 25, invoiceId: 'INV-003' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.student}</p>
                    <p className="text-xs text-muted-foreground">Invoice {item.invoiceId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(item.amount)}</p>
                    <Badge className="bg-red-100 text-red-800">{item.daysOverdue} days overdue</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <CardDescription>By collection method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { method: 'Bank Transfer', amount: 1200000, percentage: 53 },
                { method: 'Online Payment', amount: 750000, percentage: 33 },
                { method: 'Cash', amount: 300000, percentage: 14 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.method}</p>
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-sm">{formatCurrency(item.amount)}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
