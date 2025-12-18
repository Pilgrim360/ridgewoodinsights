'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';

interface AdminNavFooterProps {
  isExpanded: boolean;
}

export function AdminNavFooter({ isExpanded }: AdminNavFooterProps) {
  const { user, logout } = useAdminAuth();

  return (
    <div className="border-t border-surface p-4">
      <div
        className={cn(
          'flex items-center gap-3 transition-all duration-300',
          isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
        )}
      >
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
