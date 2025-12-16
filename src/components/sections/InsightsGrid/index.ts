// Main component exports
export { InsightsGrid } from './InsightsGrid';

// Layout component exports
export { GridLayout } from './components/layouts/GridLayout';
export { ListLayout } from './components/layouts/ListLayout';
export { CarouselLayout } from './components/layouts/CarouselLayout';
export { MasonryLayout } from './components/layouts/MasonryLayout';
export { FeaturedLayout } from './components/layouts/FeaturedLayout';

// Sub-component exports
export { InsightCard } from './components/InsightCard';
export { FilterBar } from './components/FilterBar';
export { LayoutSelector } from './components/LayoutSelector';
export { LoadingSkeleton } from './components/LoadingSkeleton';
export { ErrorBoundary, ErrorDisplay } from './components/ErrorBoundary';

// Hook exports
export { useInsightsGrid } from './hooks/useInsightsGrid';
export { useInfiniteScroll } from './hooks/useInfiniteScroll';

// Type exports
export type {
  InsightsGridProps,
  UseInsightsGridReturn,
  FilterOptions,
  SortOptions,
  LayoutType,
  ViewMode,
  LoadingState,
  LayoutConfig,
  ResponsiveConfig,
  CarouselConfig,
  MasonryConfig,
  AnimationConfig,
  AccessibilityConfig,
  InsightCardData,
} from './types';