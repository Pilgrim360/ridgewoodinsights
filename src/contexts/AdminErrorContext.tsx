'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminErrorHandler } from '@/lib/admin/error-handler';
import { AdminErrorContextType } from '@/types/admin';

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
    setTimeout(() => setError(null), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return (
    <AdminErrorContext.Provider
      value={{ error, success, showError, showSuccess, clearMessages }}
    >
      <ReactQueryErrorBridge showError={showError} />

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

function ReactQueryErrorBridge({
  showError,
}: {
  showError: (message: string) => void;
}) {
  const queryClient = useQueryClient();
  const shownErrorKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeQueryCache = queryClient
      .getQueryCache()
      .subscribe((event) => {
        if (event.type !== 'updated') return;

        const { query } = event;
        if (query.state.status !== 'error') return;

        const errorKey = `${query.queryHash}:${query.state.errorUpdatedAt}`;
        if (shownErrorKeys.current.has(errorKey)) return;

        shownErrorKeys.current.add(errorKey);
        if (shownErrorKeys.current.size > 50) {
          shownErrorKeys.current.clear();
        }

        const parsed = AdminErrorHandler.parse(query.state.error);
        if (process.env.NODE_ENV === 'development') {
          AdminErrorHandler.log(parsed);
        }
        showError(parsed.message);
      });

    const unsubscribeMutationCache = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (event.type !== 'updated') return;

        const mutation = event.mutation;
        if (mutation.state.status !== 'error') return;

        const meta = mutation.options.meta as Record<string, unknown> | undefined;
        if (meta?.toastHandled) return;

        const errorKey = `${mutation.mutationId}:${mutation.state.submittedAt}:${mutation.state.failureCount}`;
        if (shownErrorKeys.current.has(errorKey)) return;

        shownErrorKeys.current.add(errorKey);
        if (shownErrorKeys.current.size > 50) {
          shownErrorKeys.current.clear();
        }

        const parsed = AdminErrorHandler.parse(mutation.state.error);
        if (process.env.NODE_ENV === 'development') {
          AdminErrorHandler.log(parsed);
        }
        showError(parsed.message);
      });

    return () => {
      unsubscribeQueryCache();
      unsubscribeMutationCache();
    };
  }, [queryClient, showError]);

  return null;
}
