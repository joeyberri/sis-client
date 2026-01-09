'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFilterProps {
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
  className?: string;
}

export function SearchAndFilter({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters = [],
  className = ''
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = filters.filter(
    (filter) => filter.value && filter.value !== 'all'
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex flex-col gap-4 sm:flex-row'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10'
          />
          {searchValue && (
            <Button
              variant='ghost'
              size='sm'
              className='absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0'
              onClick={() => onSearchChange('')}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        {filters.length > 0 && (
          <Button
            variant='outline'
            onClick={() => setShowFilters(!showFilters)}
            className='shrink-0'
          >
            <Filter className='mr-2 h-4 w-4' />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {activeFilters.map((filter) => {
            const option = filter.options.find(
              (opt) => opt.value === filter.value
            );
            return (
              <Badge key={filter.key} variant='secondary' className='gap-1'>
                {filter.label}: {option?.label}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-4 w-4 p-0 hover:bg-transparent'
                  onClick={() => filter.onChange('all')}
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <div className='bg-muted/50 grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4'>
          {filters.map((filter) => (
            <div key={filter.key} className='space-y-2'>
              <label className='text-sm font-medium'>{filter.label}</label>
              <Select value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${filter.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
