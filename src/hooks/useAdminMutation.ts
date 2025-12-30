'use client';

import { useState, useCallback } from 'react';
import { AdminErrorHandler } from '@/lib/admin/error-handler';
import { AdminError } from '@/types/admin';
import { useAdminError } from '@/contexts/AdminErrorContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { isAuthError } from '@/lib/admin/auth-interceptor';

/**
 * Hook for handling async admin operations with loading/error states
 * Auto-integrates with AdminErrorContext for toast notifications
 * Handles auth errors by triggering session expiry flow
 */

interface UseMutationOptions {
  onSuccess?: () => void;
  onError?: (error: AdminError) => void;
  autoShowError?: boolean; // default: true
  autoShowSuccess?: boolean; // default: false
  successMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useAdminMutation<T, E = unknown>(
  mutationFn: () => Promise<T>,
  options: UseMutationOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AdminError | null>(null);
  const { showError, showSuccess } = useAdminError();
  const { handleSessionExpired } = useAdminAuth();

  const {
    onSuccess,
    onError,
    autoShowError = true,
    autoShowSuccess = false,
    successMessage,
  } = options;

  const mutate = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn();

        if (autoShowSuccess && successMessage) {
          showSuccess(successMessage);
        }

        onSuccess?.();
        return result;
      } catch (err) {
        const parsedError = AdminErrorHandler.parse(err);
        setError(parsedError);
        AdminErrorHandler.log(parsedError);

        // Handle auth errors specially - trigger session expiry
        if (isAuthError(err)) {
          console.warn('[useAdminMutation] Auth error detected - triggering session expiry');
          handleSessionExpired();
          return; // Don't continue with error handling
        }

        if (autoShowError) {
          showError(parsedError.message);
        }

        onError?.(parsedError);
        throw parsedError;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, autoShowError, autoShowSuccess, successMessage, showError, showSuccess, handleSessionExpired]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    reset,
  };
}
