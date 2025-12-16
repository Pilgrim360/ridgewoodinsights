'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Insight } from '@/constants';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Section } from '../ui/Section';
import { Text } from '../ui/Text';

type LayoutMode = 'featured' | 'grid' | 'masonry' | 'list' | 'carousel';

const DEFAULT_MARKETING_LAYOUTS: LayoutMode[] = ['grid', 'list'];

type PostsApiResponse = {
  insights: Insight[];
  total: number;
  offset: number;
  limit: number;
  nextOffset: number;
  hasMore: boolean;
};

export interface InsightsGridProps {
  insights: Insight[];
  totalCount?: number;
  pageSize?: number;
  initialLayout?: LayoutMode;
  backgroundVariant?: 'default' | 'muted' | 'white';

  availableLayouts?: LayoutMode[];
  showLayoutSwitcher?: boolean;
}

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
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

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="info" className="self-start w-fit bg-primary/10 text-primary">
      {category}
    </Badge>
  );
}

function DateReadTimeLine({ insight }: { insight: Insight }) {
  const date = formatDate(insight.date);
  const readTime = insight.readTime;

  if (!date && !readTime) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text/70">
      {date ? <span>{date}</span> : null}
      {date && readTime ? <span aria-hidden>•</span> : null}
      {readTime ? <span>{readTime}</span> : null}
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Card
      variant="outlined"
      padding="sm"
      interactive
      className={cn(
        'group p-0 overflow-hidden',
        'transition-all duration-300 motion-reduce:transition-none',
        'focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2'
      )}
      asChild
    >
      <Link href={insight.link} aria-label={insight.title} className="block h-full">
        <div className="flex h-full flex-col">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface/30">
            {insight.image ? (
              <Image
                src={insight.image}
                alt={insight.title}
                fill
                className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-white" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-secondary/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="p-6 flex flex-col gap-3">
            <CategoryBadge category={insight.category} />

            <Heading
              as={3}
              className={cn(
                'text-xl md:text-[1.35rem] leading-snug',
                'transition-colors duration-200 motion-reduce:transition-none',
                'group-hover:text-primary line-clamp-2'
              )}
            >
              {insight.title}
            </Heading>

            <DateReadTimeLine insight={insight} />

            <Text className="text-text/90 leading-relaxed line-clamp-3">
              {insight.excerpt}
            </Text>

            <div className="mt-2 pt-4 border-t border-surface/60 flex items-center justify-between gap-4">
              <Text as="span" size="sm" muted className="truncate">
                By <span className="text-secondary/80 font-medium">{insight.author}</span>
              </Text>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-semibold text-primary',
                  'opacity-0 translate-x-1 transition-all duration-200 motion-reduce:transition-none',
                  'group-hover:opacity-100 group-hover:translate-x-0'
                )}
              >
                Read <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

function InsightListRow({ insight }: { insight: Insight }) {
  return (
    <Card
      variant="outlined"
      padding="sm"
      interactive
      className={cn(
        'group p-0 overflow-hidden',
        'transition-all duration-300 motion-reduce:transition-none',
        'focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2'
      )}
      asChild
    >
      <Link href={insight.link} aria-label={insight.title} className="block">
        <div className="grid md:grid-cols-[260px_1fr]">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[220px] overflow-hidden bg-surface/30">
            {insight.image ? (
              <Image
                src={insight.image}
                alt={insight.title}
                fill
                className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 320px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-white" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/25 via-secondary/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center gap-3">
            <CategoryBadge category={insight.category} />

            <Heading
              as={3}
              className={cn(
                'text-2xl leading-tight',
                'transition-colors duration-200 motion-reduce:transition-none',
                'group-hover:text-primary'
              )}
            >
              {insight.title}
            </Heading>

            <DateReadTimeLine insight={insight} />

            <Text className="text-text/90 leading-relaxed line-clamp-3">
              {insight.excerpt}
            </Text>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Text as="span" size="sm" muted className="truncate">
                By <span className="text-secondary/80 font-medium">{insight.author}</span>
              </Text>
              <span className="text-sm font-semibold text-primary">
                Read <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

function FeaturedInsightCard({ insight }: { insight: Insight }) {
  return (
    <Card
      variant="elevated"
      padding="sm"
      interactive
      className={cn(
        'group p-0 overflow-hidden',
        'focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2'
      )}
      asChild
    >
      <Link href={insight.link} aria-label={insight.title} className="block">
        <div className="grid md:grid-cols-12">
          <div className="relative aspect-[16/10] md:aspect-auto md:col-span-5 md:min-h-[320px] overflow-hidden bg-surface/30">
            {insight.image ? (
              <Image
                src={insight.image}
                alt={insight.title}
                fill
                priority
                className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-white" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/35 via-secondary/0 to-transparent" />
          </div>

          <div className="p-8 md:p-10 md:col-span-7 flex flex-col gap-4">
            <CategoryBadge category={insight.category} />

            <Heading as={2} className="text-3xl md:text-4xl leading-tight">
              {insight.title}
            </Heading>

            <DateReadTimeLine insight={insight} />

            <Text className="text-text/90 leading-relaxed line-clamp-4">
              {insight.excerpt}
            </Text>

            <div className="mt-4 pt-6 border-t border-surface/60 flex items-center justify-between gap-6">
              <Text as="span" size="sm" muted className="truncate">
                By <span className="text-secondary/80 font-medium">{insight.author}</span>
              </Text>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-semibold text-primary',
                  'transition-transform duration-200 motion-reduce:transition-none',
                  'group-hover:translate-x-0.5'
                )}
              >
                Read the full article <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
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
  insights,
  totalCount,
  pageSize = 12,
  initialLayout = 'grid',
  backgroundVariant = 'white',
  availableLayouts = DEFAULT_MARKETING_LAYOUTS,
  showLayoutSwitcher = true,
}: InsightsGridProps) {
  const [layout, setLayout] = useState<LayoutMode>(() => {
    const preferred = initialLayout;
    if (availableLayouts.includes(preferred)) return preferred;
    return availableLayouts[0] ?? 'grid';
  });

  const [items, setItems] = useState<Insight[]>(insights);
  const [offset, setOffset] = useState<number>(insights.length);
  const [hasMore, setHasMore] = useState<boolean>(
    typeof totalCount === 'number' ? insights.length < totalCount : true
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inflightRef = useRef(false);

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

  useEffect(() => {
    if (!sentinelRef.current) return;
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
  }, [hasMore, loadMore]);

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
      <Container maxWidth="xl">
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
            {featured ? <FeaturedInsightCard insight={featured} /> : null}

            {remaining.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {remaining.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {items.length > 0 && layout === 'grid' ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        ) : null}

        {items.length > 0 && layout === 'masonry' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
            {items.map((insight) => (
              <div key={insight.id} className="break-inside-avoid mb-8">
                <InsightCard insight={insight} />
              </div>
            ))}
          </div>
        ) : null}

        {items.length > 0 && layout === 'list' ? (
          <div className="space-y-6">
            {items.map((insight) => (
              <InsightListRow key={insight.id} insight={insight} />
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
                'pb-2 -mx-4 px-4',
                '[scrollbar-width:thin]'
              )}
              role="region"
              aria-label="Insights carousel"
            >
              <div className="grid grid-flow-col auto-cols-[88%] sm:auto-cols-[62%] lg:auto-cols-[38%] gap-6">
                {items.map((insight) => (
                  <div key={insight.id} className="snap-start">
                    <InsightCard insight={insight} />
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
                onClick={() => void loadMore()}
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
                onClick={() => void loadMore()}
              >
                Load more
              </Button>
            )}

            <div ref={sentinelRef} className="h-1 w-full" aria-hidden />

            {isLoadingMore ? (
              <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
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
