'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AdminErrorContextType } from '@/types/admin';
import { ERROR_MESSAGES, AUTO_SAVE } from '@/lib/admin/constants';

/**
 * AdminErrorContext
 * Provides global error and success toast notifications for the admin panel.
 * Auto-dismiss after 5 seconds.
 */

const AdminErrorContext = createContext<AdminErrorContextType | undefined>(
  undefined
);

export const useAdminError = () => {
  const context = useContext(AdminErrorContext);
  if (!context) {
    throw new Error('useAdminError must be used within AdminErrorProvider');
  }
  return context;
};

interface AdminErrorProviderProps {
  children: ReactNode;
}

export const AdminErrorProvider: React.FC<AdminErrorProviderProps> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), AUTO_SAVE.TOAST_DURATION_MS);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), AUTO_SAVE.TOAST_DURATION_MS);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return (
    <AdminErrorContext.Provider
      value={{ error, success, showError, showSuccess, clearMessages }}
    >
      {children}
      {/* Toast Notifications */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-red-50 p-4 text-sm text-red-700 shadow-lg border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md rounded-lg bg-green-50 p-4 text-sm text-green-700 shadow-lg border border-green-200">
          {success}
        </div>
      )}
    </AdminErrorContext.Provider>
  );
};
