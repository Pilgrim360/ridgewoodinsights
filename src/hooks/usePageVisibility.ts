'use client';

import { useEffect, useCallback } from 'react';

export function usePageVisibility(onVisible: () => void) {
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      onVisible();
    }
  }, [onVisible]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, [handleVisibilityChange]);
}
