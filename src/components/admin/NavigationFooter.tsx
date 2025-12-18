/**
 * Modern Navigation Footer Component
 * Clean user profile section with elegant interactions
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface NavigationFooterProps {
  isExpanded: boolean;
  isMobile?: boolean;
}

export function NavigationFooter({ 
  isExpanded, 
  isMobile = false 
}: NavigationFooterProps) {
  const { user, logout, isLoading } = useAdminAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={cn(
      'border-t border-surface/60 flex-shrink-0',
      isExpanded ? 'p-6' : 'p-4'
    )}>
      {/* User Profile Section */}
      {isExpanded && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-surface/30">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white" />
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary truncate">
              {user.email}
            </p>
            <p className="text-xs text-text/60 font-medium">
              Administrator
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={cn(
        'space-y-2',
        !isExpanded && 'space-y-3'
      )}>
        {/* User Menu Button (when collapsed) */}
        {!isExpanded && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={cn(
            'group relative flex items-center gap-3 w-full rounded-xl transition-all duration-200',
            'hover:no-underline focus:no-underline',
            
            // Layout
            isExpanded ? 'px-4 py-3' : 'justify-center px-3 py-3',
            
            // States
            'bg-surface/50 hover:bg-surface border border-transparent hover:border-surface',
            'active:scale-[0.98]',
            
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
            
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
          )}
          title="Sign out of admin portal"
          aria-label="Sign out of admin portal"
        >
          {/* Logout Icon */}
          <div className={cn(
            'flex-shrink-0 transition-colors duration-200',
            isExpanded ? 'w-5 h-5' : 'w-5 h-5'
          )}>
            <svg 
              className="w-full h-full text-text/60 group-hover:text-error transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.8} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </div>

          {/* Label - only when expanded */}
          {isExpanded && (
            <span className="text-sm font-medium text-text group-hover:text-error transition-colors duration-200">
              {isLoading ? 'Signing out...' : 'Sign out'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}