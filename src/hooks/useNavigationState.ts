/**
 * Modern Navigation State Hook
 * Clean, performant state management for sidebar with persistence
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'ridgewood-admin-sidebar-state';

interface UseNavigationStateOptions {
  defaultExpanded?: boolean;
  persistState?: boolean;
  hoverDelay?: number;
}

export function useNavigationState(options: UseNavigationStateOptions = {}) {
  const {
    defaultExpanded = true,
    persistState = true,
    hoverDelay = 100,
  } = options;

  // Core state
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now());
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Smart expansion logic for desktop
  const isOnMobile = typeof window !== 'undefined' 
    ? window.innerWidth < 768 
    : false;

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Load persisted state
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') {
      setIsHydrated(true);
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isExpanded === 'boolean') {
          setIsExpanded(parsed.isExpanded);
        }
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage:', error);
    }

    setIsHydrated(true);
  }, [persistState]);

  // Persist state changes
  useEffect(() => {
    if (!isHydrated || !persistState || typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isExpanded,
        lastUpdated: Date.now(),
      }));
    } catch (error) {
      console.warn('Failed to save sidebar state to localStorage:', error);
    }
  }, [isExpanded, isHydrated, persistState]);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isOnMobile && isMobileOpen && isExpanded) {
      setIsExpanded(false);
    }
  }, [isOnMobile, isMobileOpen, isExpanded]);

  // Enhanced toggle function with interaction tracking
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
    setHasInteracted(true);
    setLastInteraction(Date.now());
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
    setHasInteracted(true);
    setLastInteraction(Date.now());
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
    setHasInteracted(true);
    setLastInteraction(Date.now());
  }, []);

  // Mobile menu functions
  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Hover handlers with delay
  const handleMouseEnter = useCallback(() => {
    setTimeout(() => {
      setIsHovered(true);
    }, hoverDelay);
  }, [hoverDelay]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Smart expansion based on user preference and current state
  const shouldAutoExpand = useMemo(() => {
    if (isOnMobile) return false;
    if (hasInteracted) return isExpanded;
    if (isHovered && !isExpanded) return true;
    return isExpanded;
  }, [isOnMobile, hasInteracted, isExpanded, isHovered]);

  // Current effective state (with hover consideration)
  const effectiveIsExpanded = useMemo(() => {
    if (isOnMobile) return isMobileOpen;
    return shouldAutoExpand;
  }, [isOnMobile, isMobileOpen, shouldAutoExpand]);

  // Compute if user prefers collapsed state (for new users)
  const prefersCollapsed = useMemo(() => {
    return !hasInteracted && !isExpanded && !isHovered;
  }, [hasInteracted, isExpanded, isHovered]);

  return {
    // Core state
    isExpanded: effectiveIsExpanded,
    isMobileOpen,
    
    // Control functions
    toggleExpand,
    expand,
    collapse,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    
    // Enhanced state
    isHovered,
    hasInteracted,
    lastInteraction,
    prefersCollapsed,
    isOnMobile,
    prefersReducedMotion,
  };
}