import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: number | string;
  className?: string;
}

export function StatsCard({ label, value, className }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-surface p-4', className)}>
      <p className="text-xs text-text/60 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-secondary mt-1">{value}</p>
    </div>
  );
}
