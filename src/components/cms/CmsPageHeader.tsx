'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CmsPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * CmsPageHeader - A clean, typographic header for CMS pages
 *
 * Replaces the old fixed top bar with a more integrated,
 * modern layout that sits at the top of the content area.
 */
export function CmsPageHeader({
  title,
  description,
  actions,
  className,
}: CmsPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8',
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-secondary">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text/60">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
