'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import type { FilterOptions, SortOptions } from '../../types';

interface FilterBarProps {
  insights: Insight[];
  filters: FilterOptions;
  sort: SortOptions;
  searchQuery: string;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  onSearchChange: (query: string) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  insights,
  filters,
  sort,
  searchQuery,
  onFiltersChange,
  onSortChange,
  onSearchChange,
  showFilters = true,
  showSearch = true,
  showSort = true,
  className,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'authors' | 'date'>('categories');

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const categories = [...new Set(insights.map(insight => insight.category))].sort();
    const authors = [...new Set(insights.map(insight => insight.author))].sort();
    
    return { categories, authors };
  }, [insights]);

  // Date range options
  const dateOptions = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 3 months', value: 90 },
    { label: 'Last 6 months', value: 180 },
    { label: 'Last year', value: 365 },
  ];

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleAuthorToggle = (author: string) => {
    const newAuthors = filters.authors?.includes(author)
      ? filters.authors.filter(a => a !== author)
      : [...(filters.authors || []), author];
    
    onFiltersChange({ ...filters, authors: newAuthors });
  };

  const handleDateRangeSelect = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    
    onFiltersChange({ 
      ...filters, 
      dateRange: { start, end } 
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.categories?.length || filters.authors?.length || filters.dateRange || searchQuery.trim();

  return (
    <div className={className}>
      {/* Search and Main Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        {/* Search Bar */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/60" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2 border border-surface rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                placeholder:text-text/60 text-text bg-white
              "
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {/* Sort Dropdown */}
          {showSort && (
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [SortOptions['field'], SortOptions['direction']];
                onSortChange({ field, direction });
              }}
              className="
                px-3 py-2 border border-surface rounded-lg bg-white text-text
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              "
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="author-asc">Author A-Z</option>
              <option value="author-desc">Author Z-A</option>
            </select>
          )}

          {/* Filter Toggle */}
          {showFilters && (
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`
                px-4 py-2 border rounded-lg font-medium transition-all duration-200
                flex items-center gap-2
                ${isFilterOpen || hasActiveFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text border-surface hover:border-primary/50'
                }
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              `}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {[filters.categories?.length, filters.authors?.length, filters.dateRange ? 1 : 0]
                    .filter(Boolean)
                    .reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text/60">Active filters:</span>
              
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Search: “{searchQuery}”
                  <button
                    onClick={() => onSearchChange('')}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {filters.categories?.map(category => (
                <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  {category}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {filters.authors?.map(author => (
                <span key={author} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  {author}
                  <button
                    onClick={() => handleAuthorToggle(author)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {filters.dateRange && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  Date Range
                  <button
                    onClick={() => onFiltersChange({ ...filters, dateRange: undefined })}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="text-sm text-text/60 hover:text-primary underline"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-surface rounded-lg p-6 mb-6"
          >
            {/* Filter Tabs */}
            <div className="flex border-b border-surface mb-6">
              {(['categories', 'authors', 'date'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2 font-medium capitalize transition-colors duration-200
                    border-b-2 -mb-px
                    ${activeTab === tab
                      ? 'text-primary border-primary'
                      : 'text-text/60 border-transparent hover:text-primary hover:border-primary/30'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter Content */}
            <div className="space-y-4">
              {activeTab === 'categories' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-text">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-all duration-200
                          ${filters.categories?.includes(category)
                            ? 'bg-primary text-white'
                            : 'bg-surface text-text hover:bg-primary/10'
                          }
                        `}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'authors' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-text">Authors</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.authors.map(author => (
                      <button
                        key={author}
                        onClick={() => handleAuthorToggle(author)}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-all duration-200
                          ${filters.authors?.includes(author)
                            ? 'bg-primary text-white'
                            : 'bg-surface text-text hover:bg-primary/10'
                          }
                        `}
                      >
                        {author}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'date' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-text">Date Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {dateOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleDateRangeSelect(option.value)}
                        className={`
                          px-3 py-1 rounded-full text-sm transition-all duration-200
                          ${filters.dateRange
                            ? 'bg-primary text-white'
                            : 'bg-surface text-text hover:bg-primary/10'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};