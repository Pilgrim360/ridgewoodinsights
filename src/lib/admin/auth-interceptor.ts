/**
 * Auth Error Interceptor
 * Catches 401/403 auth errors and handles session expiration gracefully
 */

import { PostgrestError } from '@supabase/supabase-js';

export interface AuthErrorHandlerOptions {
  onSessionExpired?: () => void;
  onUnauthorized?: () => void;
}

/**
 * Check if an error is an auth-related error (401/403)
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false;

  // Handle Supabase PostgrestError
  const pgError = error as PostgrestError;
  if (pgError.code === 'PGRST301') {
    // Row Level Security violation - likely expired token
    return true;
  }

  // Handle HTTP status codes
  const anyError = error as Record<string, unknown>;
  if (anyError.status === 401 || anyError.status === 403) {
    return true;
  }

  // Check error messages
  const message = anyError.message as string;
  if (message) {
    const authKeywords = [
      'jwt expired',
      'invalid jwt',
      'not authenticated',
      'unauthorized',
      'forbidden',
      'permission denied',
      'token',
    ];
    const lowerMessage = message.toLowerCase();
    if (authKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return true;
    }
  }

  return false;
}

/**
 * Handle auth errors with proper logging and user feedback
 */
export function handleAuthError(error: unknown, options?: AuthErrorHandlerOptions): void {
  console.error('[Auth Error]', error);

  // Log detailed error info for debugging
  const anyError = error as Record<string, unknown>;
  if (anyError.code) {
    console.error(`Error Code: ${anyError.code}`);
  }
  if (anyError.message) {
    console.error(`Error Message: ${anyError.message}`);
  }
  if (anyError.details) {
    console.error(`Error Details: ${anyError.details}`);
  }

  // Trigger callbacks if provided
  if (isAuthError(error)) {
    console.warn('[Auth] Session expired or unauthorized - triggering handlers');
    options?.onSessionExpired?.();
  } else {
    options?.onUnauthorized?.();
  }
}

/**
 * Wrapper for Supabase queries that catches and handles auth errors
 */
export async function withAuthErrorHandling<T>(
  fn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options?: AuthErrorHandlerOptions
): Promise<{ data: T | null; error: PostgrestError | null }> {
  try {
    const result = await fn();

    // Check if error is auth-related
    if (result.error && isAuthError(result.error)) {
      handleAuthError(result.error, options);
    }

    return result;
  } catch (error) {
    // Catch network errors or other exceptions
    if (isAuthError(error)) {
      handleAuthError(error, options);
    }
    throw error;
  }
}
