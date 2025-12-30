import { AdminError } from '@/types/admin';
import { isAuthError } from './auth-interceptor';

/**
 * Comprehensive error handler for admin CMS operations
 * Maps Supabase and app errors to user-friendly messages
 */

export class AdminErrorHandler {
  static parse(error: unknown): AdminError {
    // Check for auth errors first
    if (isAuthError(error)) {
      return {
        type: 'RLS_VIOLATION',
        message: 'Your session has expired. Please log in again.',
        originalError: error as Error,
        retryable: false,
      };
    }

    // Handle Supabase-specific errors
    if (error instanceof Error && 'status' in error) {
      const err = error as Error & { status?: number; message: string };
      const status = err.status;

      // Authentication/Authorization errors
      if (status === 401 || status === 403 || error.message?.includes('permission denied')) {
        return {
          type: 'RLS_VIOLATION',
          message:
            'You do not have permission to perform this action. Please contact an administrator.',
          originalError: error as Error,
          retryable: false,
        };
      }

      // Not found
      if (status === 404) {
        return {
          type: 'NOT_FOUND',
          message: 'The requested resource was not found.',
          originalError: error as Error,
          retryable: false,
        };
      }

      // Conflict (e.g., duplicate slug)
      if (status === 409 || error.message?.includes('duplicate')) {
        return {
          type: 'CONFLICT',
          message: 'This value already exists. Please use a different value.',
          originalError: error as Error,
          retryable: false,
        };
      }

      // Network or server errors
      if (!status || status >= 500) {
        return {
          type: 'NETWORK_ERROR',
          message:
            'A network error occurred. Please check your connection and try again.',
          originalError: error as Error,
          retryable: true,
        };
      }
    }

    // Generic error handling
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return {
          type: 'VALIDATION_ERROR',
          message: error.message,
          originalError: error,
          retryable: false,
        };
      }

      if (error.message.includes('network')) {
        return {
          type: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
          originalError: error,
          retryable: true,
        };
      }

      // Generic server error
      return {
        type: 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred.',
        originalError: error,
        retryable: true,
      };
    }

    return {
      type: 'UNKNOWN',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true,
    };
  }

  /**
   * User-friendly error message
   */
  static getMessage(error: AdminError): string {
    return error.message;
  }

  /**
   * Whether the error can be retried
   */
  static isRetryable(error: AdminError): boolean {
    return error.retryable ?? true;
  }

  /**
   * Log error for debugging (can be extended with service integration)
   */
  static log(error: AdminError): void {
    console.error(`[AdminError: ${error.type}]`, error.message, error.originalError);
  }
}
