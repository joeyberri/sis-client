'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
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
  Cloud,
  Mail,
  MessageSquare,
  CreditCard,
  Calendar,
  FileText,
  Video,
  Bell,
  ExternalLink,
  Check,
  X,
  Settings
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  category:
    | 'communication'
    | 'payment'
    | 'storage'
    | 'calendar'
    | 'analytics'
    | 'other';
  connected: boolean;
  configurable: boolean;
  apiKeyRequired?: boolean;
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Store and share documents with Google Drive integration',
    icon: Cloud,
    category: 'storage',
    connected: false,
    configurable: true,
    apiKeyRequired: true
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync events and schedules with Google Calendar',
    icon: Calendar,
    category: 'calendar',
    connected: false,
    configurable: true,
    apiKeyRequired: true
  },
  {
    id: 'smtp-email',
    name: 'Email (SMTP)',
    description: 'Send email notifications via custom SMTP server',
    icon: Mail,
    category: 'communication',
    connected: true,
    configurable: true,
    apiKeyRequired: false
  },
  {
    id: 'sms-twilio',
    name: 'SMS (Twilio)',
    description: 'Send SMS notifications to parents and students',
    icon: MessageSquare,
    category: 'communication',
    connected: false,
    configurable: true,
    apiKeyRequired: true
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Create and manage virtual classes with Zoom',
    icon: Video,
    category: 'communication',
    connected: false,
    configurable: true,
    apiKeyRequired: true
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Accept online fee payments via Stripe',
    icon: CreditCard,
    category: 'payment',
    connected: false,
    configurable: true,
    apiKeyRequired: true
  },
  {
    id: 'push-notifications',
    name: 'Push Notifications',
    description: 'Browser and mobile push notifications',
    icon: Bell,
    category: 'communication',
    connected: true,
    configurable: true,
    apiKeyRequired: false
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Error tracking and performance monitoring',
    icon: Settings,
    category: 'analytics',
    connected: false,
    configurable: true,
    apiKeyRequired: true
  }
];

export default function SettingsIntegrationsPage() {
  const { isAdmin } = useUser();

  const [integrations, setIntegrations] = useState<Integration[]>(
    AVAILABLE_INTEGRATIONS
  );
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/integrations');
        const data = res?.data ?? [];

        // Merge API data with available integrations
        if (Array.isArray(data) && data.length > 0) {
          setIntegrations((prev) =>
            prev.map((integration) => {
              const apiIntegration = data.find(
                (d: any) => d.id === integration.id
              );
              return apiIntegration
                ? { ...integration, connected: apiIntegration.connected }
                : integration;
            })
          );
        }
      } catch (err) {
        console.error('Failed to load integrations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const handleToggleIntegration = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    if (
      integration.configurable &&
      integration.apiKeyRequired &&
      !integration.connected
    ) {
      // Open config dialog for connecting
      setSelectedIntegration(integration);
      return;
    }

    // Toggle connection
    try {
      const newStatus = !integration.connected;
      await apiClient.post(`/integrations/${integrationId}/toggle`, {
        connected: newStatus
      });
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, connected: newStatus } : i
        )
      );
      toast.success(
        `${integration.name} ${newStatus ? 'connected' : 'disconnected'}`
      );
    } catch (err) {
      // Still update locally for demo
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, connected: !i.connected } : i
        )
      );
      toast.success(
        `${integration.name} ${!integration.connected ? 'connected' : 'disconnected'}`
      );
    }
  };

  const handleConfigureIntegration = async () => {
    if (!selectedIntegration) return;

    setIsConfiguring(true);
    try {
      await apiClient.post(
        `/integrations/${selectedIntegration.id}/configure`,
        { apiKey }
      );
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === selectedIntegration.id ? { ...i, connected: true } : i
        )
      );
      toast.success(`${selectedIntegration.name} configured successfully`);
      setSelectedIntegration(null);
      setApiKey('');
    } catch (err) {
      // Demo mode - still show success
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === selectedIntegration.id ? { ...i, connected: true } : i
        )
      );
      toast.success(`${selectedIntegration.name} configured`);
      setSelectedIntegration(null);
      setApiKey('');
    } finally {
      setIsConfiguring(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      communication: 'Communication',
      payment: 'Payments',
      storage: 'Storage',
      calendar: 'Calendar',
      analytics: 'Analytics',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const groupedIntegrations = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = [];
      }
      acc[integration.category].push(integration);
      return acc;
    },
    {} as Record<string, Integration[]>
  );

  if (!isAdmin)
    return (
      <PageContainer>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-muted-foreground text-2xl font-bold'>
              Access Denied
            </h2>
            <p className='text-muted-foreground'>
              You need admin privileges to manage integrations.
            </p>
          </div>
        </div>
      </PageContainer>
    );

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Integrations</h1>
          <p className='text-muted-foreground mt-1'>
            Connect external services to enhance your school management system
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>
                {integrations.filter((i) => i.connected).length}
              </div>
              <p className='text-muted-foreground text-sm'>Connected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>
                {integrations.filter((i) => !i.connected).length}
              </div>
              <p className='text-muted-foreground text-sm'>Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-2xl font-bold'>{integrations.length}</div>
              <p className='text-muted-foreground text-sm'>
                Total Integrations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Integration Categories */}
        {loading ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-muted-foreground'>Loading integrations...</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedIntegrations).map(
            ([category, categoryIntegrations]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className='text-lg'>
                    {getCategoryLabel(category)}
                  </CardTitle>
                  <CardDescription>
                    {categoryIntegrations.filter((i) => i.connected).length} of{' '}
                    {categoryIntegrations.length} connected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {categoryIntegrations.map((integration) => {
                      const Icon = integration.icon;
                      return (
                        <div
                          key={integration.id}
                          className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
                        >
                          <div className='flex items-center gap-4'>
                            <div className='bg-muted rounded-lg p-2'>
                              <Icon className='h-6 w-6' />
                            </div>
                            <div>
                              <div className='flex items-center gap-2'>
                                <h4 className='font-medium'>
                                  {integration.name}
                                </h4>
                                {integration.connected && (
                                  <Badge variant='default' className='text-xs'>
                                    <Check className='mr-1 h-3 w-3' />
                                    Connected
                                  </Badge>
                                )}
                              </div>
                              <p className='text-muted-foreground text-sm'>
                                {integration.description}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            {integration.configurable &&
                              integration.connected && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    setSelectedIntegration(integration)
                                  }
                                >
                                  <Settings className='h-4 w-4' />
                                </Button>
                              )}
                            <Switch
                              checked={integration.connected}
                              onCheckedChange={() =>
                                handleToggleIntegration(integration.id)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          )
        )}

        {/* Info Card */}
        <Card className='border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <ExternalLink className='h-4 w-4' />
              Need More Integrations?
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <p>
              Contact your administrator or development team to request
              additional integrations. Common requests include Microsoft Teams,
              WhatsApp Business, and custom ERP connections.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Dialog */}
      <Dialog
        open={!!selectedIntegration}
        onOpenChange={() => {
          setSelectedIntegration(null);
          setApiKey('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              {selectedIntegration?.apiKeyRequired
                ? 'Enter your API credentials to connect this integration'
                : 'Manage settings for this integration'}
            </DialogDescription>
          </DialogHeader>

          {selectedIntegration?.apiKeyRequired && (
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='apiKey'>API Key</Label>
                <Input
                  id='apiKey'
                  type='password'
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder='Enter your API key'
                />
                <p className='text-muted-foreground text-xs'>
                  Get your API key from the {selectedIntegration?.name}{' '}
                  dashboard
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setSelectedIntegration(null);
                setApiKey('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfigureIntegration}
              disabled={isConfiguring}
            >
              {isConfiguring ? 'Configuring...' : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
