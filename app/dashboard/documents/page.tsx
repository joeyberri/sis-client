'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@/context/user/user-context';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/lib/api/client';
import { EmptyState, ErrorState, LoadingState } from '@/components/empty-state';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StorageStats {
  quotaBytes: string;
  usedBytes: string;
  availableBytes: string;
  quotaFormatted: string;
  usedFormatted: string;
  availableFormatted: string;
  usedPercentage: number;
  fileCount: number;
  tier: string;
}

interface FileData {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  sizeBytes: string;
  sizeFormatted: string;
  publicUrl: string;
  createdAt: string;
  isPublic: boolean;
}

export default function DocumentsPage() {
  const { isAdmin } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileData[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'solar:file-text-duotone';
    if (mimeType.includes('image')) return 'solar:gallery-duotone';
    if (mimeType.includes('video')) return 'solar:videocamera-record-duotone';
    if (mimeType.includes('audio')) return 'solar:music-note-duotone';
    if (mimeType.includes('zip') || mimeType.includes('rar'))
      return 'solar:archive-duotone';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
      return 'solar:table-list-duotone';
    return 'solar:document-duotone';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [filesRes, statsRes] = await Promise.all([
        apiClient.getFiles(),
        apiClient.getStorageStats()
      ]);
      setFiles(filesRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error('Failed to load documents', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await apiClient.uploadFile(file);
      toast.success('File uploaded successfully');
      fetchData(); // Refresh list and stats
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await apiClient.deleteFile(id);
      toast.success('File deleted');
      setFiles(files.filter((f) => f.id !== id));
      fetchData(); // Refresh stats
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete file');
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchSearch = (file.originalName || file.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  if (loading) return <LoadingState />;

  return (
    <PageContainer scrollable>
      <div className='space-y-6'>
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              System Storage
            </h1>
            <p className='text-muted-foreground'>
              Manage your school documents and media with Supabase Cloud
              Storage.
            </p>
          </div>
          <div className='flex w-full gap-2 md:w-auto'>
            <input
              type='file'
              className='hidden'
              ref={fileInputRef}
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className='w-full md:w-auto'
            >
              {uploading ? (
                <Icon
                  icon='solar:spinner-duotone'
                  className='mr-2 h-4 w-4 animate-spin'
                />
              ) : (
                <Icon
                  icon='solar:upload-minimalistic-duotone'
                  className='mr-2 h-4 w-4'
                />
              )}
              Upload Document
            </Button>
          </div>
        </div>

        {/* Storage Overview Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Card className='from-primary/5 via-background to-background overflow-hidden border-none bg-gradient-to-br shadow-sm md:col-span-2'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg'>Cloud Storage Usage</CardTitle>
                  <CardDescription>
                    Your current quota and usage statistics
                  </CardDescription>
                </div>
                <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                  <Icon
                    icon='solar:cloud-storage-duotone'
                    className='text-primary h-6 w-6'
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='mb-1 flex justify-between text-sm'>
                  <span className='font-medium'>
                    {stats?.usedFormatted || '0 B'} used
                  </span>
                  <span className='text-muted-foreground'>
                    of {stats?.quotaFormatted || '1 GB'}
                  </span>
                </div>
                <Progress value={stats?.usedPercentage || 0} className='h-2' />
                <div className='grid grid-cols-2 gap-4 pt-2 md:grid-cols-4'>
                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-xs'>Files</p>
                    <p className='font-semibold'>{stats?.fileCount || 0}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-muted-foreground text-xs'>Tier</p>
                    <Badge variant='secondary' className='capitalize'>
                      {stats?.tier || 'Free'}
                    </Badge>
                  </div>
                  <div className='space-y-1 text-right md:text-left'>
                    <p className='text-muted-foreground text-xs'>Available</p>
                    <p className='font-semibold'>
                      {stats?.availableFormatted || '1.0 GB'}
                    </p>
                  </div>
                  <div className='space-y-1 text-right'>
                    <p className='text-muted-foreground text-xs'>Provider</p>
                    <div className='flex items-center justify-end gap-1 font-medium text-emerald-600'>
                      <Icon icon='solar:globus-duotone' className='h-4 w-4' />
                      Supabase
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none bg-amber-50/30 shadow-sm dark:bg-amber-500/5'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Icon
                  icon='solar:medal-star-duotone'
                  className='h-5 w-5 text-amber-500'
                />
                Storage Upgrade
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground text-sm'>
                Need more space for high-resolution media or school archives?
              </p>
              <Button
                variant='outline'
                className='w-full border-amber-200 hover:bg-amber-50 dark:border-amber-900/50'
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* File Browser */}
        <Card className='border-none shadow-sm'>
          <CardHeader>
            <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
              <div>
                <CardTitle>Documents & Files</CardTitle>
                <CardDescription>
                  All school reports, templates, and student records
                </CardDescription>
              </div>
              <div className='relative w-full md:w-72'>
                <Icon
                  icon='solar:magnifer-duotone'
                  className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2'
                />
                <Input
                  placeholder='Search files...'
                  className='pl-9'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFiles.length === 0 ? (
              <EmptyState
                title='No documents found'
                description={
                  searchQuery
                    ? 'No files match your search criteria.'
                    : 'Start by uploading your first school document.'
                }
                action={
                  <Button
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon
                      icon='solar:upload-minimalistic-duotone'
                      className='mr-2 h-4 w-4'
                    />
                    Upload Now
                  </Button>
                }
              />
            ) : (
              <div className='border-muted/50 overflow-hidden rounded-md border'>
                <Table>
                  <TableHeader className='bg-muted/30'>
                    <TableRow>
                      <TableHead className='w-[40%]'>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow
                        key={file.id}
                        className='hover:bg-muted/20 transition-colors'
                      >
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div className='bg-muted/50 flex h-8 w-8 shrink-0 items-center justify-center rounded'>
                              <Icon
                                icon={getFileIcon(file.mimeType)}
                                className='text-primary h-5 w-5'
                              />
                            </div>
                            <span className='max-w-[200px] truncate font-medium md:max-w-xs'>
                              {file.originalName || file.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className='text-[10px] font-semibold tracking-wider uppercase opacity-70'
                          >
                            {file.mimeType.split('/')[1] || 'FILE'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {file.sizeFormatted}
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                              >
                                <Icon
                                  icon='solar:menu-dots-bold'
                                  className='h-4 w-4'
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-40'>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(file.publicUrl, '_blank')
                                }
                              >
                                <Icon
                                  icon='solar:eye-duotone'
                                  className='mr-2 h-4 w-4'
                                />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={file.publicUrl}
                                  download={file.originalName}
                                >
                                  <Icon
                                    icon='solar:download-minimalistic-duotone'
                                    className='mr-2 h-4 w-4'
                                  />
                                  Download
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className='text-destructive focus:text-destructive'
                                onClick={() => handleDelete(file.id)}
                              >
                                <Icon
                                  icon='solar:trash-bin-trash-duotone'
                                  className='mr-2 h-4 w-4'
                                />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
