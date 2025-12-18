'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface SidebarFooterProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

export function SidebarFooter({
  isExpanded,
  onToggleExpand,
}: SidebarFooterProps) {
  const { user, logout } = useAdminAuth();

  return (
    <div className="border-t border-slate-200 p-4 mt-auto flex flex-col gap-4">
      {/* User Info */}
      <div
        className={cn(
          'flex items-center gap-3',
          !isExpanded && 'justify-center'
        )}
      >
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User className="h-6 w-6 text-slate-500" />
        </div>
        <div
          className={cn(
            'flex flex-col transition-all duration-300 overflow-hidden',
            !isExpanded && 'opacity-0 scale-0 w-0'
          )}
        >
          <span className="text-sm font-semibold text-slate-800 truncate">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className={cn(
            'transition-all duration-300',
            !isExpanded && 'opacity-0 scale-0 w-0'
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
        {onToggleExpand && (
          <Button variant="ghost" size="icon" onClick={onToggleExpand}>
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
