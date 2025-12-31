'use client';

import { cn } from '@/lib/utils';

export interface TableResponsiveProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A wrapper component to ensure tables are responsive on mobile devices.
 * Complements the CSS-based responsive strategy.
 */
export function TableResponsive({ children, className }: TableResponsiveProps) {
  return (
    <div className={cn('tiptap-table-wrapper overflow-x-auto', className)}>
      {children}
    </div>
  );
}
