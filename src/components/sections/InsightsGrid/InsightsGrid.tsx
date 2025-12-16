'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInsightsGrid } from './hooks/useInsightsGrid';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import type { InsightsGridProps, LayoutType, ViewMode, LayoutConfig } from './types';
import { GridLayout } from './components/layouts/GridLayout';
import { ListLayout } from './components/layouts/ListLayout';
import { CarouselLayout } from './components/layouts/CarouselLayout';
import { MasonryLayout } from './components/layouts/MasonryLayout';
import { FeaturedLayout } from './components/layouts/FeaturedLayout';
import { FilterBar } from './components/FilterBar';
import { LayoutSelector } from './components/LayoutSelector';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorDisplay } from './components/ErrorBoundary';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

// Default responsive configurations
const defaultLayoutConfigs = {
  grid: {
    mobile: { columns: 1, spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
    tablet: { columns: 2, spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
    desktop: { columns: 3, spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
  },
  list: {
    mobile: { spacing: 'md', cardSize: 'compact', showImages: true, showExcerpt: true, showMetadata: true },
    tablet: { spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
    desktop: { spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
  },
  carousel: {
    mobile: { spacing: 'md', cardSize: 'compact', showImages: true, showExcerpt: false, showMetadata: true },
    tablet: { spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
    desktop: { spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
  },
  masonry: {
    mobile: { spacing: 'md', cardSize: 'compact', showImages: true, showExcerpt: true, showMetadata: true },
    tablet: { spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
    desktop: { spacing: 'md', cardSize: 'default', showImages: true, showExcerpt: true, showMetadata: true },
  },
  featured: {
    mobile: { spacing: 'lg', cardSize: 'featured', showImages: true, showExcerpt: true, showMetadata: true },
    tablet: { spacing: 'lg', cardSize: 'featured', showImages: true, showExcerpt: true, showMetadata: true },
    desktop: { spacing: 'lg', cardSize: 'featured', showImages: true, showExcerpt: true, showMetadata: true },
  },
};

const backgroundVariants = {
  default: 'bg-background',
  muted: 'bg-surface/20',
  white: 'bg-white',
  glass: 'bg-white/80 backdrop-blur-sm',
};

export const InsightsGrid: React.FC<InsightsGridProps> = ({
  // Data
  insights,
  
  // Layout options
  layout = 'grid',
  responsive = true,
  viewMode = 'default',
  
  // Display options
  showFilters = false,
  showSearch = false,
  showLoadMore = true,
  showInfiniteScroll = false,
  showPagination = false,
  
  // Performance options
  initialDisplayCount = 6,
  loadMoreIncrement = 6,
  enableVirtualization = false,
  enableLazyLoading = true,
  
  // Styling options
  backgroundVariant = 'white',
  showHeader = true,
  title,
  subtitle,
  
  // Interaction options
  onInsightClick,
  onInsightLike,
  onInsightShare,
  onFilterChange,
  onSortChange,
  onLoadMore,
  onSearch,
  
  // Custom styling
  className,
  customStyles,
}) => {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>(layout);
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(viewMode);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use the custom hook for state management
  const {
    filteredInsights,
    loadingState,
    hasMore,
    totalCount,
    filters,
    sort,
    searchQuery,
    setFilters,
    setSort,
    setSearchQuery,
    loadMore,
    refresh,
  } = useInsightsGrid({
    insights,
    initialDisplayCount,
    loadMoreIncrement,
    showInfiniteScroll,
    showLoadMore,
    onLoadMore,
    onFilterChange,
    onSortChange,
    onSearch,
  });

  // Infinite scroll hook
  const {
    ref: infiniteScrollRef,
    isLoading: isInfiniteLoading,
    hasNextPage,
    error: infiniteScrollError,
  } = useInfiniteScroll({
    disabled: !showInfiniteScroll || !hasMore || loadingState === 'loading',
    onLoadMore: loadMore,
    hasMore,
  });

  // Get responsive layout configuration
  const getCurrentConfig = (): LayoutConfig => {
    const configs = defaultLayoutConfigs[currentLayout];
    
    if (!responsive) return configs.desktop;
    
    // Determine current breakpoint
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return configs.mobile;
      if (width < 1024) return configs.tablet;
    }
    
    return configs.desktop;
  };

  const currentConfig = getCurrentConfig();

  // Layout renderer component
  const renderLayout = () => {
    const commonProps = {
      insights: filteredInsights,
      config: currentConfig,
      viewMode: currentViewMode,
      loadingState,
      onInsightClick,
      onLoadMore: showLoadMore ? loadMore : undefined,
      hasMore,
    };

    switch (currentLayout) {
      case 'grid':
        return <GridLayout {...commonProps} />;
      case 'list':
        return <ListLayout {...commonProps} />;
      case 'carousel':
        return <CarouselLayout {...commonProps} config={{ autoplay: false, showDots: true, showArrows: true }} />;
      case 'masonry':
        return <MasonryLayout {...commonProps} config={{ columns: currentConfig.columns || 3 }} />;
      case 'featured':
        return <FeaturedLayout {...commonProps} />;
      default:
        return <GridLayout {...commonProps} />;
    }
  };

  const handleLayoutChange = (newLayout: LayoutType) => {
    setCurrentLayout(newLayout);
  };

  const handleViewModeChange = (newViewMode: ViewMode) => {
    setCurrentViewMode(newViewMode);
  };

  return (
    <Section
      bg={backgroundVariant}
      className={`
        py-16 md:py-24 transition-all duration-500
        ${className || ''}
      `}
      style={customStyles}
      aria-labelledby={showHeader && title ? 'insights-grid-title' : undefined}
    >
      <Container maxWidth="xl">
        {/* Header */}
        {showHeader && (title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {subtitle && (
              <Text
                as="p"
                className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-4"
              >
                {subtitle}
              </Text>
            )}
            {title && (
              <Heading
                as={2}
                id="insights-grid-title"
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4"
              >
                {title}
              </Heading>
            )}
            
            {totalCount > 0 && (
              <Text as="p" className="text-text/60 text-lg">
                {totalCount} {totalCount === 1 ? 'insight' : 'insights'} available
              </Text>
            )}
          </motion.div>
        )}

        {/* Controls Bar */}
        {(showFilters || showSearch || (layout !== 'grid')) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
          >
            {/* Filter and Search */}
            {(showFilters || showSearch) && (
              <FilterBar
                insights={insights}
                filters={filters}
                sort={sort}
                searchQuery={searchQuery}
                onFiltersChange={setFilters}
                onSortChange={setSort}
                onSearchChange={setSearchQuery}
                showFilters={showFilters}
                showSearch={showSearch}
              />
            )}

            {/* Layout Selector */}
            <LayoutSelector
              currentLayout={currentLayout}
              onLayoutChange={handleLayoutChange}
            />
          </motion.div>
        )}

        {/* Error State */}
        {(error || infiniteScrollError) && (
          <ErrorDisplay
            error={error || infiniteScrollError}
            onRetry={() => {
              setError(null);
              refresh();
            }}
            className="my-8"
          />
        )}

        {/* Loading State */}
        {loadingState === 'loading' && filteredInsights.length === 0 ? (
          <div className="my-8">
            <LoadingSkeleton 
              variant={currentLayout === 'list' ? 'list' : currentLayout === 'carousel' ? 'carousel' : 'card'} 
              count={initialDisplayCount} 
            />
          </div>
        ) : filteredInsights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <Heading as={3} className="text-xl font-semibold text-secondary mb-4">
                No insights found
              </Heading>
              <Text as="p" className="text-text/60 mb-6">
                {searchQuery || filters.categories?.length || filters.authors?.length
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No insights are currently available.'}
              </Text>
              
              {(searchQuery || filters.categories?.length || filters.authors?.length) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {renderLayout()}
            
            {/* Infinite Scroll Trigger */}
            {showInfiniteScroll && hasMore && (
              <div ref={infiniteScrollRef} className="h-1" />
            )}
          </motion.div>
        )}

        {/* Infinite Scroll Indicator */}
        {showInfiniteScroll && hasMore && loadingState === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="flex items-center gap-3 text-text/60">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading more insights...
            </div>
          </motion.div>
        )}
      </Container>
    </Section>
  );
};