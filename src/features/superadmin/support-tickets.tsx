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
  DialogTitle
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HeadphonesIcon,
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  RefreshCw,
  Send,
  Paperclip,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES
} from '@/config/superadmin';
import type { SupportTicket, TicketMessage } from '@/types/superadmin';

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    schoolId: '1',
    schoolName: 'Springfield Elementary',
    subject: 'Cannot access grade reports',
    description:
      'Teachers are unable to access the grade reports section. Getting a 403 error.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdBy: 'user_123',
    createdByName: 'Seymour Skinner',
    createdByEmail: 'admin@springfield.edu',
    createdAt: '2024-06-15T09:30:00Z',
    updatedAt: '2024-06-15T09:30:00Z',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'TKT-001',
        senderId: 'user_123',
        senderName: 'Seymour Skinner',
        senderRole: 'customer',
        content:
          'Teachers are unable to access the grade reports section. Getting a 403 error. This is urgent as we need to submit grades by end of week.',
        createdAt: '2024-06-15T09:30:00Z'
      }
    ]
  },
  {
    id: 'TKT-002',
    schoolId: '2',
    schoolName: 'Westview High School',
    subject: 'Billing inquiry - Annual renewal',
    description:
      'Need clarification on our annual renewal pricing and any available discounts.',
    category: 'billing',
    priority: 'medium',
    status: 'in_progress',
    createdBy: 'user_456',
    createdByName: 'Sarah Connor',
    createdByEmail: 'principal@westview.edu',
    assignedTo: 'support_1',
    assignedToName: 'Support Agent',
    createdAt: '2024-06-14T14:20:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
    messages: [
      {
        id: 'msg-2',
        ticketId: 'TKT-002',
        senderId: 'user_456',
        senderName: 'Sarah Connor',
        senderRole: 'customer',
        content:
          'Our annual subscription is up for renewal next month. Can you provide details on pricing changes and any loyalty discounts?',
        createdAt: '2024-06-14T14:20:00Z'
      },
      {
        id: 'msg-3',
        ticketId: 'TKT-002',
        senderId: 'support_1',
        senderName: 'Support Agent',
        senderRole: 'agent',
        content:
          "Thank you for reaching out! I'm checking with our billing team about available loyalty discounts for long-term customers like Westview High. Will get back to you shortly.",
        createdAt: '2024-06-15T10:00:00Z'
      }
    ]
  },
  {
    id: 'TKT-003',
    schoolId: '3',
    schoolName: 'Sunrise Academy',
    subject: 'Feature Request: Parent mobile app',
    description:
      "Parents are requesting a dedicated mobile app for viewing their children's progress.",
    category: 'feature_request',
    priority: 'low',
    status: 'waiting_on_customer',
    createdBy: 'user_789',
    createdByName: 'John Smith',
    createdByEmail: 'head@sunrise.edu',
    assignedTo: 'product_1',
    assignedToName: 'Product Team',
    createdAt: '2024-06-10T11:00:00Z',
    updatedAt: '2024-06-12T15:30:00Z',
    messages: []
  },
  {
    id: 'TKT-004',
    schoolId: '1',
    schoolName: 'Springfield Elementary',
    subject: 'System running slow during peak hours',
    description:
      'The system becomes very slow between 8-9 AM when everyone logs in.',
    category: 'bug_report',
    priority: 'urgent',
    status: 'open',
    createdBy: 'user_123',
    createdByName: 'Seymour Skinner',
    createdByEmail: 'admin@springfield.edu',
    createdAt: '2024-06-15T08:45:00Z',
    updatedAt: '2024-06-15T08:45:00Z',
    messages: []
  },
  {
    id: 'TKT-005',
    schoolId: '2',
    schoolName: 'Westview High School',
    subject: 'Password reset not working',
    description: 'Users are not receiving password reset emails.',
    category: 'technical',
    priority: 'high',
    status: 'resolved',
    createdBy: 'user_456',
    createdByName: 'Sarah Connor',
    createdByEmail: 'principal@westview.edu',
    assignedTo: 'support_2',
    assignedToName: 'Tech Support',
    resolvedAt: '2024-06-14T16:00:00Z',
    createdAt: '2024-06-13T09:00:00Z',
    updatedAt: '2024-06-14T16:00:00Z',
    messages: []
  }
];

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = TICKET_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = TICKET_PRIORITIES.find((p) => p.value === priority);
    return (
      <Badge className={priorityConfig?.color || 'bg-gray-100 text-gray-800'}>
        {priorityConfig?.label || priority}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    return (
      TICKET_CATEGORIES.find((c) => c.value === category)?.label || category
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId: selectedTicket.id,
      senderId: 'superadmin',
      senderName: 'SuperAdmin',
      senderRole: 'agent',
      content: newMessage,
      createdAt: new Date().toISOString()
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      status: 'in_progress' as const,
      updatedAt: new Date().toISOString()
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket);
    setNewMessage('');
  };

  const handleResolve = (ticket: SupportTicket) => {
    const updatedTicket = {
      ...ticket,
      status: 'resolved' as const,
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTickets(tickets.map((t) => (t.id === ticket.id ? updatedTicket : t)));
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket(updatedTicket);
    }
  };

  const handleClose = (ticket: SupportTicket) => {
    const updatedTicket = {
      ...ticket,
      status: 'closed' as const,
      updatedAt: new Date().toISOString()
    };
    setTickets(tickets.map((t) => (t.id === ticket.id ? updatedTicket : t)));
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket(updatedTicket);
    }
  };

  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;
  const urgentTicketsCount = tickets.filter(
    (t) =>
      t.priority === 'urgent' &&
      t.status !== 'resolved' &&
      t.status !== 'closed'
  ).length;
  const inProgressCount = tickets.filter(
    (t) => t.status === 'in_progress'
  ).length;
  const resolvedTodayCount = tickets.filter((t) => {
    if (t.status !== 'resolved') return false;
    const resolved = new Date(t.resolvedAt!);
    const today = new Date();
    return resolved.toDateString() === today.toDateString();
  }).length;

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center gap-2 text-3xl font-bold'>
              <HeadphonesIcon className='text-primary h-8 w-8' />
              Support Tickets
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage support requests from all schools
            </p>
          </div>
          <Button variant='outline' size='sm'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card className='border-yellow-200'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-yellow-100 p-2'>
                  <AlertCircle className='h-5 w-5 text-yellow-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>{openTicketsCount}</div>
                  <p className='text-muted-foreground text-xs'>Open Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-red-200'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-red-100 p-2'>
                  <Clock className='h-5 w-5 text-red-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-red-600'>
                    {urgentTicketsCount}
                  </div>
                  <p className='text-muted-foreground text-xs'>Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-blue-200'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <MessageSquare className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>{inProgressCount}</div>
                  <p className='text-muted-foreground text-xs'>In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-green-200'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {resolvedTodayCount}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Resolved Today
                  </p>
                </div>
              </div>
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
                    placeholder='Search tickets...'
                    className='pl-9'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[160px]'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  {TICKET_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className='w-[140px]'>
                  <SelectValue placeholder='Priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Priority</SelectItem>
                  {TICKET_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-[160px]'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  {TICKET_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardContent className='pt-6'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className='cursor-pointer'
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <TableCell>
                      <div>
                        <div className='font-medium'>{ticket.subject}</div>
                        <div className='text-muted-foreground text-xs'>
                          {ticket.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>{ticket.schoolName}</div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        {getCategoryLabel(ticket.category)}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      <div className='text-muted-foreground text-sm'>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell
                      className='text-right'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <MessageSquare className='mr-2 h-4 w-4' />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {ticket.status !== 'resolved' &&
                            ticket.status !== 'closed' && (
                              <DropdownMenuItem
                                onClick={() => handleResolve(ticket)}
                              >
                                <CheckCircle className='mr-2 h-4 w-4' />
                                Mark Resolved
                              </DropdownMenuItem>
                            )}
                          {ticket.status !== 'closed' && (
                            <DropdownMenuItem
                              onClick={() => handleClose(ticket)}
                            >
                              <XCircle className='mr-2 h-4 w-4' />
                              Close Ticket
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ticket View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className='max-h-[90vh] sm:max-w-[800px]'>
            {selectedTicket && (
              <>
                <DialogHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <DialogTitle>{selectedTicket.subject}</DialogTitle>
                      <DialogDescription className='mt-1 flex items-center gap-2'>
                        <span>{selectedTicket.id}</span>
                        <span>•</span>
                        <span>{selectedTicket.schoolName}</span>
                      </DialogDescription>
                    </div>
                    <div className='flex gap-2'>
                      {getPriorityBadge(selectedTicket.priority)}
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                  </div>
                </DialogHeader>

                <div className='grid grid-cols-3 gap-4'>
                  {/* Ticket Info */}
                  <div className='col-span-1 space-y-4'>
                    <Card>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-sm'>Details</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-3 text-sm'>
                        <div>
                          <Label className='text-muted-foreground text-xs'>
                            Category
                          </Label>
                          <p>{getCategoryLabel(selectedTicket.category)}</p>
                        </div>
                        <div>
                          <Label className='text-muted-foreground text-xs'>
                            Created By
                          </Label>
                          <p>{selectedTicket.createdByName}</p>
                          <p className='text-muted-foreground text-xs'>
                            {selectedTicket.createdByEmail}
                          </p>
                        </div>
                        <div>
                          <Label className='text-muted-foreground text-xs'>
                            Created
                          </Label>
                          <p>
                            {new Date(
                              selectedTicket.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                        {selectedTicket.assignedToName && (
                          <div>
                            <Label className='text-muted-foreground text-xs'>
                              Assigned To
                            </Label>
                            <p>{selectedTicket.assignedToName}</p>
                          </div>
                        )}
                        {selectedTicket.resolvedAt && (
                          <div>
                            <Label className='text-muted-foreground text-xs'>
                              Resolved
                            </Label>
                            <p>
                              {new Date(
                                selectedTicket.resolvedAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-sm'>Actions</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-2'>
                        {selectedTicket.status !== 'resolved' &&
                          selectedTicket.status !== 'closed' && (
                            <Button
                              variant='outline'
                              className='w-full justify-start'
                              onClick={() => handleResolve(selectedTicket)}
                            >
                              <CheckCircle className='mr-2 h-4 w-4' />
                              Mark Resolved
                            </Button>
                          )}
                        {selectedTicket.status !== 'closed' && (
                          <Button
                            variant='outline'
                            className='w-full justify-start'
                            onClick={() => handleClose(selectedTicket)}
                          >
                            <XCircle className='mr-2 h-4 w-4' />
                            Close Ticket
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Messages */}
                  <div className='col-span-2 flex h-[500px] flex-col'>
                    <Card className='flex flex-1 flex-col'>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-sm'>Conversation</CardTitle>
                      </CardHeader>
                      <CardContent className='flex flex-1 flex-col'>
                        <ScrollArea className='flex-1 pr-4'>
                          <div className='space-y-4'>
                            {/* Initial Description */}
                            <div className='flex gap-3'>
                              <Avatar className='h-8 w-8'>
                                <AvatarFallback>
                                  {selectedTicket.createdByName?.charAt(0) ||
                                    'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm font-medium'>
                                    {selectedTicket.createdByName || 'Unknown'}
                                  </span>
                                  <span className='text-muted-foreground text-xs'>
                                    {new Date(
                                      selectedTicket.createdAt
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className='bg-muted mt-1 rounded-lg p-3 text-sm'>
                                  {selectedTicket.description}
                                </div>
                              </div>
                            </div>

                            {/* Messages */}
                            {selectedTicket.messages.map((message) => (
                              <div key={message.id} className='flex gap-3'>
                                <Avatar className='h-8 w-8'>
                                  <AvatarFallback>
                                    {message.senderName?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                  <div className='flex items-center gap-2'>
                                    <span className='text-sm font-medium'>
                                      {message.senderName || 'Unknown'}
                                    </span>
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      {message.senderRole === 'agent'
                                        ? 'Support'
                                        : 'Customer'}
                                    </Badge>
                                    <span className='text-muted-foreground text-xs'>
                                      {new Date(
                                        message.createdAt
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  <div
                                    className={`mt-1 rounded-lg p-3 text-sm ${
                                      message.senderRole === 'agent'
                                        ? 'bg-primary/10 border-primary/20 border'
                                        : 'bg-muted'
                                    }`}
                                  >
                                    {message.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        {/* Reply Box */}
                        {selectedTicket.status !== 'closed' && (
                          <div className='mt-4 border-t pt-4'>
                            <div className='flex gap-2'>
                              <Textarea
                                placeholder='Type your reply...'
                                className='min-h-[80px] resize-none'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                              />
                            </div>
                            <div className='mt-2 flex justify-between'>
                              <Button variant='ghost' size='sm'>
                                <Paperclip className='mr-2 h-4 w-4' />
                                Attach
                              </Button>
                              <Button size='sm' onClick={handleSendMessage}>
                                <Send className='mr-2 h-4 w-4' />
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
