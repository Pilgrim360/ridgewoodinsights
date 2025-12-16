'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LayoutRendererProps, LayoutConfig } from '../../types';
import { InsightCard } from '../InsightCard';
import { Button } from '@/components/ui/Button';

interface ListLayoutProps extends LayoutRendererProps {
  config: LayoutConfig & {
    layout?: 'horizontal' | 'vertical';
    imagePosition?: 'left' | 'right' | 'top';
  };
}

export const ListLayout: React.FC<ListLayoutProps> = ({
  insights,
  config,
  loadingState,
  onInsightClick,
  onLoadMore,
  hasMore,
  className,
}) => {
  const { layout = 'vertical', imagePosition = 'left' } = config;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
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
        className="space-y-6"
      >
        {insights.map((insight, index) => (
          <motion.div key={insight.id} variants={itemVariants}>
            <InsightCard
              insight={insight}
              variant="minimal"
              className="w-full"
              onClick={onInsightClick}
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