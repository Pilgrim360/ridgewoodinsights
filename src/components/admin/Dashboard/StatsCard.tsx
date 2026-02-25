/**
 * StatsCard Component
 * Displays a single metric with label, value, and optional trend
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  variant?: 'default' | 'primary' | 'success' | 'info';
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  ...props
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-white border-surface',
    primary: 'bg-white border-primary/20',
    success: 'bg-white border-green-200',
    info: 'bg-white border-blue-200',
  };

  const iconColors = {
    default: 'text-text/60 bg-surface/50',
    primary: 'text-primary bg-primary/10',
    success: 'text-green-600 bg-green-50',
    info: 'text-blue-600 bg-blue-50',
  };

  const trendColor = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-text/60 bg-surface/50',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 border shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-2.5 rounded-lg', iconColors[variant])}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend && (
          <span className={cn('text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1', trendColor[trend.direction])}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
            {trend.percentage}%
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-text/60 mb-1">{label}</p>
        <span className="text-2xl font-bold text-secondary tracking-tight">{value}</span>
      </div>
    </div>
  );
}
