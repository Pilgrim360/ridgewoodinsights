'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Insight } from '@/constants';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';

export interface InsightsGridProps {
  title?: string;
  subtitle?: string;
  insights: Insight[];
  initialDisplayCount?: number;
  loadMoreIncrement?: number;
  backgroundVariant?: 'default' | 'muted' | 'white';
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Card
      variant="default"
      className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      asChild
    >
      <Link
        href={insight.link}
        className="block h-full"
        aria-labelledby={`insight-${insight.id}-title`}
      >
        {insight.image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={insight.image}
              alt={insight.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        )}

        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="neutral" className="text-xs">
              {insight.category}
            </Badge>
            <Text as="span" className="text-text/70 text-xs">
              {formatDate(insight.date)}
            </Text>
            {insight.readTime && (
              <Text as="span" className="text-text/70 text-xs">
                {insight.readTime}
              </Text>
            )}
          </div>

          <Heading
            as={3}
            id={`insight-${insight.id}-title`}
            className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
          >
            {insight.title}
          </Heading>

          <Text
            as="p"
            className="text-text flex-grow leading-relaxed mb-4 line-clamp-3"
          >
            {insight.excerpt}
          </Text>

          <div className="border-t border-surface pt-4 mt-auto">
            <Text as="p" className="text-text/80 text-sm">
              By <span className="font-medium">{insight.author}</span>
            </Text>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function InsightsGrid({
  title,
  subtitle,
  insights,
  initialDisplayCount = 6,
  loadMoreIncrement = 6,
  backgroundVariant = 'white',
}: InsightsGridProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const displayedInsights = insights.slice(0, displayCount);
  const hasMore = displayCount < insights.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + loadMoreIncrement, insights.length));
  };

  return (
    <Section
      bg={backgroundVariant}
      className="py-16 md:py-24"
      aria-labelledby={title ? 'insights-grid-title' : undefined}
    >
      <Container maxWidth="xl">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <Text
                as="p"
                className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-4"
              >
                {subtitle}
              </Text>
            )}
            {title && (
              <Heading
                as={2}
                id="insights-grid-title"
                className="text-2xl md:text-3xl font-bold text-secondary"
              >
                {title}
              </Heading>
            )}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayedInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              Load More Insights
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
