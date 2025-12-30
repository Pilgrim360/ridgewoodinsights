'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * DataRefreshContext
 * Provides a mechanism to trigger data refresh across all components
 * Used when tab becomes visible after being inactive
 */

interface DataRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined);

export const useDataRefresh = () => {
  const context = useContext(DataRefreshContext);
  if (!context) {
    throw new Error('useDataRefresh must be used within DataRefreshProvider');
  }
  return context;
};

interface DataRefreshProviderProps {
  children: ReactNode;
}

export const DataRefreshProvider: React.FC<DataRefreshProviderProps> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    console.log('[DataRefresh] Triggering data refresh across all components');
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <DataRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </DataRefreshContext.Provider>
  );
};
