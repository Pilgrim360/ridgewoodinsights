'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { LayoutRendererProps, MasonryConfig } from '../../types';
import { InsightCard } from '../InsightCard';
import { Button } from '@/components/ui/Button';

interface MasonryLayoutProps extends LayoutRendererProps {
  config: MasonryConfig;
}

export const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  insights,
  config,
  loadingState,
  onInsightClick,
  onLoadMore,
  hasMore,
  className,
}) => {
  const [columnCount, setColumnCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { columns = 3, gap = 24 } = config;

  // Calculate responsive column count
  useEffect(() => {
    const updateColumnCount = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      if (width < 640) setColumnCount(1);
      else if (width < 1024) setColumnCount(Math.min(2, columns));
      else if (width < 1280) setColumnCount(Math.min(3, columns));
      else setColumnCount(columns);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [columns]);

  // Distribute insights across columns
  const columnsArray = Array.from({ length: columnCount }, (_, i) => 
    insights.filter((_, index) => index % columnCount === i)
  );

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
    <div ref={containerRef} className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-6"
        style={{
          columnCount,
          columnGap: `${gap}px`,
        }}
      >
        {columnsArray.map((columnInsights, columnIndex) => (
          <div key={columnIndex} className="flex-1 break-inside-avoid">
            {columnInsights.map((insight, insightIndex) => {
              // Calculate global index
              const globalIndex = columnIndex + (insightIndex * columnCount);
              return (
                <motion.div
                  key={insight.id}
                  variants={itemVariants}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: `${gap}px`,
                  }}
                >
                  <InsightCard
                    insight={insight}
                    variant={insight.featured ? 'featured' : 'default'}
                    onClick={onInsightClick}
                    className="mb-0"
                  />
                </motion.div>
              );
            })}
          </div>
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