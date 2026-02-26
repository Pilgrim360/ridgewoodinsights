'use client';

import React, { useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostFilters, CategoryData } from '@/types/admin';

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
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.status && filters.status !== 'all') ||
    Boolean(filters.category_id);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onFilterChange({ ...filters, search: value || undefined, page: 1 });
      }, 400);
    },
    [filters, onFilterChange]
  );

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
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
      onFilterChange({ ...filters, category_id: e.target.value || undefined, page: 1 });
    },
    [filters, onFilterChange]
  );

  const handleClearFilters = useCallback(() => {
    onFilterChange({ search: undefined, status: 'all', category_id: undefined, page: 1 });
  }, [onFilterChange]);

  const selectClass = cn(
    'px-3 py-2 rounded-lg md:min-w-[140px]',
    'border border-surface bg-white text-text text-sm font-medium',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'disabled:bg-background disabled:opacity-50 cursor-pointer',
    'transition-colors'
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary">Posts</h1>
        <Link
          href="/admin/posts/new"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary text-white text-sm font-semibold',
            'hover:bg-primary-dark transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          )}
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            type="text"
            placeholder="Search posts by title…"
            defaultValue={filters.search ?? ''}
            onChange={handleSearchChange}
            disabled={isLoading}
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-lg text-sm',
              'border border-surface bg-white text-text',
              'placeholder:text-text/40',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              'disabled:bg-background disabled:opacity-50',
              'transition-colors'
            )}
            aria-label="Search posts by title"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status ?? 'all'}
          onChange={handleStatusChange}
          disabled={isLoading}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>

        {/* Category filter */}
        <select
          value={filters.category_id ?? ''}
          onChange={handleCategoryChange}
          disabled={isLoading}
          className={selectClass}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
              'text-text/60 hover:text-secondary bg-surface/50 hover:bg-surface',
              'transition-colors border border-transparent hover:border-surface',
              'whitespace-nowrap'
            )}
            aria-label="Clear all filters"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        {/* Active filter indicator */}
        {hasActiveFilters && (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtered
          </span>
        )}
      </div>
    </div>
  );
}
