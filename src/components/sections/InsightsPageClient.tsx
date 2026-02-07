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

const PAGE_SIZE = 12;

interface InsightsPageClientProps {
  initialPosts: Insight[];
}

export function InsightsPageClient({ initialPosts }: InsightsPageClientProps) {
  const [items, setItems] = useState<Insight[]>(initialPosts);
  const [offset, setOffset] = useState<number>(initialPosts.length);
  const [hasMore, setHasMore] = useState<boolean>(initialPosts.length === PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('grid');

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inflightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!hasMore || inflightRef.current) return;

    inflightRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/insights/posts?offset=${offset}&limit=${PAGE_SIZE}`);
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

  // Intersection observer for infinite scroll
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
