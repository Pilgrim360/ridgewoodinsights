
'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PostCard } from '../ui/PostCard';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import type { Insight } from '@/constants';


interface NewInsightsProps {
    insights: Insight[];
    initialDisplayCount?: number;
    loadMoreIncrement?: number;
}

export function NewInsights({
    insights,
    initialDisplayCount = 7,
    loadMoreIncrement = 6,
}: NewInsightsProps) {
    const [displayCount, setDisplayCount] = useState(initialDisplayCount);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const featuredPost = insights[0];
    const remainingPosts = insights.slice(1);
    const displayedPosts = remainingPosts.slice(0, displayCount - 1);

    const hasMore = displayCount < insights.length;

    const loadMorePosts = useCallback(() => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + loadMoreIncrement, insights.length));
            setIsLoading(false);
        }, 500); // Simulate network delay
    }, [isLoading, hasMore, loadMoreIncrement, insights.length]);

    const lastPostRef = useCallback(
        (node: HTMLElement | null) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, loadMorePosts]
    );

    return (
        <Section bg="white" className="py-16 md:py-24" aria-labelledby="new-insights-title">
            <Container maxWidth="xl">
                <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-center md:text-left">
                        <Heading as={2} id="new-insights-title" className="text-3xl font-bold text-secondary md:text-4xl">
                            Our Latest Insights
                        </Heading>
                        <Text className="mt-2 text-lg text-text/80">
                            Stay ahead with our expert analysis and financial guidance.
                        </Text>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-surface p-1">
                        <Button
                            variant={layout === 'grid' ? 'primary' : 'ghost'}
                            onClick={() => setLayout('grid')}
                            className="h-9 w-9 p-2"
                            aria-label="Grid view"
                        >
                            <LayoutGridIcon />
                        </Button>
                        <Button
                            variant={layout === 'list' ? 'primary' : 'ghost'}
                            onClick={() => setLayout('list')}
                            className="h-9 w-9 p-2"
                            aria-label="List view"
                        >
                            <ListIcon />
                        </Button>
                    </div>
                </div>

                {featuredPost && (
                    <div className="mb-12">
                        <PostCard post={featuredPost} variant="featured" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={layout}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            'grid gap-8',
                            layout === 'grid'
                                ? 'md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1'
                        )}
                    >
                        {displayedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                ref={index === displayedPosts.length - 1 ? lastPostRef : null}
                            >
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {isLoading && (
                    <div className="mt-12 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                )}

                {!hasMore && (
                    <div className="mt-12 text-center">
                        <Text className="text-text/70">You&apos;ve reached the end.</Text>
                    </div>
                )}
            </Container>
        </Section>
    );
}


function LayoutGridIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
      </svg>
    )
}


function ListIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="8" x2="21" y1="6" y2="6" />
        <line x1="8" x2="21" y1="12" y2="12" />
        <line x1="8" x2="21" y1="18" y2="18" />
        <line x1="3" x2="3.01" y1="6" y2="6" />
        <line x1="3" x2="3.01" y1="12" y2="12" />
        <line x1="3" x2="3.01" y1="18" y2="18" />
      </svg>
    )
}
