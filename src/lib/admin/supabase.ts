/**
 * Supabase Admin Client & Query Abstraction Layer
 * Handles authentication, error formatting, and query patterns.
 * 
 * Pattern: All queries return data OR throw error with user-friendly message.
 */

import { createClient } from '@supabase/supabase-js';
import { AdminError } from '@/types/admin';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Format Supabase errors into user-friendly messages
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSupabaseError(error: any): AdminError {
  // Check for specific error codes
  if (error?.code === 'PGRST116') {
    return {
      type: 'NOT_FOUND',
      message: 'The requested item was not found.',
      retryable: false,
    };
  }

  if (error?.code === 'PGRST301' || error?.message?.includes('permission')) {
    return {
      type: 'RLS_VIOLATION',
      message: 'You do not have permission to perform this action.',
      retryable: false,
    };
  }

  if (error?.message?.includes('Network request failed')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network connection lost. Please check your internet.',
      retryable: true,
    };
  }

  if (error?.message?.includes('Invalid input syntax')) {
    return {
      type: 'VALIDATION_ERROR',
      message: 'Invalid input data. Please check your entries.',
      retryable: false,
    };
  }

  // Generic server error
  return {
    type: 'SERVER_ERROR',
    message: 'Something went wrong. Please try again.',
    originalError: error,
    retryable: true,
  };
}

/**
 * Wrapper for Supabase queries with error handling
 * Converts Supabase errors to AdminError format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function withErrorHandling<T>(
  fn: () => Promise<{ data: T | null; error: Record<string, unknown> | null }>
): Promise<T> {
  try {
    const { data, error } = await fn();

    if (error) {
      const adminError = formatSupabaseError(error);
      throw new Error(adminError.message);
    }

    if (!data) {
      throw new Error('No data returned from server.');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get user profile with admin status
 */
export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    const adminError = formatSupabaseError(error);
    throw new Error(adminError.message);
  }

  return data;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    return profile?.is_admin === true;
  } catch {
    return false;
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Helper: Convert Supabase error object to friendly message
 * Use this in components when catching errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}
