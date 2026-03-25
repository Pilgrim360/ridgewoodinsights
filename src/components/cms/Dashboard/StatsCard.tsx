import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
  href?: string;
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

  const iconBgStyles = {
    default: 'bg-surface text-secondary',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const trendConfig = {
    up: { color: 'text-green-600', Icon: TrendingUp },
    down: { color: 'text-red-600', Icon: TrendingDown },
    neutral: { color: 'text-text/60', Icon: Minus },
  };

  return (
    <div
      className={cn(
        'rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text/70">{label}</p>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBgStyles[variant])}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold text-secondary tracking-tight">{value}</span>
        {trend && (() => {
          const { color, Icon } = trendConfig[trend.direction];
          return (
            <span className={cn('inline-flex items-center gap-1 text-xs font-medium mb-1', color)}>
              <Icon className="w-3 h-3" />
              {trend.percentage}%
            </span>
          );
        })()}
      </div>
    </div>
  );
}
