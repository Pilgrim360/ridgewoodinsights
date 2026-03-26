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
    primary: 'bg-white border border-surface',
    success: 'bg-white border border-surface',
    info: 'bg-white border border-surface',
  };

  const iconBgStyles = {
    default: 'bg-surface text-secondary',
    primary: 'bg-surface text-secondary',
    success: 'bg-surface text-secondary',
    info: 'bg-surface text-secondary',
  };

  const trendConfig = {
    up: { color: 'text-green-600', Icon: TrendingUp },
    down: { color: 'text-red-600', Icon: TrendingDown },
    neutral: { color: 'text-text/60', Icon: Minus },
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 flex flex-col gap-3 transition-all duration-200 hover:border-zinc-300',
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
