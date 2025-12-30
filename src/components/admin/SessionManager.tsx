'use client';

import React, { useEffect, useCallback, useRef, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { useDataRefresh } from '@/contexts/DataRefreshContext';

interface SessionManagerProps {
  children: ReactNode;
}

/**
 * SessionManager
 * Handles all session management logic:
 * - Refreshes session when tab becomes visible
 * - Triggers data refresh when tab becomes visible
 * - Periodic health checks (every 5 minutes)
 * - Shows user feedback on session issues
 * - Redirects to login when session is expired
 */
export function SessionManager({ children }: SessionManagerProps): React.ReactElement {
  const { user, checkAndRefreshSession, handleSessionExpired } = useAdminAuth();
  const { showError } = useAdminError();
  const { triggerRefresh } = useDataRefresh();
  const pathname = usePathname();
  const router = useRouter();
  
  // Use ref to track if we're currently refreshing to avoid duplicate calls
  const isRefreshing = useRef(false);
  const healthCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Skip session management on login page
  const isLoginPage = pathname === '/admin/login';

  /**
   * Handle session refresh with user feedback
   */
  const handleSessionRefresh = useCallback(async (shouldRefreshData = false) => {
    // Skip if already refreshing or on login page
    if (isRefreshing.current || isLoginPage) {
      return;
    }

    // Skip if user is not logged in
    if (!user) {
      return;
    }

    isRefreshing.current = true;

    try {
      console.log('[SessionManager] Checking session validity...');
      const isValid = await checkAndRefreshSession();

      if (!isValid) {
        console.error('[SessionManager] Session refresh failed - redirecting to login');
        showError('Your session has expired. Please log in again.');
        handleSessionExpired();
      } else {
        console.log('[SessionManager] Session is valid');
        
        // If requested, trigger data refresh and router refresh
        if (shouldRefreshData) {
          console.log('[SessionManager] Triggering data and router refresh');
          triggerRefresh();
          router.refresh();
        }
      }
    } catch (error) {
      console.error('[SessionManager] Error during session refresh:', error);
      showError('Failed to refresh session. Please try logging in again.');
      handleSessionExpired();
    } finally {
      isRefreshing.current = false;
    }
  }, [checkAndRefreshSession, handleSessionExpired, showError, user, isLoginPage, triggerRefresh, router]);

  /**
   * Handle tab visibility change
   * When user returns to tab, check and refresh session + data
   */
  const handleVisibilityChange = useCallback(() => {
    if (!isLoginPage && user) {
      console.log('[SessionManager] Tab became visible - checking session and refreshing data');
      handleSessionRefresh(true); // Pass true to trigger data refresh
    }
  }, [handleSessionRefresh, user, isLoginPage]);

  // Set up page visibility listener
  usePageVisibility(handleVisibilityChange);

  /**
   * Set up periodic session health check
   * Check every 5 minutes while admin panel is active
   */
  useEffect(() => {
    // Skip health checks on login page or if not logged in
    if (isLoginPage || !user) {
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
        healthCheckInterval.current = null;
      }
      return;
    }

    console.log('[SessionManager] Starting periodic session health checks');

    // Initial check on mount
    handleSessionRefresh();

    // Set up interval for periodic checks (5 minutes)
    healthCheckInterval.current = setInterval(() => {
      console.log('[SessionManager] Running periodic session health check');
      handleSessionRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup on unmount
    return () => {
      if (healthCheckInterval.current) {
        console.log('[SessionManager] Stopping session health checks');
        clearInterval(healthCheckInterval.current);
        healthCheckInterval.current = null;
      }
    };
  }, [handleSessionRefresh, user, isLoginPage]);

  /**
   * Check for session_expired query parameter on login page
   */
  useEffect(() => {
    if (isLoginPage) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('session_expired') === 'true') {
        showError('Your session has expired. Please log in again.');
        // Clean up the URL
        window.history.replaceState({}, '', '/admin/login');
      }
    }
  }, [isLoginPage, showError]);

  return <>{children}</>;
}
