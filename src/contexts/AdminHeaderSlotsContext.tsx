'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface AdminHeaderSlots {
  title: React.ReactNode | null;
  actions: React.ReactNode | null;
  subHeader: React.ReactNode | null;
  sidebarToggle: React.ReactNode | null;
}

interface AdminHeaderSlotsContextValue {
  slots: AdminHeaderSlots;
  setTitle: (title: React.ReactNode | null) => void;
  setActions: (actions: React.ReactNode | null) => void;
  setSubHeader: (subHeader: React.ReactNode | null) => void;
  setSidebarToggle: (toggle: React.ReactNode | null) => void;
  clear: () => void;
}

const AdminHeaderSlotsContext = createContext<AdminHeaderSlotsContextValue | null>(
  null
);

export function AdminHeaderSlotsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [slots, setSlots] = useState<AdminHeaderSlots>({
    title: null,
    actions: null,
    subHeader: null,
    sidebarToggle: null,
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

  const setSidebarToggle = useCallback((toggle: React.ReactNode | null) => {
    setSlots((prev) => ({ ...prev, sidebarToggle: toggle }));
  }, []);

  const clear = useCallback(() => {
    setSlots({
      title: null,
      actions: null,
      subHeader: null,
      sidebarToggle: null,
    });
  }, []);

  const value = useMemo(
    () => ({
      slots,
      setTitle,
      setActions,
      setSubHeader,
      setSidebarToggle,
      clear,
    }),
    [slots, setTitle, setActions, setSubHeader, setSidebarToggle, clear]
  );

  return (
    <AdminHeaderSlotsContext.Provider value={value}>
      {children}
    </AdminHeaderSlotsContext.Provider>
  );
}

export function useAdminHeaderSlots() {
  const ctx = useContext(AdminHeaderSlotsContext);
  if (!ctx) {
    throw new Error('useAdminHeaderSlots must be used within AdminHeaderSlotsProvider');
  }
  return ctx;
}
