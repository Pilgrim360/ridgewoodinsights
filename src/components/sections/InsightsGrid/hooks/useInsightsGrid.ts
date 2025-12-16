import { useState, useMemo, useCallback, useEffect } from 'react';
import type {
  InsightsGridProps,
  UseInsightsGridReturn,
  FilterOptions,
  SortOptions,
  Insight,
  LayoutType,
  ViewMode,
  LoadingState,
  InsightCardData,
} from './types';

export function useInsightsGrid({
  insights,
  initialDisplayCount = 6,
  loadMoreIncrement = 6,
  showInfiniteScroll = false,
  showLoadMore = true,
  onLoadMore: externalOnLoadMore,
  onFilterChange,
  onSortChange,
  onSearch,
}: Omit<InsightsGridProps, 'className' | 'customStyles'>): UseInsightsGridReturn {
  // Core state
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('grid');
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({
    field: 'date',
    direction: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate displayed insights based on pagination
  const displayCount = showInfiniteScroll 
    ? initialDisplayCount + (currentPage - 1) * loadMoreIncrement
    : initialDisplayCount;

  // Memoized filtered and sorted insights
  const filteredInsights = useMemo(() => {
    let result = [...insights];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (insight) =>
          insight.title.toLowerCase().includes(query) ||
          insight.excerpt.toLowerCase().includes(query) ||
          insight.author.toLowerCase().includes(query) ||
          insight.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((insight) =>
        filters.categories!.includes(insight.category)
      );
    }

    // Apply author filter
    if (filters.authors && filters.authors.length > 0) {
      result = result.filter((insight) =>
        filters.authors!.includes(insight.author)
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      result = result.filter((insight) => {
        const insightDate = new Date(insight.date);
        return insightDate >= start && insightDate <= end;
      });
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((insight) =>
        insight.tags?.some((tag) => filters.tags!.includes(tag))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'views':
          aValue = (a as InsightCardData).views || 0;
          bValue = (b as InsightCardData).views || 0;
          break;
        case 'likes':
          aValue = (a as InsightCardData).likes || 0;
          bValue = (b as InsightCardData).likes || 0;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [insights, searchQuery, filters, sort]);

  // Slice insights for current page
  const displayedInsights = filteredInsights.slice(0, displayCount);
  
  const hasMore = displayCount < filteredInsights.length;
  const totalCount = filteredInsights.length;

  // Update filters and notify parent
  const handleSetFilters = useCallback(
    (newFilters: FilterOptions) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
      onFilterChange?.(newFilters);
    },
    [onFilterChange]
  );

  // Update sort and notify parent
  const handleSetSort = useCallback(
    (newSort: SortOptions) => {
      setSort(newSort);
      setCurrentPage(1); // Reset to first page when sort changes
      onSortChange?.(newSort);
    },
    [onSortChange]
  );

  // Update search query and notify parent
  const handleSetSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset to first page when search changes
      onSearch?.(query);
    },
    [onSearch]
  );

  // Load more functionality
  const loadMore = useCallback(() => {
    if (hasMore && loadingState !== 'loading') {
      setLoadingState('loading');
      
      // Simulate API delay if needed
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setLoadingState('idle');
        externalOnLoadMore?.();
      }, 300);
    }
  }, [hasMore, loadingState, externalOnLoadMore]);

  // Refresh functionality
  const refresh = useCallback(() => {
    setCurrentPage(1);
    setLoadingState('idle');
    // Reset filters if needed
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    if (!showInfiniteScroll) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, showInfiniteScroll]);

  return {
    // State
    filteredInsights: displayedInsights,
    loadingState,
    currentPage,
    hasMore,
    totalCount,
    
    // Filters and sorting
    filters,
    sort,
    searchQuery,
    
    // Layout state
    currentLayout,
    viewMode,
    
    // Actions
    setFilters: handleSetFilters,
    setSort: handleSetSort,
    setSearchQuery: handleSetSearchQuery,
    setCurrentPage,
    setCurrentLayout,
    setViewMode,
    loadMore,
    refresh,
  };
}