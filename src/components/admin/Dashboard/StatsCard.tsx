import React from 'react';
import { cn } from '@/lib/utils';

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'info';
}

export function StatsCard({
  label,
  value,
  icon,
  variant = 'default',
  className,
  ...props
}: StatsCardProps) {
  const variantStyles = {
    default: 'border-surface hover:border-primary/20',
    primary: 'border-primary/20 bg-primary/5',
    success: 'border-green-200 bg-green-50/50',
    info: 'border-blue-200 bg-blue-50/50',
  };

  return (
    <div
      className={cn(
        'group p-6 rounded-lg border bg-white transition-all duration-300',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wider font-bold text-text/40">
            {label}
          </p>
          <p className="text-3xl font-bold tracking-tight text-secondary group-hover:text-primary transition-colors">
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-2 bg-background rounded-md text-text/30 group-hover:text-primary/40 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
