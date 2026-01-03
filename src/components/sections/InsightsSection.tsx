'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Insight } from '@/constants';
import { cn } from '@/lib/utils';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { InsightCard } from '../blog/InsightCard';

type LayoutMode = 'featured' | 'grid' | 'masonry' | 'list' | 'carousel';

type PostsApiResponse = {
  insights: Insight[];
  total: number;
  offset: number;
  limit: number;
  nextOffset: number;
  hasMore: boolean;
};

export interface InsightsSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  insights: Insight[];
  layout?: LayoutMode;
  totalCount?: number;
  pageSize?: number;
  backgroundVariant?: 'default' | 'muted' | 'white';
  showLayoutSwitcher?: boolean;
  availableLayouts?: LayoutMode[];
  maxDisplay?: number;
  showLoadMore?: boolean;
  loadMoreHref?: string;
  enablePagination?: boolean;
  enableCarouselAutoplay?: boolean;
  className?: string;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5 animate-spin text-primary', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function ViewIcon({ mode }: { mode: LayoutMode }) {
  switch (mode) {
    case 'featured':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      );
    case 'grid':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
        </svg>
      );
    case 'masonry':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M3 3h6v14H3V3zm8 0h6v8h-6V3zm0 10h6v4h-6v-4z" />
        </svg>
      );
    case 'list':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M4 5h12v2H4V5zm0 4h12v2H4V9zm0 4h12v2H4v-2z" />
        </svg>
      );
    case 'carousel':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M7 5l-5 5 5 5V5zm6 10l5-5-5-5v10z" />
        </svg>
      );
    default:
      return null;
  }
}

function InsightCardSkeleton() {
  return (
    <div className="rounded-xl border border-surface/50 bg-white overflow-hidden">
      <div className="aspect-[16/10] bg-surface/40 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-4 w-40 bg-surface/40 rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-surface/40 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-surface/40 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-surface/40 rounded animate-pulse" />
        </div>
        <div className="h-4 w-32 bg-surface/40 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function InsightsSection({
  title,
  subtitle,
  description,
  insights: initialInsights,
  layout: initialLayout = 'grid',
  totalCount,
  pageSize = 12,
  backgroundVariant = 'white',
  showLayoutSwitcher = false,
  availableLayouts = ['grid'],
  maxDisplay,
  showLoadMore = false,
  loadMoreHref = '/insights',
  enablePagination = false,
  enableCarouselAutoplay = true,
  className,
}: InsightsSectionProps) {
  const [layout, setLayout] = useState<LayoutMode>(() => {
    if (availableLayouts.includes(initialLayout)) return initialLayout;
    return availableLayouts[0] ?? 'grid';
  });

  const [items, setItems] = useState<Insight[]>(initialInsights);
  const [offset, setOffset] = useState<number>(initialInsights.length);
  const [hasMore, setHasMore] = useState<boolean>(
    typeof totalCount === 'number' ? initialInsights.length < totalCount : !enablePagination
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inflightRef = useRef(false);

  const displayItems = maxDisplay ? items.slice(0, maxDisplay) : items;

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    enableCarouselAutoplay ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : []
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Pagination
  const loadMore = useCallback(async () => {
    if (!hasMore || inflightRef.current) return;

    inflightRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/insights/posts?offset=${offset}&limit=${pageSize}`);
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = (await res.json()) as PostsApiResponse;

      setItems((prev) => {
        const next = [...prev, ...(data.insights ?? [])];
        const seen = new Set<string>();
        return next.filter((p) => {
          const key = String(p.id);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });

      setOffset((prev) =>
        typeof data.nextOffset === 'number' ? data.nextOffset : prev
      );
      setHasMore((prev) => (typeof data.hasMore === 'boolean' ? data.hasMore : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load more posts');
    } finally {
      inflightRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, offset, pageSize]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!enablePagination || !sentinelRef.current) return;
    if (!hasMore) return;

    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        void loadMore();
      },
      {
        rootMargin: '900px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, enablePagination]);

  const featured = items[0];
  const remaining = items.slice(1);

  const viewOptions: Array<{ mode: LayoutMode; label: string }> = useMemo(() => {
    const labelByMode: Record<LayoutMode, string> = {
      featured: 'Featured',
      grid: 'Grid',
      masonry: 'Masonry',
      list: 'List',
      carousel: 'Carousel',
    };

    const modes = Array.from(new Set<LayoutMode>(availableLayouts));
    return modes.map((mode) => ({ mode, label: labelByMode[mode] }));
  }, [availableLayouts]);

  useEffect(() => {
    if (availableLayouts.includes(layout)) return;
    setLayout(availableLayouts[0] ?? 'grid');
  }, [availableLayouts, layout]);

  return (
    <Section bg={backgroundVariant} aria-label="Insights" className={className}>
      <Container maxWidth="full-bleed">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          {layout === 'carousel' ? (
            // Carousel header: title/subtitle on left, controls on right
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="text-center md:text-left">
                {subtitle && (
                  <Text as="p" className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-2">
                    {subtitle}
                  </Text>
                )}
                <Heading
                  as={2}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2"
                >
                  {title}
                </Heading>
                {description && (
                  <Text as="p" muted className="mt-4 max-w-2xl">
                    {description}
                  </Text>
                )}
              </div>

              {/* Carousel Controls */}
              <div className="flex justify-center md:justify-end items-center gap-4 md:gap-6 flex-shrink-0">
                <button
                  onClick={scrollPrev}
                  className="p-3 rounded-full bg-surface/60 hover:bg-primary/20 text-secondary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Previous insight"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  className="p-3 rounded-full bg-surface/60 hover:bg-primary/20 text-secondary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Next insight"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // Standard header: centered or left-aligned
            <div className="text-center">
              {subtitle && (
                <Text as="p" className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-2">
                  {subtitle}
                </Text>
              )}
              <Heading
                as={2}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-2"
              >
                {title}
              </Heading>
              {description && (
                <Text as="p" muted className="mt-4 max-w-2xl mx-auto">
                  {description}
                </Text>
              )}
            </div>
          )}
        </div>

        {/* Layout Switcher */}
        {showLayoutSwitcher && viewOptions.length > 1 ? (
          <div className="mb-8 flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-surface/70 bg-white p-1 overflow-x-auto">
              {viewOptions.map((opt) => {
                const isActive = opt.mode === layout;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setLayout(opt.mode)}
                    aria-pressed={isActive}
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-lg',
                      'transition-colors duration-200 motion-reduce:transition-none',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-secondary hover:bg-background'
                    )}
                  >
                    <ViewIcon mode={opt.mode} />
                    <span className="sr-only">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Empty State */}
        {displayItems.length === 0 ? (
          <div className="rounded-2xl border border-surface bg-background p-10 text-center">
            <Heading as={3} className="text-xl">
              No insights yet
            </Heading>
            <Text className="mt-3" muted>
              Check back soon—new articles are published regularly.
            </Text>
          </div>
        ) : null}

        {/* Featured Layout */}
        {displayItems.length > 0 && layout === 'featured' ? (
          <div className="space-y-10">
            {featured ? <InsightCard insight={featured} layout="featured" /> : null}

            {remaining.length > 0 ? (
              <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
                {remaining.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} layout="grid" />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Grid Layout */}
        {displayItems.length > 0 && layout === 'grid' ? (
          <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((insight) => (
              <InsightCard key={insight.id} insight={insight} layout="grid" />
            ))}
          </div>
        ) : null}

        {/* Masonry Layout */}
        {displayItems.length > 0 && layout === 'masonry' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 lg:gap-10 [column-fill:_balance]">
            {displayItems.map((insight) => (
              <div key={insight.id} className="break-inside-avoid mb-6 md:mb-8 lg:mb-10">
                <InsightCard insight={insight} layout="grid" />
              </div>
            ))}
          </div>
        ) : null}

        {/* List Layout */}
        {displayItems.length > 0 && layout === 'list' ? (
          <div className="space-y-6">
            {displayItems.map((insight) => (
              <InsightCard key={insight.id} insight={insight} layout="list" />
            ))}
          </div>
        ) : null}

        {/* Carousel Layout */}
        {displayItems.length > 0 && layout === 'carousel' ? (
          <div className="relative">
            <div className="overflow-hidden py-4" ref={emblaRef}>
              <div className="flex -ml-4">
                {displayItems.map((insight) => (
                  <div key={insight.id} className="flex-grow-0 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 pl-4">
                    <div className="h-full">
                      <InsightCard insight={insight} layout="grid" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Error State */}
        {error ? (
          <div
            className="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900"
            role="alert"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>
                We couldn&apos;t load more posts. <span className="font-medium">{error}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                className="border border-red-200 bg-white text-red-900 hover:bg-red-100"
                onClick={() => void loadMore()}
              >
                Try again
              </Button>
            </div>
          </div>
        ) : null}

        {/* Load More Section */}
        {enablePagination && hasMore ? (
          <div className="mt-12 md:mt-16 flex flex-col items-center gap-4">
            {isLoadingMore ? (
              <div className="flex items-center gap-3 text-sm text-text/80" aria-live="polite">
                <Spinner />
                Loading more insights…
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="border border-surface bg-white text-secondary hover:bg-background"
                onClick={() => void loadMore()}
              >
                Load more
              </Button>
            )}

            <div ref={sentinelRef} className="h-1 w-full" aria-hidden />

            {isLoadingMore ? (
              <div className="grid w-full gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <InsightCardSkeleton key={idx} />
                ))}
              </div>
            ) : null}
          </div>
        ) : enablePagination && !hasMore ? (
          <div className="mt-12 md:mt-16 text-center">
            <Text muted>That&apos;s everything we&apos;ve published so far.</Text>
          </div>
        ) : null}

        {/* Simple Load More Link (for non-paginated mode) */}
        {!enablePagination && showLoadMore && displayItems.length < items.length ? (
          <div className="text-center mt-12">
            <Link
              href={loadMoreHref}
              className="inline-flex items-center px-6 py-3 border border-surface rounded-lg text-secondary font-medium hover:bg-surface hover:border-primary hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              See More Insights
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
