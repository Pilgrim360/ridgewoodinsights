/**
 * FilterBar Component
 * Search and filter controls for posts list
 * Includes: search input, status dropdown, category dropdown, "Create New" button
 */

'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PostFilters, CategoryData } from '@/types/admin';
import { Search, Plus } from 'lucide-react';

export interface FilterBarProps {
  filters: PostFilters;
  categories: CategoryData[];
  onFilterChange: (filters: PostFilters) => void;
  isLoading?: boolean;
}

export function FilterBar({
  filters,
  categories,
  onFilterChange,
  isLoading = false,
}: FilterBarProps) {
  // Debounce search input to avoid excessive API calls
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search (500ms)
      searchTimeoutRef.current = setTimeout(() => {
        onFilterChange({
          ...filters,
          search: value || undefined,
          page: 1, // Reset to first page on filter change
        });
      }, 500);
    },
    [filters, onFilterChange]
  );

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        ...filters,
        status: e.target.value as PostFilters['status'],
        page: 1,
      });
    },
    [filters, onFilterChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFilterChange({
        ...filters,
        category_id: value || undefined,
        page: 1,
      });
    },
    [filters, onFilterChange]
  );

  return (
    <div className="mb-6 space-y-4">
      {/* Header with title and create button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Posts</h1>
        <Link
          href="/admin/posts/new"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary text-white font-medium',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Plus size={18} />
          Create New
        </Link>
      </div>

      {/* Filters container */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-surface"
          />
          <input
            type="text"
            placeholder="Search posts by title..."
            defaultValue={filters.search || ''}
            onChange={handleSearchChange}
            disabled={isLoading}
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg',
              'border border-surface',
              'bg-white text-text text-sm',
              'placeholder:text-surface/60',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'disabled:bg-background disabled:opacity-50'
            )}
            aria-label="Search posts by title"
          />
        </div>

        {/* Status dropdown */}
        <select
          value={filters.status || 'all'}
          onChange={handleStatusChange}
          disabled={isLoading}
          className={cn(
            'px-3 py-2 rounded-lg md:min-w-[150px]',
            'border border-surface',
            'bg-white text-text text-sm font-medium',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'disabled:bg-background disabled:opacity-50',
            'cursor-pointer'
          )}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>

        {/* Category dropdown */}
        <select
          value={filters.category_id || ''}
          onChange={handleCategoryChange}
          disabled={isLoading}
          className={cn(
            'px-3 py-2 rounded-lg md:min-w-[150px]',
            'border border-surface',
            'bg-white text-text text-sm font-medium',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'disabled:bg-background disabled:opacity-50',
            'cursor-pointer'
          )}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
