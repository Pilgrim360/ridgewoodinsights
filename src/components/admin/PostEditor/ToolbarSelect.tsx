'use client';

import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md';
}

export function ToolbarSelect({
  className,
  disabled,
  size = 'md',
  ...props
}: ToolbarSelectProps) {
  return (
    <select
      disabled={disabled}
      className={cn(
        'h-9 rounded-md border border-surface bg-white',
        'text-secondary text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-primary/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'px-2' : 'px-3',
        className
      )}
      {...props}
    />
  );
}
