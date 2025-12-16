'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'carousel';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 6,
  className,
}) => {
  const cardSkeleton = (
    <div className="bg-white rounded-xl shadow-sm border border-surface/30 overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-surface/20 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Meta info */}
        <div className="flex gap-3">
          <div className="h-6 w-20 bg-surface/20 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-surface/20 rounded animate-pulse" />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-surface/20 rounded animate-pulse" />
          <div className="h-6 w-4/5 bg-surface/20 rounded animate-pulse" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-surface/20 rounded animate-pulse" />
          <div className="h-4 bg-surface/20 rounded animate-pulse" />
          <div className="h-4 w-3/5 bg-surface/20 rounded animate-pulse" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-surface/20">
          <div className="h-4 w-32 bg-surface/20 rounded animate-pulse" />
          <div className="h-8 w-20 bg-surface/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  const listSkeleton = (
    <div className="bg-white rounded-xl shadow-sm border border-surface/30 p-6">
      <div className="flex gap-6">
        {/* Image */}
        <div className="w-32 h-24 bg-surface/20 rounded-lg animate-pulse flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Meta */}
          <div className="flex gap-3">
            <div className="h-5 w-16 bg-surface/20 rounded-full animate-pulse" />
            <div className="h-4 w-20 bg-surface/20 rounded animate-pulse" />
          </div>
          
          {/* Title */}
          <div className="h-5 w-3/4 bg-surface/20 rounded animate-pulse" />
          
          {/* Excerpt */}
          <div className="space-y-1">
            <div className="h-4 bg-surface/20 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-surface/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const carouselSkeleton = (
    <div className="flex gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-surface/30 overflow-hidden">
            <div className="aspect-[16/10] bg-surface/20 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-surface/20 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-surface/20 rounded animate-pulse" />
              </div>
              <div className="h-5 bg-surface/20 rounded animate-pulse" />
              <div className="h-4 bg-surface/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getSkeleton = () => {
    switch (variant) {
      case 'list':
        return listSkeleton;
      case 'carousel':
        return carouselSkeleton;
      default:
        return cardSkeleton;
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
          className={variant === 'card' ? '' : 'mb-6'}
        >
          {getSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};