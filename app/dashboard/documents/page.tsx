'use client';

import { useEffect, useState, useRef } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Upload, FileText, Download, Trash2, MoreHorizontal, Plus, File, Share2 } from 'lucide-react';
import { GoogleDriveIntegration } from '@/components/google-drive-integration';
import { GoogleDriveStatusCard } from '@/components/google-drive-status-card';

interface Document {
  id: string;
  name: string;
  type: 'Policy' | 'Template' | 'Report' | 'Invoice' | 'Certificate' | 'Other';
  size: number; // in bytes
  uploadDate: string;
  uploadedBy: string;
  category: string; // e.g., "Admissions", "Academic", "Financial", etc.
}

export default function DocumentsPage() {
  const { isAdmin } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);

  const getFileTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      'Policy': 'bg-blue-100 text-blue-700',
      'Template': 'bg-green-100 text-green-700',
      'Report': 'bg-purple-100 text-purple-700',
      'Invoice': 'bg-orange-100 text-orange-700',
      'Certificate': 'bg-yellow-100 text-yellow-700',
      'Other': 'bg-gray-100 text-gray-700',
    };
    return variants[type] || variants['Other'];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocs = docs.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterType === 'all' || doc.type === filterType;
    return matchSearch && matchFilter;
  });

  const totalSize = docs.reduce((sum, doc) => sum + (doc.size || 0), 0);
  const categories = Array.from(new Set(docs.map((d: any) => d.category))).length;

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getDocuments();
        setDocs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load documents', err);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);

    try {
      setLoading(true);
      // Use fetch to send multipart with tenant and auth headers
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = `${apiBase}/documents`;
      const headers: Record<string,string> = {};
      try {
        const token = (apiClient as any).currentToken;
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // ignore
      }
      try {
        const tenant = typeof window !== 'undefined' ? window.localStorage.getItem('X-Tenant-ID') || 'default' : 'default';
        headers['X-Tenant-ID'] = tenant;
      } catch (e) {
        // ignore
      }

      const res = await fetch(url, { method: 'POST', body: fd, headers });
      if (!res.ok) throw new Error('Upload failed');
      // Refresh list after upload
      const updated = await apiClient.getDocuments();
      setDocs(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Document upload failed', err);
      setError('Document upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDriveAdd = async (documentInfo: {
    name: string;
    fileId: string;
    mimeType: string;
    webViewLink: string;
  }) => {
    try {
      setLoading(true);
      // Send Google Drive document metadata to API
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = `${apiBase}/documents/google-drive`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      try {
        const token = (apiClient as any).currentToken;
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // ignore
      }
      try {
        const tenant = typeof window !== 'undefined' ? window.localStorage.getItem('X-Tenant-ID') || 'default' : 'default';
        headers['X-Tenant-ID'] = tenant;
      } catch (e) {
        // ignore
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: documentInfo.name,
          fileId: documentInfo.fileId,
          mimeType: documentInfo.mimeType,
          webViewLink: documentInfo.webViewLink,
          type: 'Other',
          category: 'Google Drive',
        }),
      });

      if (!res.ok) throw new Error('Failed to link Google Drive document');
      // Refresh list after adding
      const updated = await apiClient.getDocuments();
      setDocs(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Google Drive document linking failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDriveFolderAdd = async (folderInfo: {
    name: string;
    folderId: string;
    folderLink: string;
  }) => {
    try {
      setLoading(true);
      // Send Google Drive folder metadata to API
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = `${apiBase}/documents/google-drive-folder`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      try {
        const token = (apiClient as any).currentToken;
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // ignore
      }
      try {
        const tenant = typeof window !== 'undefined' ? window.localStorage.getItem('X-Tenant-ID') || 'default' : 'default';
        headers['X-Tenant-ID'] = tenant;
      } catch (e) {
        // ignore
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: folderInfo.name,
          folderId: folderInfo.folderId,
          folderLink: folderInfo.folderLink,
        }),
      });

      if (!res.ok) throw new Error('Failed to link Google Drive folder');

      // Refresh list after adding
      const updated = await apiClient.getDocuments();
      setDocs(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Google Drive folder linking failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return (
    <PageContainer>
      <ErrorState 
        title="Access Denied" 
        description="You don't have permission to view documents."
        onRetry={() => window.location.reload()}
      />
    </PageContainer>
  );

  if (loading && docs.length === 0) return <LoadingState title="Loading Documents..." description="Fetching document library..." />;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage shared templates, policies, and documents</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button onClick={() => setIsGoogleDriveOpen(true)} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" /> Link Google Drive (Legacy)
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Plus className="h-4 w-4" /> Upload Document
              </Button>
            </div>
          )}
        </div>

        {/* Google Drive Status Card - Admin Only */}
        {isAdmin && (
          <GoogleDriveStatusCard />
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-3xl font-bold">{docs.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-3xl font-bold">{formatFileSize(totalSize)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold">{categories}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Document Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-col md:flex-row">
              <Input
                placeholder="Search documents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-1 flex-wrap">
                {['all', 'Policy', 'Template', 'Report', 'Invoice', 'Certificate'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Documents Table */}
            {filteredDocs.length === 0 ? (
              error && docs.length === 0 ? (
                <ErrorState 
                  title="Failed to Load Documents" 
                  description={error}
                  onRetry={() => window.location.reload()}
                />
              ) : (
                <EmptyState 
                  title="No documents found" 
                  description={searchQuery ? "Try adjusting your search criteria" : "Start by uploading a document"}
                />
              )
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getFileTypeBadge(doc.type)}>{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>{doc.uploadedBy}</TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" /> Delete
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

        {/* Hidden File Input */}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={onFileChange} 
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" 
        />
      </div>

      {/* Google Drive Integration Dialog */}
      <GoogleDriveIntegration
        open={isGoogleDriveOpen}
        onOpenChange={setIsGoogleDriveOpen}
        onDocumentAdd={handleGoogleDriveAdd}
        onFolderAdd={handleGoogleDriveFolderAdd}
      />
    </PageContainer>
  );
}
