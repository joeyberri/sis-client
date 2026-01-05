'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Plus, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'once';
  dueDate?: string;
  status: 'active' | 'inactive';
  appliesTo: string; // e.g., "All Students", "Grade 10+", etc.
}

export default function FeesPage() {
  const { isAdmin } = useUser();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFees = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFees();
      setFees(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load fees', err);
      setError('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const filteredFees = fees.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.appliesTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFrequencyLabel = (freq: string) => {
    const labels: { [key: string]: string } = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'annually': 'Annually',
      'once': 'One-time'
    };
    return labels[freq] || freq;
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant="error"
          title="Access Denied"
          description="You don't have permission to view fees. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title="Loading fees..."
          description="Fetching fee structures..."
        />
      </PageContainer>
    );
  }

  if (error && fees.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title="Failed to load fees"
          description="We couldn't fetch fee structures. Please check your connection and try again."
          onRetry={fetchFees}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fees & Payments</h1>
            <p className="text-muted-foreground">Manage fee structures, schedules and payment plans.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Fee
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fees.filter(f => f.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Monthly</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${fees
                  .filter(f => f.status === 'active' && f.frequency === 'monthly')
                  .reduce((sum, f) => sum + f.amount, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">per month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(fees
                  .filter(f => f.status === 'active' && f.frequency === 'monthly')
                  .reduce((sum, f) => sum + f.amount, 0) * 12)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">estimated</p>
            </CardContent>
          </Card>
        </div>

        {/* Fee Structures Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Structures</CardTitle>
            <CardDescription>All active and inactive fee schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFees.length === 0 ? (
              <EmptyState
                title="No fees configured"
                description={fees.length === 0 ? "Set up your first fee structure to start tracking payments." : "No fees match your search."}
                action={fees.length === 0 ? {
                  label: 'Add Fee',
                  onClick: () => { /* Navigate to add fee */ }
                } : undefined}
              />
            ) : (
              <>
                <div className="flex items-center py-4">
                  <Input
                    placeholder="Search fees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fee Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Applies To</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFees.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell className="font-medium">{fee.name}</TableCell>
                          <TableCell className="font-mono">${fee.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getFrequencyLabel(fee.frequency)}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fee.appliesTo}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fee.dueDate || '—'}</TableCell>
                          <TableCell>
                            {fee.status === 'active' ? (
                              <Badge variant="default" className="bg-green-600">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
