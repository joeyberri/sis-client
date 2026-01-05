'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2, Share2, ExternalLink, FolderOpen, FolderPlus, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GoogleDriveIntegrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentAdd: (documentInfo: {
    name: string;
    fileId: string;
    mimeType: string;
    webViewLink: string;
  }) => Promise<void>;
  onFolderAdd?: (folderInfo: {
    name: string;
    folderId: string;
    folderLink: string;
  }) => Promise<void>;
}

export function GoogleDriveIntegration({
  open,
  onOpenChange,
  onDocumentAdd,
  onFolderAdd,
}: GoogleDriveIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('folder');

  // Folder tab state
  const [folderUrl, setFolderUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [folderId, setFolderId] = useState('');

  // Single document tab state
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentFileId, setDocumentFileId] = useState('');

  // Extract file/folder ID from any Google Drive URL format
  const extractGoogleDriveId = (url: string): { id: string | null; type: 'file' | 'folder' | null } => {
    if (!url) return { id: null, type: null };

    // Try folder format first: /drive/folders/ID or /folders/ID
    const folderMatch = url.match(/\/(?:drive\/)?folders\/([a-zA-Z0-9-_]+)/);
    if (folderMatch) {
      return { id: folderMatch[1], type: 'folder' };
    }

    // Try file format: /file/d/ID or /d/ID or ?id=ID
    const fileMatch = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9-_]+)|[?&]id=([a-zA-Z0-9-_]+)/);
    if (fileMatch) {
      return { id: fileMatch[1] || fileMatch[2], type: 'file' };
    }

    // Last resort: look for long strings of ID characters anywhere
    const anyMatch = url.match(/([a-zA-Z0-9-_]{25,})/);
    if (anyMatch) {
      // Guess based on URL content
      if (url.includes('folders')) {
        return { id: anyMatch[1], type: 'folder' };
      } else {
        return { id: anyMatch[1], type: 'file' };
      }
    }

    return { id: null, type: null };
  };

  // Auto-populate name from title in URL or use generic names
  const generateDefaultName = (url: string, type: 'file' | 'folder'): string => {
    try {
      // Try to extract from URL title parameter or path
      const titleMatch = url.match(/[?&]title=([^&]+)/);
      if (titleMatch) {
        return decodeURIComponent(titleMatch[1]);
      }

      // Check if it's a Google Docs/Sheets/Slides link for type hints
      if (url.includes('/document/')) return 'Google Document';
      if (url.includes('/spreadsheets/')) return 'Google Spreadsheet';
      if (url.includes('/presentation/')) return 'Google Presentation';

      return type === 'folder' ? 'Google Drive Folder' : 'Google Drive Document';
    } catch {
      return type === 'folder' ? 'Google Drive Folder' : 'Google Drive Document';
    }
  };

  // Handle folder URL input with auto-extraction and name population
  const handleFolderUrlChange = (url: string) => {
    setFolderUrl(url);

    const { id, type } = extractGoogleDriveId(url);
    if (id && type === 'folder') {
      setFolderId(id);
      // Auto-populate name if empty
      if (!folderName) {
        setFolderName(generateDefaultName(url, 'folder'));
      }
    } else {
      setFolderId('');
    }
  };

  // Handle document URL input with auto-extraction and name population
  const handleDocumentUrlChange = (url: string) => {
    setDocumentUrl(url);

    const { id, type } = extractGoogleDriveId(url);
    if (id && type === 'file') {
      setDocumentFileId(id);
      // Auto-populate name if empty
      if (!documentName) {
        setDocumentName(generateDefaultName(url, 'file'));
      }
    } else {
      setDocumentFileId('');
    }
  };

  const handleAddFolder = async () => {
    setError(null);
    setSuccess(false);

    if (!folderUrl.trim()) {
      setError('Please paste a Google Drive folder link');
      return;
    }

    const { id, type } = extractGoogleDriveId(folderUrl);
    if (!id || type !== 'folder') {
      setError(
        'Could not extract folder ID from link. Make sure it\'s a valid Google Drive folder link (drive.google.com/drive/folders/...)'
      );
      return;
    }

    setIsLoading(true);
    try {
      if (onFolderAdd) {
        await onFolderAdd({
          name: folderName || generateDefaultName(folderUrl, 'folder'),
          folderId: id,
          folderLink: folderUrl,
        });
      }

      setSuccess(true);
      setFolderUrl('');
      setFolderName('');
      setFolderId('');

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDocument = async () => {
    setError(null);
    setSuccess(false);

    if (!documentUrl.trim()) {
      setError('Please paste a Google Drive document link');
      return;
    }

    const { id, type } = extractGoogleDriveId(documentUrl);
    if (!id || type !== 'file') {
      setError(
        'Could not extract file ID from link. Make sure it\'s a valid Google Drive document link'
      );
      return;
    }

    setIsLoading(true);
    try {
      let mimeType = 'application/vnd.google-apps.document';
      if (documentUrl.includes('spreadsheets')) {
        mimeType = 'application/vnd.google-apps.spreadsheet';
      } else if (documentUrl.includes('presentation')) {
        mimeType = 'application/vnd.google-apps.presentation';
      }

      await onDocumentAdd({
        name: documentName || generateDefaultName(documentUrl, 'file'),
        fileId: id,
        mimeType,
        webViewLink: documentUrl,
      });

      setSuccess(true);
      setDocumentUrl('');
      setDocumentName('');
      setDocumentFileId('');

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Google Drive Storage
          </DialogTitle>
          <DialogDescription>
            Link a Google Drive folder for automatic file access or add individual documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success State */}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Successfully linked! Closing dialog...
              </AlertDescription>
            </Alert>
          )}

          {!success && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="folder" className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Link Folder (Recommended)
                </TabsTrigger>
                <TabsTrigger value="document" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Single Document
                </TabsTrigger>
              </TabsList>

              {/* Folder Tab */}
              <TabsContent value="folder" className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Benefits of Folder Linking:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                      <li>All files in the folder are automatically accessible</li>
                      <li>New files added to the folder appear instantly</li>
                      <li>Teachers and staff can browse documents directly</li>
                      <li>No need to manually add each document</li>
                      <li>Google's sharing controls apply automatically</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-amber-900 mb-2">Setup Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
                      <li>Create a folder in Google Drive or open an existing one</li>
                      <li>Click "Share" and copy the shareable link</li>
                      <li>Paste the link below - we'll auto-populate the name</li>
                      <li>Add files to this folder from anywhere</li>
                      <li>Your team will see them automatically!</li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Google Drive Folder Link
                      {folderId && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">ID Found</span>}
                    </label>
                    <Input
                      placeholder="Paste your Google Drive folder link here"
                      value={folderUrl}
                      onChange={(e) => handleFolderUrlChange(e.target.value)}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>

                  {folderName && (
                    <div>
                      <label className="text-sm font-medium">Folder Name (Optional - auto-filled)</label>
                      <Input
                        placeholder="Optional - edit if desired"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        disabled={isLoading}
                        className="mt-1"
                      />
                    </div>
                  )}

                      
                    <p className="text-xs text-muted-foreground mt-2">
                      Example: https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J
                    </p>
                  
                </div>

                <Button
                  onClick={handleAddFolder}
                  disabled={isLoading || !folderName.trim() || !folderUrl.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Linking Folder...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Link Folder
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Document Tab */}
              <TabsContent value="document" className="space-y-4">
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Use this option to link individual documents instead of an entire folder.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      Google Drive Document Link
                      {documentFileId && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">ID Found</span>}
                    </label>
                    <Input
                      placeholder="Paste your Google Drive document link here"
                      value={documentUrl}
                      onChange={(e) => handleDocumentUrlChange(e.target.value)}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>

                  {documentName && (
                    <div>
                      <label className="text-sm font-medium">Document Name (Optional - auto-filled)</label>
                      <Input
                        placeholder="Optional - edit if desired"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        disabled={isLoading}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAddDocument}
                  disabled={isLoading || !documentUrl.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Link Document
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
