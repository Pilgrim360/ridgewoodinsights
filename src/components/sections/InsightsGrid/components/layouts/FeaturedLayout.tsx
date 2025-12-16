'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LayoutRendererProps } from '../../types';
import { InsightCard } from '../InsightCard';
import { Button } from '@/components/ui/Button';

interface FeaturedLayoutProps extends LayoutRendererProps {
  featuredCount?: number;
}

export const FeaturedLayout: React.FC<FeaturedLayoutProps> = ({
  insights,
  config,
  loadingState,
  onInsightClick,
  onLoadMore,
  hasMore,
  className,
  featuredCount = 3,
}) => {
  const featuredInsights = insights.slice(0, featuredCount);
  const remainingInsights = insights.slice(featuredCount);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const featuredGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-text/60 text-lg">
          No insights available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Hero Featured Insight */}
        {insights.length > 0 && (
          <motion.div variants={heroVariants} className="mb-16">
            <InsightCard
              insight={insights[0]}
              variant="featured"
              priority="high"
              onClick={onInsightClick}
              className="max-w-4xl mx-auto"
            />
          </motion.div>
        )}

        {/* Featured Grid */}
        {featuredInsights.length > 1 && (
          <motion.div variants={featuredGridVariants} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">
                Featured Insights
              </h3>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredInsights.slice(1, 4).map((insight, index) => (
                <motion.div key={insight.id} variants={itemVariants}>
                  <InsightCard
                    insight={insight}
                    variant="default"
                    priority={index === 0 ? 'high' : 'medium'}
                    onClick={onInsightClick}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Insights Grid */}
        {remainingInsights.length > 0 && (
          <motion.div variants={containerVariants} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">
                More Insights
              </h3>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingInsights.map((insight, index) => (
                <motion.div key={insight.id} variants={itemVariants}>
                  <InsightCard
                    insight={insight}
                    variant="compact"
                    onClick={onInsightClick}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <Button
            onClick={onLoadMore}
            disabled={loadingState === 'loading'}
            variant="primary"
            size="lg"
            isLoading={loadingState === 'loading'}
          >
            Load More Insights
          </Button>
        </motion.div>
      )}
    </div>
  );
};