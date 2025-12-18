/**
 * useSidebarState Hook
 * Manages sidebar collapse/expand state, mobile menu state, and submenu expansion
 * with localStorage persistence for enhanced UX.
 */

import { useState, useEffect, useCallback } from 'react';
import { SidebarState } from '@/types/admin';

const STORAGE_KEY_EXPANDED = 'ridgewood-admin-sidebar-expanded';
const STORAGE_KEY_SUBMENU_PREFIX = 'ridgewood-admin-submenu-';

export const useSidebarState = (): SidebarState => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedExpanded = localStorage.getItem(STORAGE_KEY_EXPANDED);
    if (savedExpanded !== null) {
      setIsExpanded(JSON.parse(savedExpanded));
    }

    // Load submenu states
    const savedGroups = new Set<string>();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_KEY_SUBMENU_PREFIX)) {
        const groupId = key.replace(STORAGE_KEY_SUBMENU_PREFIX, '');
        const isExpanded = localStorage.getItem(key);
        if (isExpanded === 'true') {
          savedGroups.add(groupId);
        }
      }
    });
    setExpandedGroups(savedGroups);

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

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
        localStorage.setItem(STORAGE_KEY_SUBMENU_PREFIX + groupId, 'false');
      } else {
        newSet.add(groupId);
        localStorage.setItem(STORAGE_KEY_SUBMENU_PREFIX + groupId, 'true');
      }
      return newSet;
    });
  }, []);

  return {
    isExpanded,
    isMobileOpen,
    expandedGroups,
    toggleExpand,
    toggleMobileMenu,
    toggleGroup,
    closeMobileMenu,
  };
};