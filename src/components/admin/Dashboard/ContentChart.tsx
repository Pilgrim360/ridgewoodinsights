'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useMonthlyPostCounts } from '@/hooks/queries/usePostsQueries';
import { cn } from '@/lib/utils';

export function ContentChart({ className }: { className?: string }) {
  const { data, isLoading, isError } = useMonthlyPostCounts(6);

  if (isLoading) {
    return (
      <div className={cn('h-[350px] w-full bg-white border border-surface rounded-lg p-6 animate-pulse', className)}>
        <div className="h-4 bg-surface rounded w-1/4 mb-6" />
        <div className="h-[240px] bg-surface/30 rounded" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={cn('h-[350px] w-full bg-white border border-surface rounded-lg p-6 flex items-center justify-center text-text', className)}>
        Failed to load chart data
      </div>
    );
  }

  return (
    <div className={cn('bg-white border border-surface rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200', className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-secondary">Content Activity</h3>
          <p className="text-xs text-text/60 mt-1">Published posts over the last 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-secondary" />
            <span className="text-text/70">Previous</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-text/70">Current Month</span>
          </div>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E7ED" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#415161', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#415161', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#F8F9FB' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E2E7ED',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#2C3E50' }}
            />
            <Bar
              dataKey="count"
              name="Posts"
              radius={[4, 4, 0, 0]}
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === data.length - 1 ? '#006466' : '#2C3E50'}
                  fillOpacity={index === data.length - 1 ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
