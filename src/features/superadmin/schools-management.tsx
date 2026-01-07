'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PACKAGE_PRICING, SUBSCRIPTION_STATUSES } from '@/config/superadmin';
import type { School, SubscriptionStatus } from '@/types/superadmin';

// Mock data for demonstration
const mockSchools: School[] = [
  {
    id: '1',
    name: 'Springfield Elementary',
    slug: 'springfield-elementary',
    domain: 'springfield.sis.edu',
    logo: '/assets/schools/springfield.png',
    status: 'active',
    subscription: {
      tier: 'standard',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      billingCycle: 'yearly',
      price: 2990
    },
    adminEmail: 'admin@springfield.edu',
    adminName: 'Seymour Skinner',
    studentCount: 450,
    teacherCount: 32,
    adminCount: 3,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    lastActiveAt: '2024-06-15T09:30:00Z',
    clerkOrgId: 'org_1234'
  },
  {
    id: '2',
    name: 'Westview High School',
    slug: 'westview-high',
    domain: 'westview.sis.edu',
    status: 'active',
    subscription: {
      tier: 'premium',
      status: 'active',
      startDate: '2023-09-01',
      endDate: '2024-09-01',
      billingCycle: 'yearly',
      price: 7990
    },
    adminEmail: 'principal@westview.edu',
    adminName: 'Sarah Connor',
    studentCount: 1200,
    teacherCount: 85,
    adminCount: 8,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
    lastActiveAt: '2024-06-15T11:45:00Z'
  },
  {
    id: '3',
    name: 'Sunrise Academy',
    slug: 'sunrise-academy',
    domain: 'sunrise.sis.edu',
    status: 'trial',
    subscription: {
      tier: 'trial',
      status: 'trial',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      billingCycle: 'monthly',
      price: 0
    },
    adminEmail: 'head@sunrise.edu',
    adminName: 'John Smith',
    studentCount: 45,
    teacherCount: 4,
    adminCount: 1,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    lastActiveAt: '2024-06-14T16:20:00Z'
  },
  {
    id: '4',
    name: 'Oak Grove Institute',
    slug: 'oak-grove',
    domain: 'oakgrove.sis.edu',
    status: 'suspended',
    subscription: {
      tier: 'standard',
      status: 'suspended',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      billingCycle: 'yearly',
      price: 2990
    },
    adminEmail: 'admin@oakgrove.edu',
    adminName: 'Michael Johnson',
    studentCount: 280,
    teacherCount: 22,
    adminCount: 2,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z',
    lastActiveAt: '2024-05-15T08:00:00Z'
  }
];

export default function SchoolsManagement() {
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (school.adminEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === 'all' || school.status === statusFilter;
    const matchesTier =
      tierFilter === 'all' || school.subscription?.tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusBadge = (status?: string) => {
    if (!status)
      return <Badge className='bg-gray-100 text-gray-800'>Unknown</Badge>;
    const statusConfig = SUBSCRIPTION_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getTierBadge = (tier?: string) => {
    if (!tier)
      return <Badge className='bg-gray-100 text-gray-800'>Unknown</Badge>;
    const colors: Record<string, string> = {
      trial: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      standard: 'bg-purple-100 text-purple-800',
      premium: 'bg-amber-100 text-amber-800',
      enterprise: 'bg-emerald-100 text-emerald-800'
    };
    return (
      <Badge className={colors[tier] || 'bg-gray-100 text-gray-800'}>
        {PACKAGE_PRICING[tier]?.name || tier}
      </Badge>
    );
  };

  const handleSuspend = (school: School) => {
    setSchools(
      schools.map((s) =>
        s.id === school.id
          ? {
              ...s,
              status: 'suspended' as const,
              subscription: s.subscription
                ? {
                    ...s.subscription,
                    status: 'suspended' as SubscriptionStatus
                  }
                : {
                    tier: 'basic' as const,
                    status: 'suspended' as SubscriptionStatus,
                    startDate: '',
                    endDate: ''
                  }
            }
          : s
      )
    );
  };

  const handleActivate = (school: School) => {
    setSchools(
      schools.map((s) =>
        s.id === school.id
          ? {
              ...s,
              status: 'active' as const,
              subscription: s.subscription
                ? { ...s.subscription, status: 'active' as SubscriptionStatus }
                : {
                    tier: 'basic' as const,
                    status: 'active' as SubscriptionStatus,
                    startDate: '',
                    endDate: ''
                  }
            }
          : s
      )
    );
  };

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center gap-2 text-3xl font-bold'>
              <Building2 className='text-primary h-8 w-8' />
              Schools Management
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage all schools on the platform
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Export
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Add School
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                  <DialogTitle>Add New School</DialogTitle>
                  <DialogDescription>
                    Create a new school account on the platform
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>School Name</Label>
                      <Input id='name' placeholder='Enter school name' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='slug'>Slug</Label>
                      <Input id='slug' placeholder='school-slug' />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='adminName'>Admin Name</Label>
                      <Input id='adminName' placeholder='Admin full name' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='adminEmail'>Admin Email</Label>
                      <Input
                        id='adminEmail'
                        type='email'
                        placeholder='admin@school.edu'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='tier'>Package Tier</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder='Select tier' />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PACKAGE_PRICING).map(([key, pkg]) => (
                            <SelectItem key={key} value={key}>
                              {pkg.name} - ${pkg.monthlyPrice}/mo
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='billing'>Billing Cycle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder='Select billing' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='monthly'>Monthly</SelectItem>
                          <SelectItem value='yearly'>
                            Yearly (Save 17%)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create School
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>{schools.length}</div>
              <p className='text-muted-foreground text-xs'>Total Schools</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold text-green-600'>
                {schools.filter((s) => s.status === 'active').length}
              </div>
              <p className='text-muted-foreground text-xs'>Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold text-blue-600'>
                {schools.filter((s) => s.status === 'trial').length}
              </div>
              <p className='text-muted-foreground text-xs'>On Trial</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold text-orange-600'>
                {schools.filter((s) => s.status === 'suspended').length}
              </div>
              <p className='text-muted-foreground text-xs'>Suspended</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-wrap gap-4'>
              <div className='min-w-[200px] flex-1'>
                <div className='relative'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                  <Input
                    placeholder='Search schools...'
                    className='pl-9'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='trial'>Trial</SelectItem>
                  <SelectItem value='suspended'>Suspended</SelectItem>
                  <SelectItem value='expired'>Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder='Tier' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Tiers</SelectItem>
                  <SelectItem value='trial'>Trial</SelectItem>
                  <SelectItem value='basic'>Basic</SelectItem>
                  <SelectItem value='standard'>Standard</SelectItem>
                  <SelectItem value='premium'>Premium</SelectItem>
                  <SelectItem value='enterprise'>Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='icon'>
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schools Table */}
        <Card>
          <CardContent className='pt-6'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div>
                        <div className='font-medium'>{school.name}</div>
                        <div className='text-muted-foreground text-sm'>
                          {school.domain}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='text-sm'>{school.adminName}</div>
                        <div className='text-muted-foreground text-xs'>
                          {school.adminEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTierBadge(school.subscription?.tier)}
                    </TableCell>
                    <TableCell>{getStatusBadge(school.status)}</TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        <div>{school.studentCount} students</div>
                        <div className='text-muted-foreground'>
                          {school.teacherCount} teachers
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-muted-foreground text-sm'>
                        {new Date(school.lastActiveAt!).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSchool(school);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className='mr-2 h-4 w-4' />
                            Contact Admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {school.status === 'suspended' ? (
                            <DropdownMenuItem
                              onClick={() => handleActivate(school)}
                            >
                              <CheckCircle className='mr-2 h-4 w-4' />
                              Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleSuspend(school)}
                              className='text-orange-600'
                            >
                              <Ban className='mr-2 h-4 w-4' />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className='text-red-600'>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View School Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className='sm:max-w-[700px]'>
            {selectedSchool && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedSchool.name}</DialogTitle>
                  <DialogDescription>{selectedSchool.domain}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue='overview' className='w-full'>
                  <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='subscription'>Subscription</TabsTrigger>
                    <TabsTrigger value='users'>Users</TabsTrigger>
                    <TabsTrigger value='activity'>Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value='overview' className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 pt-4'>
                      <div>
                        <Label className='text-muted-foreground'>
                          Admin Name
                        </Label>
                        <p className='font-medium'>
                          {selectedSchool.adminName}
                        </p>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>
                          Admin Email
                        </Label>
                        <p className='font-medium'>
                          {selectedSchool.adminEmail}
                        </p>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>Status</Label>
                        <div className='mt-1'>
                          {getStatusBadge(selectedSchool.status)}
                        </div>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>Package</Label>
                        <div className='mt-1'>
                          {getTierBadge(selectedSchool?.subscription?.tier)}
                        </div>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>Created</Label>
                        <p className='font-medium'>
                          {new Date(
                            selectedSchool.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>
                          Last Active
                        </Label>
                        <p className='font-medium'>
                          {new Date(
                            selectedSchool.lastActiveAt!
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value='subscription' className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 pt-4'>
                      <div>
                        <Label className='text-muted-foreground'>
                          Current Plan
                        </Label>
                        <p className='font-medium'>
                          {selectedSchool?.subscription?.tier
                            ? PACKAGE_PRICING[selectedSchool.subscription.tier]
                                ?.name
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>Price</Label>
                        <p className='font-medium'>
                          ${selectedSchool?.subscription?.price ?? 0}/year
                        </p>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>
                          Start Date
                        </Label>
                        <p className='font-medium'>
                          {selectedSchool?.subscription?.startDate
                            ? new Date(
                                selectedSchool.subscription.startDate
                              ).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className='text-muted-foreground'>
                          End Date
                        </Label>
                        <p className='font-medium'>
                          {selectedSchool?.subscription?.endDate
                            ? new Date(
                                selectedSchool.subscription.endDate
                              ).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className='pt-4'>
                      <Button variant='outline' className='mr-2'>
                        Change Plan
                      </Button>
                      <Button variant='outline'>Extend Trial</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value='users' className='space-y-4'>
                    <div className='grid grid-cols-3 gap-4 pt-4'>
                      <Card>
                        <CardContent className='pt-6 text-center'>
                          <div className='text-2xl font-bold'>
                            {selectedSchool.studentCount}
                          </div>
                          <p className='text-muted-foreground text-sm'>
                            Students
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className='pt-6 text-center'>
                          <div className='text-2xl font-bold'>
                            {selectedSchool.teacherCount}
                          </div>
                          <p className='text-muted-foreground text-sm'>
                            Teachers
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className='pt-6 text-center'>
                          <div className='text-2xl font-bold'>
                            {selectedSchool.adminCount}
                          </div>
                          <p className='text-muted-foreground text-sm'>
                            Admins
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value='activity'>
                    <div className='text-muted-foreground py-8 pt-4 text-center'>
                      Activity log coming soon...
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
