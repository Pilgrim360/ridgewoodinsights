'use client';

import React from 'react';
import Link from 'next/link';
import { Mountain, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

export function SidebarHeader({ isExpanded, onToggleExpand }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center h-16 px-4 border-b border-slate-200',
        isExpanded ? 'justify-between' : 'justify-center'
      )}
    >
      <Link href="/admin" className={cn('flex items-center gap-2', !isExpanded && 'py-4')}>
        <Mountain className="h-6 w-6 text-slate-800" />
        <span
          className={cn(
            'font-semibold text-lg text-slate-800',
            'transition-all duration-300',
            !isExpanded && 'opacity-0 scale-0 w-0'
          )}
        >
          Ridgewood
        </span>
      </Link>
      {onToggleExpand && (
        <Button variant="ghost" size="icon" onClick={onToggleExpand} className="md:hidden">
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      )}
    </div>
  );
}
