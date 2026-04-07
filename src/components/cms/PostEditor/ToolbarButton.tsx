'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  isActive?: boolean;
  size?: 'sm' | 'md';
}

export function ToolbarButton({
  className,
  isActive,
  disabled,
  size = 'md',
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        size === 'sm' ? 'h-8 min-w-8 px-1.5' : 'h-9 min-w-9 px-2',
        'rounded-md border',
        'text-secondary text-sm font-medium',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/40',
        isActive
          ? 'bg-primary text-white border-primary'
          : 'bg-white border-surface hover:bg-primary/10',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white',
        className
      )}
      {...props}
    />
  );
}
