'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INSIGHTS, type Insight } from '../../constants';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

const INITIAL_DISPLAY_COUNT = 6;
const LOAD_MORE_INCREMENT = 6;

export function InsightsPage() {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const displayedInsights = INSIGHTS.slice(0, displayCount);
  const hasMore = displayCount < INSIGHTS.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderInsightCard = (insight: Insight, index: number) => (
    <Card
      key={insight.id}
      variant="default"
      className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      asChild
    >
      <Link
        href={insight.link}
        className="block h-full"
        aria-labelledby={`insight-${insight.id}-title`}
      >
        {/* Image */}
        {insight.image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={insight.image}
              alt={insight.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6 flex flex-col h-full">
          {/* Meta Information */}
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

          {/* Title */}
          <Heading
            as={3}
            id={`insight-${insight.id}-title`}
            className="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2"
          >
            {insight.title}
          </Heading>

          {/* Excerpt */}
          <Text
            as="p"
            className="text-text flex-grow leading-relaxed mb-4 line-clamp-3"
          >
            {insight.excerpt}
          </Text>

          {/* Author */}
          <div className="border-t border-surface pt-4 mt-auto">
            <Text as="p" className="text-text/80 text-sm">
              By <span className="font-medium">{insight.author}</span>
            </Text>
          </div>
        </div>
      </Link>
    </Card>
  );

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + LOAD_MORE_INCREMENT, INSIGHTS.length));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 md:py-24">
        <Container maxWidth="xl">
          <div className="text-center mb-12 md:mb-16">
            <Text
              as="p"
              className="text-primary font-semibold uppercase tracking-wide text-sm md:text-base mb-4"
            >
              Financial Insights & Strategies
            </Text>
            <Heading
              as={1}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-6"
            >
              Insights
            </Heading>
            <Text
              as="p"
              className="text-text text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Stay informed with expert financial insights, tax strategies, and business advice
              to help you make smarter decisions for your future.
            </Text>
          </div>
        </Container>
      </section>

      {/* Insights Grid */}
      <section className="pb-16 md:pb-24">
        <Container maxWidth="xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedInsights.map((insight, index) =>
              renderInsightCard(insight, index)
            )}
          </div>

          {/* Load More Button */}
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
      </section>
    </div>
  );
}