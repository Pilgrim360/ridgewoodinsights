/**
 * StatsCard Component
 * Displays a single metric with label, value, and optional trend
 */

import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  variant?: 'default' | 'primary' | 'success' | 'info';
  helperText?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  helperText,
  className,
  ...props
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-white border border-surface',
    primary: 'bg-primary/[0.04] border border-primary/20',
    success: 'bg-emerald-50 border border-emerald-200',
    info: 'bg-sky-50 border border-sky-200',
  };

  const trendColor = {
    up: 'text-emerald-700 bg-emerald-100',
    down: 'text-rose-700 bg-rose-100',
    neutral: 'text-text bg-background',
  };

  return (
    <article
      className={cn(
        'rounded-xl p-5 sm:p-6 flex flex-col gap-3 shadow-[0_1px_1px_rgba(0,0,0,0.02)]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-secondary">{label}</p>
        {icon ? (
          <div className="rounded-lg bg-white/70 p-2 text-primary" aria-hidden="true">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold tracking-tight text-secondary">{value}</span>

        {trend ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              trendColor[trend.direction]
            )}
          >
            {trend.direction === 'up' ? (
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : trend.direction === 'down' ? (
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {trend.percentage}%
          </span>
        ) : null}
      </div>

      {helperText ? <p className="text-xs text-text/80">{helperText}</p> : null}
    </article>
  );
}
