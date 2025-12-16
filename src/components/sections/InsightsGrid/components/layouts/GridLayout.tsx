'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LayoutRendererProps, LayoutConfig, ViewMode } from '../../types';
import { InsightCard } from '../InsightCard';
import type { Insight } from '@/constants';
import { Button } from '@/components/ui/Button';

interface GridLayoutProps extends LayoutRendererProps {
  config: LayoutConfig & {
    columns?: number;
    spacing?: 'sm' | 'md' | 'lg';
  };
}

const spacingClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const cardVariants = {
  default: 'default' as const,
  compact: 'compact' as const,
  detailed: 'featured' as const,
};

export const GridLayout: React.FC<GridLayoutProps> = ({
  insights,
  config,
  viewMode = 'default',
  loadingState,
  onInsightClick,
  onLoadMore,
  hasMore,
  className,
}) => {
  const { columns = 3, spacing = 'md' } = config;
  const cardVariant = cardVariants[viewMode] || 'default';

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

  return (
    <div className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`
          grid ${gridClasses[columns as keyof typeof gridClasses] || gridClasses[3]}
          ${spacingClasses[spacing]}
        `}
      >
        {insights.map((insight, index) => (
          <motion.div key={insight.id} variants={itemVariants}>
            <InsightCard
              insight={insight}
              variant={cardVariant}
              priority={insight.priority}
              onClick={onInsightClick}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
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