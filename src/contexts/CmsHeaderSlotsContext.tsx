'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface CmsHeaderSlots {
  title: React.ReactNode | null;
  actions: React.ReactNode | null;
  subHeader: React.ReactNode | null;
}

interface CmsHeaderSlotsContextValue {
  slots: CmsHeaderSlots;
  setTitle: (title: React.ReactNode | null) => void;
  setActions: (actions: React.ReactNode | null) => void;
  setSubHeader: (subHeader: React.ReactNode | null) => void;
  clear: () => void;
}

const CmsHeaderSlotsContext = createContext<CmsHeaderSlotsContextValue | null>(
  null
);

export function CmsHeaderSlotsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [slots, setSlots] = useState<CmsHeaderSlots>({
    title: null,
    actions: null,
    subHeader: null,
  });

  const setTitle = useCallback((title: React.ReactNode | null) => {
    setSlots((prev) => ({ ...prev, title }));
  }, []);

  const setActions = useCallback((actions: React.ReactNode | null) => {
    setSlots((prev) => ({ ...prev, actions }));
  }, []);

  const setSubHeader = useCallback((subHeader: React.ReactNode | null) => {
    setSlots((prev) => ({ ...prev, subHeader }));
  }, []);

  const clear = useCallback(() => {
    setSlots({ title: null, actions: null, subHeader: null });
  }, []);

  const value = useMemo(
    () => ({
      slots,
      setTitle,
      setActions,
      setSubHeader,
      clear,
    }),
    [slots, setTitle, setActions, setSubHeader, clear]
  );

  return (
    <CmsHeaderSlotsContext.Provider value={value}>
      {children}
    </CmsHeaderSlotsContext.Provider>
  );
}

export function useCmsHeaderSlots() {
  const ctx = useContext(CmsHeaderSlotsContext);
  if (!ctx) {
    throw new Error('useCmsHeaderSlots must be used within CmsHeaderSlotsProvider');
  }
  return ctx;
}
