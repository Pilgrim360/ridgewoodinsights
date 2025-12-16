import { Insight } from '@/constants';

// Core layout types
export type LayoutType = 'grid' | 'list' | 'carousel' | 'masonry' | 'featured';
export type ViewMode = 'default' | 'compact' | 'detailed';
export type LoadingState = 'idle' | 'loading' | 'error' | 'complete';

// Insight card variants
export interface InsightCardData extends Insight {
  featured?: boolean;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  readTime?: string;
  views?: number;
  likes?: number;
}

// Layout configuration
export interface LayoutConfig {
  type: LayoutType;
  columns?: number;
  spacing?: 'sm' | 'md' | 'lg';
  cardSize?: 'sm' | 'md' | 'lg' | 'xl';
  showImages?: boolean;
  showExcerpt?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
}

// Responsive breakpoints configuration
export interface ResponsiveConfig {
  mobile: LayoutConfig;
  tablet: LayoutConfig;
  desktop: LayoutConfig;
}

// Filter and sorting options
export interface FilterOptions {
  categories?: string[];
  authors?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  tags?: string[];
}

export interface SortOptions {
  field: 'date' | 'title' | 'author' | 'views' | 'likes';
  direction: 'asc' | 'desc';
}

// Component props
export interface InsightsGridProps {
  // Data
  insights: Insight[];
  
  // Layout options
  layout?: LayoutType;
  responsive?: boolean;
  viewMode?: ViewMode;
  
  // Display options
  showFilters?: boolean;
  showSearch?: boolean;
  showLoadMore?: boolean;
  showInfiniteScroll?: boolean;
  showPagination?: boolean;
  
  // Performance options
  initialDisplayCount?: number;
  loadMoreIncrement?: number;
  enableVirtualization?: boolean;
  enableLazyLoading?: boolean;
  
  // Styling options
  backgroundVariant?: 'default' | 'muted' | 'white' | 'glass';
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  
  // Interaction options
  onInsightClick?: (insight: Insight) => void;
  onInsightLike?: (insightId: string) => void;
  onInsightShare?: (insight: Insight) => void;
  onFilterChange?: (filters: FilterOptions) => void;
  onSortChange?: (sort: SortOptions) => void;
  onLoadMore?: () => void;
  onSearch?: (query: string) => void;
  
  // Custom styling
  className?: string;
  customStyles?: Record<string, string>;
}

// Hook return types
export interface UseInsightsGridReturn {
  // State
  filteredInsights: Insight[];
  loadingState: LoadingState;
  currentPage: number;
  hasMore: boolean;
  totalCount: number;
  
  // Filters and sorting
  filters: FilterOptions;
  sort: SortOptions;
  searchQuery: string;
  
  // Layout state
  currentLayout: LayoutType;
  viewMode: ViewMode;
  
  // Actions
  setFilters: (filters: FilterOptions) => void;
  setSort: (sort: SortOptions) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setCurrentLayout: (layout: LayoutType) => void;
  setViewMode: (mode: ViewMode) => void;
  loadMore: () => void;
  refresh: () => void;
}

// Layout renderer props
export interface LayoutRendererProps {
  insights: Insight[];
  config: LayoutConfig;
  viewMode: ViewMode;
  loadingState: LoadingState;
  onInsightClick?: (insight: Insight) => void;
  onLoadMore?: () => void;
  hasMore: boolean;
  className?: string;
}

// Carousel specific props
export interface CarouselConfig {
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  centerMode?: boolean;
}

// Masonry specific props
export interface MasonryConfig {
  columns?: number;
  gap?: number;
  breakpointCols?: number | 'auto';
  className?: string;
}

// Animation and transition configurations
export interface AnimationConfig {
  duration?: number;
  easing?: string;
  stagger?: number;
  animate?: 'fade' | 'slide' | 'scale' | 'flip';
  hoverEffects?: boolean;
  entranceAnimations?: boolean;
}

export interface AccessibilityConfig {
  ariaLabels?: {
    grid: string;
    cards: string;
    loadMore: string;
    search: string;
    filters: string;
  };
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
  focusManagement?: boolean;
}