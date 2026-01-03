'use client';

import { useCallback, useMemo, useRef } from 'react';
import type { Insight } from '@/constants';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Section } from '../ui/Section';
import { Text } from '../ui/Text';
import { InsightCard } from '../blog/InsightCard';

export type LayoutMode = 'featured' | 'grid' | 'masonry' | 'list' | 'carousel';

const DEFAULT_MARKETING_LAYOUTS: LayoutMode[] = ['grid', 'list'];

export interface InsightsGridProps {
  items: Insight[];
  layout: LayoutMode;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onLayoutChange: (layout: LayoutMode) => void;
  onLoadMore: () => void;
  showLayoutSwitcher?: boolean;
  availableLayouts?: LayoutMode[];
  backgroundVariant?: 'default' | 'muted' | 'white';
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

export function InsightsGrid({
  items,
  layout,
  isLoadingMore,
  error,
  hasMore,
  onLayoutChange,
  onLoadMore,
  showLayoutSwitcher = true,
  availableLayouts = DEFAULT_MARKETING_LAYOUTS,
  backgroundVariant = 'white',
}: InsightsGridProps) {

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

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollCarousel = useCallback((direction: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Section bg={backgroundVariant} aria-label="Insights">
      <Container maxWidth="full-bleed">
        {showLayoutSwitcher && viewOptions.length > 1 ? (
          <div className="mb-8 flex justify-end">
            <div className="flex items-center gap-2 rounded-xl border border-surface/70 bg-white p-1 overflow-x-auto">
              {viewOptions.map((opt) => {
                const isActive = opt.mode === layout;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => onLayoutChange(opt.mode)}
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

        {items.length === 0 ? (
          <div className="rounded-2xl border border-surface bg-background p-10 text-center">
            <Heading as={3} className="text-xl">
              No insights yet
            </Heading>
            <Text className="mt-3" muted>
              Check back soon—new articles are published regularly.
            </Text>
          </div>
        ) : null}

        {items.length > 0 && layout === 'featured' ? (
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

        {items.length > 0 && layout === 'grid' ? (
          <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((insight) => (
              <InsightCard key={insight.id} insight={insight} layout="grid" />
            ))}
          </div>
        ) : null}

        {items.length > 0 && layout === 'masonry' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 lg:gap-10 [column-fill:_balance]">
            {items.map((insight) => (
              <div key={insight.id} className="break-inside-avoid mb-6 md:mb-8 lg:mb-10">
                <InsightCard insight={insight} layout="grid" />
              </div>
            ))}
          </div>
        ) : null}

        {items.length > 0 && layout === 'list' ? (
          <div className="space-y-6">
            {items.map((insight) => (
              <InsightCard key={insight.id} insight={insight} layout="list" />
            ))}
          </div>
        ) : null}

        {items.length > 0 && layout === 'carousel' ? (
          <div className="relative">
            <div className="flex items-center justify-between gap-4 mb-6">
              <Text muted className="hidden md:block">
                Tip: use trackpad / swipe to browse.
              </Text>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-surface bg-white text-secondary hover:bg-background"
                  onClick={() => scrollCarousel('prev')}
                >
                  <span aria-hidden>←</span>
                  <span className="sr-only">Previous</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-surface bg-white text-secondary hover:bg-background"
                  onClick={() => scrollCarousel('next')}
                >
                  <span aria-hidden>→</span>
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className={cn(
                'relative overflow-x-auto scroll-smooth',
                'snap-x snap-mandatory',
                'pb-2 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 px-4 sm:px-6 md:px-8 lg:px-12',
                '[scrollbar-width:thin]'
              )}
              role="region"
              aria-label="Insights carousel"
            >
              <div className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[62%] lg:auto-cols-[38%] gap-4 md:gap-6 lg:gap-8">
                {items.map((insight) => (
                  <div key={insight.id} className="snap-start">
                    <InsightCard insight={insight} layout="carousel" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            className="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900"
            role="alert"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>
                We couldn’t load more posts. <span className="font-medium">{error}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                className="border border-red-200 bg-white text-red-900 hover:bg-red-100"
                onClick={onLoadMore}
              >
                Try again
              </Button>
            </div>
          </div>
        ) : null}

        {hasMore ? (
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
                onClick={onLoadMore}
              >
                Load more
              </Button>
            )}

            {isLoadingMore ? (
              <div className="grid w-full gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <InsightCardSkeleton key={idx} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-12 md:mt-16 text-center">
            <Text muted>That’s everything we’ve published so far.</Text>
          </div>
        )}
      </Container>
    </Section>
  );
}
