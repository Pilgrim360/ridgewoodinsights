'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Hero } from '@/components/sections/Hero';
import { InsightsGrid, type LayoutMode } from '@/components/sections/InsightsGrid';
import { CTA } from '@/components/sections/CTA';
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

export default function InsightsPage() {
  const [items, setItems] = useState<Insight[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
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

  // Initial load on mount
  useEffect(() => {
    if (!isInitialLoad) return;
    setIsInitialLoad(false);
    void loadMore();
  }, [isInitialLoad, loadMore]);

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
      {/* Hero Section */}
      <Hero
        title="Insights"
        subtitle="Financial Insights & Strategies"
        description="Stay informed with expert financial insights, tax strategies, and business advice to help you make smarter decisions for your future."
        imageSrc="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop"
        imageAlt="Financial insights and strategies"
        primaryCTA={{
          label: 'Contact Us',
          href: '/contact',
        }}
        secondaryCTA={{
          label: 'View Services',
          href: '/services',
          variant: 'outline',
        }}
        backgroundVariant="default"
        alignment="center"
      />

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

      {/* CTA Section */}
      <CTA
        title="Have Questions About Your Finances?"
        description="Our team of experts is ready to help you navigate your financial challenges. Schedule a free consultation today."
        primaryAction={{
          label: 'Schedule a Consultation',
          href: '/contact',
        }}
        secondaryAction={{
          label: 'View Our Services',
          href: '/services',
          variant: 'outline',
        }}
        variant="centered"
        backgroundVariant="muted"
      />
    </>
  );
}
