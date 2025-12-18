'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { LogOut, PanelLeft, PanelLeftClose } from 'lucide-react';
import { SidebarState } from '@/types/admin';

interface SidebarUserMenuProps {
  state: SidebarState;
  isMobile?: boolean;
}

/**
 * SidebarUserMenu - User info, collapse toggle, and logout
 * Pinned to the bottom of the sidebar
 */
export const SidebarUserMenu: React.FC<SidebarUserMenuProps> = ({ state, isMobile }) => {
  const { user, logout, isLoading } = useAdminAuth();
  const { isExpanded, toggleExpand } = state;

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get initials from email
  const initials = user.email
    .split('@')[0]
    .split('.')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="border-t border-gray-200 p-3 space-y-2 flex-shrink-0">
      {/* User Info Card */}
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50',
          !isExpanded && !isMobile && 'justify-center'
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-full',
            'bg-gradient-to-br from-primary to-primary/70 text-white font-medium text-xs',
            isExpanded || isMobile ? 'w-8 h-8' : 'w-9 h-9'
          )}
        >
          {initials}
        </div>

        {/* User Details */}
        {(isExpanded || isMobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.email.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        )}
      </div>

      {/* Actions Row */}
      <div className={cn('flex items-center gap-2', !isExpanded && !isMobile && 'justify-center')}>
        {/* Collapse Toggle (Desktop only, when expanded) */}
        {!isMobile && isExpanded && (
          <button
            onClick={toggleExpand}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              'flex-1'
            )}
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
            <span className="text-sm font-medium">Collapse</span>
          </button>
        )}

        {/* Expand Toggle (Desktop only, when collapsed) */}
        {!isMobile && !isExpanded && (
          <button
            onClick={toggleExpand}
            className={cn(
              'flex items-center justify-center w-full px-3 py-2 rounded-lg transition-colors',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-primary/20'
            )}
            title="Expand sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
            'text-gray-600 hover:text-red-600 hover:bg-red-50',
            'focus:outline-none focus:ring-2 focus:ring-red-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isExpanded || isMobile ? 'flex-1' : 'w-full justify-center'
          )}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {(isExpanded || isMobile) && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};
