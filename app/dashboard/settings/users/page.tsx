'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import {
  Plus,
  MoreHorizontal,
  Edit2,
  Shield,
  Lock,
  Trash2
} from 'lucide-react';
import { InviteUserDialog } from '@/components/forms/invite-user-dialog';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role:
    | 'SuperAdmin'
    | 'Admin'
    | 'Teacher'
    | 'Student'
    | 'Parent'
    | 'Accountant'
    | 'Counselor';
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  createdAt: string;
}

export default function SettingsUsersPage() {
  const { isAdmin } = useUser();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users');
      const data = res?.data ?? [];
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleInviteUser = async (data: {
    name: string;
    email: string;
    role: string;
  }) => {
    try {
      await apiClient.inviteUser(data);
      toast.success('Invitation sent successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error inviting user:', err);
      toast.error('Failed to send invitation');
      throw err;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      SuperAdmin: 'bg-purple-100 text-purple-700',
      Admin: 'bg-red-100 text-red-700',
      Teacher: 'bg-blue-100 text-blue-700',
      Student: 'bg-green-100 text-green-700',
      Parent: 'bg-orange-100 text-orange-700',
      Accountant: 'bg-cyan-100 text-cyan-700',
      Counselor: 'bg-pink-100 text-pink-700'
    };
    return variants[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Active: 'bg-green-100 text-green-700',
      Inactive: 'bg-gray-100 text-gray-700',
      Pending: 'bg-yellow-100 text-yellow-700'
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = users.filter((user) => {
    // Hide SuperAdmins from the management list
    if (user.role === 'SuperAdmin') return false;

    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchFilter;
  });

  const activeUsersCount = users.filter(
    (u) => u.status === 'Active' && u.role !== 'SuperAdmin'
  ).length;
  const roleDistribution = {
    SuperAdmin: users.filter((u) => u.role === 'SuperAdmin').length || 0,
    Admin: users.filter((u) => u.role === 'Admin').length || 0,
    Teacher: users.filter((u) => u.role === 'Teacher').length || 0,
    Student: users.filter((u) => u.role === 'Student').length || 0,
    Parent: users.filter((u) => u.role === 'Parent').length || 0,
    Accountant: users.filter((u) => u.role === 'Accountant').length || 0,
    Counselor: users.filter((u) => u.role === 'Counselor').length || 0
  };

  if (!isAdmin)
    return (
      <PageContainer>
        <ErrorState
          title='Access Denied'
          description="You don't have permission to manage users."
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );

  if (loading && users.length === 0)
    return (
      <LoadingState
        title='Loading Users...'
        description='Fetching user accounts...'
      />
    );

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Users & Permissions</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              Manage user accounts, roles, and access permissions
            </p>
          </div>
          <Button className='gap-2' onClick={() => setIsInviteDialogOpen(true)}>
            <Plus className='h-4 w-4' /> Invite User
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-1'>
                <p className='text-muted-foreground text-sm'>Total Users</p>
                <p className='text-3xl font-bold'>{users.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-1'>
                <p className='text-muted-foreground text-sm'>Active Users</p>
                <p className='text-3xl font-bold'>{activeUsersCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col gap-1'>
                <p className='text-muted-foreground text-sm'>Admin Accounts</p>
                <p className='text-3xl font-bold'>
                  {(roleDistribution.SuperAdmin || 0) +
                    (roleDistribution.Admin || 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-2 md:flex-row'>
              <Input
                placeholder='Search by name or email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1'
              />
              <div className='flex flex-wrap gap-1'>
                {[
                  'all',
                  'Admin',
                  'Teacher',
                  'Student',
                  'Parent',
                  'Accountant',
                  'Counselor'
                ].map((role) => (
                  <Button
                    key={role}
                    variant={filterRole === role ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setFilterRole(role)}
                  >
                    {role === 'all' ? 'All Roles' : role}
                  </Button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              error && users.length === 0 ? (
                <ErrorState
                  title='Failed to Load Users'
                  description={error}
                  onRetry={() => window.location.reload()}
                />
              ) : (
                <EmptyState
                  title='No users found'
                  description={
                    searchQuery
                      ? 'Try adjusting your search criteria'
                      : 'Start by inviting the first user'
                  }
                />
              )
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {user.role === 'SuperAdmin' ||
                          user.role === 'Admin' ? (
                            <Shield className='text-muted-foreground h-4 w-4' />
                          ) : null}
                          <Badge className={getRoleBadge(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-sm'>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell className='text-sm'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className='gap-2'>
                              <Edit2 className='h-4 w-4' /> Edit User
                            </DropdownMenuItem>
                            {user.status === 'Active' && (
                              <DropdownMenuItem className='gap-2'>
                                <Lock className='h-4 w-4' /> Deactivate
                              </DropdownMenuItem>
                            )}
                            {user.status !== 'Active' && (
                              <DropdownMenuItem className='gap-2'>
                                <Shield className='h-4 w-4' /> Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className='text-destructive gap-2'>
                              <Trash2 className='h-4 w-4' /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteUser}
      />
    </PageContainer>
  );
}
