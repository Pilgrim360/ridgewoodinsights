# InsightsGrid Component Documentation

A modern, modular, and highly professional insights display component designed for the Ridgewood Insights website. This component provides multiple layout options, advanced filtering, and sophisticated interactions perfect for a top-tier accounting firm.

## Features

### 🎨 Multiple Layout Options
- **Grid Layout**: Responsive grid with configurable columns (1-4)
- **List Layout**: Clean vertical or horizontal list view
- **Carousel Layout**: Touch-enabled carousel with navigation dots and arrows
- **Masonry Layout**: Pinterest-style masonry layout for varied content
- **Featured Layout**: Hero-focused layout with featured content section

### 🔍 Advanced Filtering & Search
- **Real-time Search**: Instant search with debounced input
- **Category Filtering**: Filter by content categories
- **Author Filtering**: Filter by content authors
- **Date Range Filtering**: Filter by publication date ranges
- **Active Filter Display**: Visual indicators for active filters

### ⚡ Performance & UX
- **Infinite Scroll**: Automatic content loading on scroll
- **Load More**: Manual load more button with loading states
- **Lazy Loading**: Intersection Observer based lazy loading
- **Loading States**: Professional skeleton screens
- **Error Handling**: Comprehensive error boundaries with retry functionality

### 🎭 Professional Animations
- **Micro-interactions**: Hover effects and smooth transitions
- **Entrance Animations**: Staggered animations for content
- **Layout Transitions**: Smooth transitions between layouts
- **Reduced Motion Support**: Respects user accessibility preferences

### 📱 Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoint-aware**: Different configurations per screen size
- **Touch Optimized**: Proper touch targets for mobile
- **Cross-browser**: Modern web standards with fallbacks

### ♿ Accessibility
- **WCAG Compliant**: Proper ARIA labels and keyboard navigation
- **Screen Reader Support**: Semantic markup for screen readers
- **Focus Management**: Proper focus handling and indicators
- **Color Contrast**: Adheres to accessibility standards

## Usage Examples

### Basic Grid Layout

```tsx
import { InsightsGrid } from '@/components/sections/InsightsGrid';

function MyPage() {
  return (
    <InsightsGrid 
      insights={insightsData}
      layout="grid"
      showSearch={true}
      showFilters={true}
      initialDisplayCount={9}
      onInsightClick={(insight) => {
        // Handle insight click
        router.push(`/insights/${insight.id}`);
      }}
    />
  );
}
```

### Advanced Featured Layout

```tsx
<InsightsGrid 
  insights={insightsData}
  layout="featured"
  showInfiniteScroll={true}
  backgroundVariant="glass"
  title="Latest Financial Insights"
  subtitle="Expert Guidance"
  onInsightClick={handleInsightClick}
  onInsightLike={handleLike}
  onInsightShare={handleShare}
  initialDisplayCount={12}
  loadMoreIncrement={6}
/>
```

### Carousel with Custom Settings

```tsx
<InsightsGrid 
  insights={insightsData}
  layout="carousel"
  showFilters={false}
  showSearch={true}
  viewMode="compact"
/>
```

### Masonry with Full Features

```tsx
<InsightsGrid 
  insights={insightsData}
  layout="masonry"
  showFilters={true}
  showSearch={true}
  viewMode="compact"
  backgroundVariant="muted"
/>
```

## Props Reference

### Layout Options
- `layout`: Layout type (`'grid' | 'list' | 'carousel' | 'masonry' | 'featured'`)
- `responsive`: Enable responsive behavior (boolean)
- `viewMode`: Content density (`'default' | 'compact' | 'detailed'`)

### Display Options
- `showFilters`: Show filtering controls (boolean)
- `showSearch`: Show search bar (boolean)
- `showLoadMore`: Show manual load more button (boolean)
- `showInfiniteScroll`: Enable infinite scroll (boolean)
- `showPagination`: Show pagination (boolean)

### Performance Options
- `initialDisplayCount`: Initial number of items to display (number)
- `loadMoreIncrement`: Number of items to load per request (number)
- `enableVirtualization`: Enable virtual scrolling (boolean)
- `enableLazyLoading`: Enable image lazy loading (boolean)

### Styling Options
- `backgroundVariant`: Background style (`'default' | 'muted' | 'white' | 'glass'`)
- `showHeader`: Show section header (boolean)
- `title`: Section title (string)
- `subtitle`: Section subtitle (string)

### Event Handlers
- `onInsightClick`: Handle insight card click
- `onInsightLike`: Handle like button click
- `onInsightShare`: Handle share button click
- `onFilterChange`: Handle filter changes
- `onSortChange`: Handle sort changes
- `onSearch`: Handle search queries
- `onLoadMore`: Handle load more requests

### Data Structure

Each insight should implement the `Insight` interface:

```typescript
interface Insight {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  category: string;
  author: string;
  image?: string;
  link: string;
}
```

## Layout Configurations

Each layout supports different configuration options:

### Grid Layout
- `columns`: Number of columns (1-4)
- `spacing`: Spacing between cards (`'sm' | 'md' | 'lg'`)

### Carousel Layout
- `autoplay`: Enable automatic sliding (boolean)
- `autoplayDelay`: Delay between slides (number)
- `showDots`: Show pagination dots (boolean)
- `showArrows`: Show navigation arrows (boolean)
- `slidesToShow`: Number of slides to show (number)

### Masonry Layout
- `columns`: Number of masonry columns (number)
- `gap`: Gap between columns (number)

## Performance Optimization

- **Image Optimization**: Uses Next.js Image component with blur placeholders
- **Intersection Observer**: Efficient scroll detection
- **Memoization**: React.memo and useMemo for performance
- **Code Splitting**: Dynamic imports for layout components
- **Skeleton Loading**: Prevents layout shift during loading

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Touch device support
- Responsive design for all screen sizes

## Accessibility Features

- Semantic HTML structure
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance
- Reduced motion preferences

This component represents a complete, enterprise-ready solution for displaying insights with the highest standards of professional design, performance, and accessibility.