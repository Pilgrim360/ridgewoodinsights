'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';

export interface SidebarState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpand: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const STORAGE_KEY_EXPANDED = 'ridgewood-admin-sidebar-expanded';

export const useSidebarState = (): SidebarState => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExpanded = localStorage.getItem(STORAGE_KEY_EXPANDED);
      if (savedExpanded !== null) {
        setIsExpanded(JSON.parse(savedExpanded));
      }
      setIsHydrated(true);
    }
  }, []);

  // Persist expanded state to localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(isExpanded));
    }
  }, [isExpanded, isHydrated]);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    } else if (typeof window !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isMobileOpen]);

  return {
    isExpanded,
    isMobileOpen,
    toggleExpand,
    toggleMobileMenu,
    closeMobileMenu,
  };
};
