'use client';

import { useState, useCallback } from 'react';
import { CmsErrorHandler } from '@/lib/cms/error-handler';
import { CmsError } from '@/types/cms';
import { useCmsError } from '@/contexts/CmsErrorContext';

/**
 * Hook for handling async cms operations with loading/error states
 * Auto-integrates with CmsErrorContext for toast notifications
 */

interface UseMutationOptions {
  onSuccess?: () => void;
  onError?: (error: CmsError) => void;
  autoShowError?: boolean; // default: true
  autoShowSuccess?: boolean; // default: false
  successMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCmsMutation<T, E = unknown>(
  mutationFn: () => Promise<T>,
  options: UseMutationOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<CmsError | null>(null);
  const { showError, showSuccess } = useCmsError();

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
        const parsedError = CmsErrorHandler.parse(err);
        setError(parsedError);
        CmsErrorHandler.log(parsedError);

        if (autoShowError) {
          showError(parsedError.message);
        }

        onError?.(parsedError);
        throw parsedError;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, autoShowError, autoShowSuccess, successMessage, showError, showSuccess]
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
