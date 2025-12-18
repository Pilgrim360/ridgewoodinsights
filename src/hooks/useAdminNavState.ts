'use client';

import { useState, useCallback, useEffect } from 'react';

const SIDEBAR_STATE_KEY = 'admin-sidebar-expanded';

export function useAdminNavState() {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === 'undefined') {
      return true; // Default to expanded on the server
    }
    const storedValue = localStorage.getItem(SIDEBAR_STATE_KEY);
    return storedValue ? JSON.parse(storedValue) : true;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMobileMenu]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return {
    isExpanded,
    isMobileOpen,
    toggleExpand,
    toggleMobileMenu,
    closeMobileMenu,
  };
}
