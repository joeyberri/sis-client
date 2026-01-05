'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  RefreshCw,
  Link as LinkIcon,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface GoogleDriveStatus {
  linked: boolean;
  email?: string;
  linkedAt?: string;
  lastSyncedAt?: string;
  cachedFileCount?: number;
}

export function GoogleDriveStatusCard() {
  const [status, setStatus] = useState<GoogleDriveStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch current status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/google-drive/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch status';
      setError(message);
      console.error('Fetch status error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth URL from server
      const response = await fetch('/auth/google/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }

      const { authUrl } = await response.json();

      // Redirect to Google
      window.location.href = authUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authorization failed';
      setError(message);
      console.error('Authorize error:', err);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch('/api/google-drive/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync files');
      }

      const result = await response.json();
      toast({
        title: 'Success',
        description: result.message,
      });

      // Refresh status
      await fetchStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setError(message);
      console.error('Sync error:', err);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleUnlink = async () => {
    if (!window.confirm('Are you sure you want to unlink Google Drive? Staff will no longer have access to synced documents.')) {
      return;
    }

    try {
      setUnlinking(true);
      setError(null);

      const response = await fetch('/api/google-drive/unlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unlink Google Drive');
      }

      toast({
        title: 'Success',
        description: 'Google Drive unlinked successfully',
      });

      // Refresh status
      await fetchStatus();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unlink failed';
      setError(message);
      console.error('Unlink error:', err);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setUnlinking(false);
    }
  };

  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Google Drive Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Google Drive Integration
        </CardTitle>
        <CardDescription>
          Manage your school's Google Drive connection and file synchronization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!status?.linked ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Google Drive is not linked. Click the button below to authorize access and enable automatic file synchronization.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authorizing...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Link Google Drive
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-900">Google Drive Linked</p>
                <p className="text-sm text-green-700 break-all">{status.email}</p>
                {status.linkedAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Linked on {new Date(status.linkedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {status.lastSyncedAt && (
              <div className="text-sm text-muted-foreground">
                <p>Last synced: {new Date(status.lastSyncedAt).toLocaleString()}</p>
                {status.cachedFileCount !== undefined && (
                  <p>{status.cachedFileCount} files in sync</p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSync}
                disabled={syncing || unlinking}
                variant="outline"
                className="flex-1"
              >
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Files
                  </>
                )}
              </Button>
              <Button
                onClick={handleUnlink}
                disabled={unlinking || syncing}
                variant="destructive"
                className="flex-1"
              >
                {unlinking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unlinking...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Unlink
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
