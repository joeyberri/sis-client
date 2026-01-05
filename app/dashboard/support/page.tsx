'use client';

import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MessageCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  messages_count: number;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
}

export default function SupportPage() {
  const { user, role } = useUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch support tickets
      try {
        const ticketsRes = await apiClient.get('/support/tickets');
        const ticketsData = ticketsRes?.data ?? [];
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      } catch (err) {
        // Silent catch for unimplemented endpoint
        setTickets([]);
      }

      // Fetch FAQs
      try {
        const faqRes = await apiClient.get('/support/faqs');
        const faqData = faqRes?.data ?? [];
        setFaqs(Array.isArray(faqData) ? faqData : []);
      } catch (err) {
        // Silent catch for unimplemented endpoint
        setFaqs([]);
      }
    } catch (err) {
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  if (loading) {
    return <LoadingState title="Loading Support..." description="Fetching your tickets and resources..." />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support & Help</h1>
            <p className="text-sm text-muted-foreground mt-1">Get help, view tickets, and explore our knowledge base</p>
          </div>
          <Button onClick={() => {
            // TODO: Open create ticket dialog
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        {/* Summary Cards */}
        {tickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Tickets</p>
                  <p className="text-3xl font-bold">{openTickets}</p>
                  <p className="text-xs text-muted-foreground">Open or in progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold">{resolvedTickets}</p>
                  <p className="text-xs text-muted-foreground">Completed tickets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                  <p className="text-3xl font-bold">{tickets.length}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tickets Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
            <CardDescription>Manage and track your support requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredTickets.length === 0 ? (
              <EmptyState
                title="No Support Tickets"
                description="You haven't created any support tickets yet. Create one to get help from our team."
                action={{
                  label: 'Create First Ticket',
                  onClick: () => {
                    // TODO: Open create ticket dialog
                  },
                }}
              />
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium truncate">{ticket.title}</h3>
                          <Badge className={getPriorityColor(ticket.priority)} variant="default">
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {ticket.messages_count} messages
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            {faqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No FAQs available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.slice(0, 5).map((faq) => (
                  <div key={faq.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-sm hover:text-primary cursor-pointer transition-colors">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{faq.answer}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{faq.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful links and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Documentation</p>
                  <p className="text-xs text-muted-foreground">Read our guides and tutorials</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Video Tutorials</p>
                  <p className="text-xs text-muted-foreground">Learn by watching short videos</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Community Forum</p>
                  <p className="text-xs text-muted-foreground">Connect with other users</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4">
                <div className="text-left">
                  <p className="font-medium text-sm">Status Page</p>
                  <p className="text-xs text-muted-foreground">Check system status</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
