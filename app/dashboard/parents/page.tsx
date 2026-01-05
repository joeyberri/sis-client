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
import { Plus, Mail, User } from 'lucide-react';

interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relation: 'Father' | 'Mother' | 'Guardian';
  linkedStudents: number;
  portalAccess: 'active' | 'pending' | 'inactive';
  joinDate?: string;
}

export default function ParentsPage() {
  const { isAdmin } = useUser();

  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchParents = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getParents();
      setParents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load parents', err);
      setError('Failed to load parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const filteredParents = parents.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccessBadge = (access: string) => {
    switch (access) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <EmptyState
          variant="error"
          title="Access Denied"
          description="You don't have permission to view parent records. Please contact an administrator."
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState
          title="Loading parents..."
          description="Fetching parent and guardian records..."
        />
      </PageContainer>
    );
  }

  if (error && parents.length === 0) {
    return (
      <PageContainer>
        <ErrorState
          title="Failed to load parents"
          description="We couldn't fetch parent records. Please check your connection and try again."
          onRetry={fetchParents}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parents & Guardians</h1>
            <p className="text-muted-foreground">Manage guardian accounts, invitations and parent portal settings.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite Parent
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parents.filter(p => p.portalAccess === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
              <Mail className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parents.filter(p => p.portalAccess === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Guardians</CardTitle>
            <CardDescription>List of guardians linked to students</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredParents.length === 0 ? (
              <EmptyState
                title={parents.length === 0 ? "No parents added" : "No parents match your search"}
                description={parents.length === 0 ? "Invite parents to join the parent portal and stay connected." : "Try adjusting your search criteria."}
              />
            ) : (
              <>
                <div className="flex items-center py-4">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Relation</TableHead>
                        <TableHead>Linked Students</TableHead>
                        <TableHead>Portal Access</TableHead>
                        <TableHead>Join Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParents.map((parent) => (
                        <TableRow key={parent.id}>
                          <TableCell className="font-medium">{parent.name}</TableCell>
                          <TableCell className="text-muted-foreground">{parent.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{parent.phone || '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{parent.relation}</Badge>
                          </TableCell>
                          <TableCell className="text-center">{parent.linkedStudents}</TableCell>
                          <TableCell>
                            {getAccessBadge(parent.portalAccess)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {parent.joinDate ? new Date(parent.joinDate).toLocaleDateString() : '—'}
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
