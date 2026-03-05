'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
}

/**
 * StatsCard - Pure typographic representation of data
 */
export function StatsCard({
  label,
  value,
  className,
  ...props
}: StatsCardProps) {
  return (
    <div
      className={cn('flex flex-col gap-1', className)}
      {...props}
    >
      <p className="text-xs font-medium text-zinc-500 tracking-tight">{label}</p>
      <span className="text-3xl font-bold text-zinc-900 tracking-tighter">
        {value}
      </span>
    </div>
  );
}
