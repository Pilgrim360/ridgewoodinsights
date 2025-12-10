/**
 * StatsCard Component
 * Displays a single metric with label, value, and optional trend
 */

import React from 'react';
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
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  className,
  ...props
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-white border border-surface',
    primary: 'bg-primary/5 border border-primary/20',
    success: 'bg-green-50 border border-green-200',
    info: 'bg-blue-50 border border-blue-200',
  };

  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-text',
  };

  return (
    <div
      className={cn(
        'rounded-lg p-6 flex flex-col gap-2',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {/* Header with Icon and Label */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-secondary">{label}</p>
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
      </div>

      {/* Value Section */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-secondary">{value}</span>
        {trend && (
          <span className={cn('text-sm font-medium', trendColor[trend.direction])}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {trend.percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
