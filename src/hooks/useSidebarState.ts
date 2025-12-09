/**
 * useSidebarState Hook
 * Manages sidebar collapse/expand state and mobile menu state with localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { SidebarState } from '@/types/admin';

const STORAGE_KEY_EXPANDED = 'ridgewood-admin-sidebar-expanded';
// Note: STORAGE_KEY_MOBILE_OPEN intentionally unused (mobile state resets on reload for UX)
// const STORAGE_KEY_MOBILE_OPEN = 'ridgewood-admin-mobile-menu-open';

export const useSidebarState = (): SidebarState => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedExpanded = localStorage.getItem(STORAGE_KEY_EXPANDED);
    if (savedExpanded !== null) {
      setIsExpanded(JSON.parse(savedExpanded));
    }

    // Don't restore mobile menu state (reset on page reload for UX)
    setIsMobileOpen(false);
    setIsHydrated(true);
  }, []);

  // Persist expanded state to localStorage
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(isExpanded));
  }, [isExpanded, isHydrated]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return {
    isExpanded,
    isMobileOpen,
    toggleExpand,
    toggleMobileMenu,
    closeMobileMenu,
  };
};
