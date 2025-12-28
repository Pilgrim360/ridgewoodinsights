'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  isActive?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

export function ToolbarButton({
  className,
  isActive,
  disabled,
  variant = 'default',
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        'h-9 min-w-9 px-2 rounded-md border',
        'text-secondary text-sm font-medium',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/40',
        variant === 'primary' && !isActive && 'bg-primary text-white border-primary hover:bg-primary/90',
        variant === 'danger' && !isActive && 'border-red-200 text-red-600 hover:bg-red-50',
        (isActive || variant === 'default') && [
          isActive
            ? 'bg-primary text-white border-primary'
            : 'bg-white border-surface hover:bg-primary/10',
        ],
        disabled && 'opacity-50 cursor-not-allowed hover:bg-white',
        className
      )}
      {...props}
    />
  );
}
