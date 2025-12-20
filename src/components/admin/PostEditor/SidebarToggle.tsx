'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  onClick: () => void;
  isVisible: boolean;
  className?: string;
}

export function SidebarToggle({
  onClick,
  isVisible,
  className,
}: SidebarToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn(
        'h-8 w-8 absolute top-2 -left-4 z-10 bg-white rounded-full transition-transform',
        !isVisible && 'transform rotate-180',
        className
      )}
      aria-label={isVisible ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}
