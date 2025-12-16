'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, List, Camera, Layers, Star } from 'lucide-react';
import type { LayoutType } from '../../types';

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  className?: string;
}

const layouts = [
  { type: 'grid' as LayoutType, icon: Grid3X3, label: 'Grid' },
  { type: 'list' as LayoutType, icon: List, label: 'List' },
  { type: 'carousel' as LayoutType, icon: Camera, label: 'Carousel' },
  { type: 'masonry' as LayoutType, icon: Layers, label: 'Masonry' },
  { type: 'featured' as LayoutType, icon: Star, label: 'Featured' },
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  currentLayout,
  onLayoutChange,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 p-1 bg-surface/30 rounded-lg">
        {layouts.map((layout) => {
          const Icon = layout.icon;
          const isActive = currentLayout === layout.type;
          
          return (
            <motion.button
              key={layout.type}
              onClick={() => onLayoutChange(layout.type)}
              className={`
                relative flex items-center justify-center p-2 rounded-md
                transition-all duration-200 group
                ${isActive 
                  ? 'text-primary bg-white shadow-sm' 
                  : 'text-text/60 hover:text-primary hover:bg-white/50'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={layout.label}
            >
              <Icon className="w-4 h-4" />
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeLayout"
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};