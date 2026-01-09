'use client';

import { ReactNode, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { PageHeader } from './page-header';
import { SearchAndFilter, FilterOption } from './search-and-filter';
import { DataTable } from './data-table';
import { ColumnDef } from '@tanstack/react-table';

interface DataManagementPageProps<TData> {
  title: string;
  description?: string;
  icon?: string; // Add icon support
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };

  // Search & Filter
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }>;

  // Actions
  showAddButton?: boolean;
  showBulkUpload?: boolean;
  onAdd?: () => void;
  onBulkUpload?: () => void;
  addButtonLabel?: string;
  addButton?: {
    label: string;
    icon?: any;
    onClick: () => void;
  };
  customActions?: ReactNode;

  // Table options
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  pageSize?: number;

  // Stats
  statsComponent?: ReactNode;
}

export function DataManagementPage<TData>({
  title,
  description,
  icon,
  data,
  columns,
  loading = false,
  error,
  onRetry,
  emptyMessage,
  emptyState,

  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters = [],

  showAddButton = false,
  showBulkUpload = false,
  onAdd,
  onBulkUpload,
  addButtonLabel,
  addButton,
  customActions,

  enableColumnVisibility = true,
  enablePagination = true,
  pageSize = 10,
  statsComponent
}: DataManagementPageProps<TData>) {
  return (
    <PageContainer>
      <div className='space-y-6'>
        <PageHeader
          title={title}
          description={description}
          icon={icon}
          showAddButton={showAddButton}
          showBulkUpload={showBulkUpload}
          onAdd={onAdd}
          onBulkUpload={onBulkUpload}
          addButtonLabel={addButtonLabel}
          addButton={addButton}
          actions={customActions}
        />

        {statsComponent}

        <SearchAndFilter
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={filters}
        />

        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          error={error}
          onRetry={onRetry}
          emptyMessage={emptyMessage || `No ${title.toLowerCase()} found`}
          emptyState={emptyState}
          enableColumnVisibility={enableColumnVisibility}
          enablePagination={enablePagination}
          pageSize={pageSize}
        />
      </div>
    </PageContainer>
  );
}
