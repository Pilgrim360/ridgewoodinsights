'use client';

import { useState, useEffect, useCallback } from 'react';

const isBrowser = typeof window !== 'undefined';

function getInitialState(isMobile: boolean) {
  if (isMobile) return false;
  if (isBrowser) {
    const storedValue = localStorage.getItem('sidebar-visible');
    return storedValue ? JSON.parse(storedValue) : true;
  }
  return true;
}

export function useSidebarVisibility() {
  const [isMobile, setIsMobile] = useState(
    isBrowser ? window.innerWidth < 1024 : false
  );
  const [isVisible, setIsVisible] = useState(getInitialState(isMobile));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && isMounted) {
      localStorage.setItem('sidebar-visible', JSON.stringify(isVisible));
    }
  }, [isVisible, isMobile, isMounted]);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return { isVisible, isMobile, toggle, isMounted };
}
