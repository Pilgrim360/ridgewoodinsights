'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { InsightsGrid, type LayoutMode } from './InsightsGrid';
import type { Insight } from '@/constants';

type PostsApiResponse = {
  insights: Insight[];
  total: number;
  offset: number;
  limit: number;
  nextOffset: number;
  hasMore: boolean;
};

export interface InsightsPageClientProps {
  initialItems: Insight[];
  initialOffset: number;
  initialHasMore: boolean;
}

export function InsightsPageClient({
  initialItems,
  initialOffset,
  initialHasMore,
}: InsightsPageClientProps) {
  const [items, setItems] = useState<Insight[]>(initialItems);
  const [offset, setOffset] = useState<number>(initialOffset);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inflightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!hasMore || inflightRef.current) return;

    inflightRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/insights/posts?offset=${offset}&limit=12`);
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

      setOffset(data.nextOffset);
      setHasMore(data.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load more posts');
    } finally {
      inflightRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, offset]);

  // Initial load on mount - only if no initial items
  useEffect(() => {
    if (initialItems.length > 0) {
      setIsInitialLoad(false);
    }
  }, [initialItems]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;
    if (isInitialLoad) return;

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
  }, [hasMore, loadMore, isInitialLoad]);

  const handleLayoutChange = useCallback((newLayout: LayoutMode) => {
    setLayout(newLayout);
  }, []);

  return (
    <>
      {/* Insights Grid */}
      <InsightsGrid
        items={items}
        layout={layout}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLayoutChange={handleLayoutChange}
        onLoadMore={loadMore}
        backgroundVariant="white"
      />

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
    </>
  );
}