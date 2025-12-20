import { useState, useCallback, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useSidebarVisibility = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    setIsSidebarVisible(window.innerWidth >= MOBILE_BREAKPOINT);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible(prevState => !prevState);
  }, []);

  return { isSidebarVisible, toggleSidebar };
};
