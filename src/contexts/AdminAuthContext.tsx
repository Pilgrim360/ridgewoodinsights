'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AdminUser, AdminContextType } from '@/types/admin';

/**
 * AdminAuthContext
 * Provides authenticated admin user and auth methods for the client side
 * Syncs with Supabase auth state and handles session refresh
 */

interface Profile {
  id: string;
  email: string | null;
  is_admin: boolean;
  created_at: string;
}

interface AuthSession {
  user?: {
    id: string;
    email?: string;
  };
}

// Extended context type with session management
interface ExtendedAdminContextType extends AdminContextType {
  refreshSession: () => Promise<boolean>;
  checkAndRefreshSession: () => Promise<boolean>;
  handleSessionExpired: () => void;
}

const AdminAuthContext = createContext<ExtendedAdminContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize user from Supabase on mount
    const initializeUser = async () => {
      try {
        const supabase = getSupabaseClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Fetch profile to verify admin status
         const { data: profile } = await supabase
           .from('profiles')
           .select('id, email, is_admin, created_at')
           .eq('id', session.user.id)
           .single();

         const typedProfile = profile as Profile | null;
         if (typedProfile?.is_admin) {
           setUser({
             id: typedProfile.id,
             email: typedProfile.email || session.user.email || '',
             is_admin: typedProfile.is_admin,
             created_at: typedProfile.created_at,
           });
         } else {
           setUser(null);
         }
      } catch (error) {
        console.error('Error initializing user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();

    // Subscribe to auth state changes
    const supabase = getSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: AuthSession | null) => {
       if (event === 'SIGNED_OUT') {
         setUser(null);
       } else if (session?.user) {
         // Re-fetch profile on auth change
         const { data: profile } = await supabase
           .from('profiles')
           .select('id, email, is_admin, created_at')
           .eq('id', session.user.id)
           .single();

         const typedProfile = profile as Profile | null;
         if (typedProfile?.is_admin) {
           setUser({
             id: typedProfile.id,
             email: typedProfile.email || session.user.email || '',
             is_admin: typedProfile.is_admin,
             created_at: typedProfile.created_at,
           });
         }
       }
     });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  /**
   * Refresh the current session
   * Returns true if refresh was successful, false otherwise
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[Auth] Attempting to refresh session...');
      const supabase = getSupabaseClient();
      
      // Force refresh the session
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('[Auth] Session refresh failed:', error.message);
        return false;
      }

      if (!data.session) {
        console.warn('[Auth] No session returned after refresh');
        return false;
      }

      console.log('[Auth] Session refreshed successfully');

      // Update user profile after successful refresh
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, is_admin, created_at')
        .eq('id', data.session.user.id)
        .single();

      const typedProfile = profile as Profile | null;
      if (typedProfile?.is_admin) {
        setUser({
          id: typedProfile.id,
          email: typedProfile.email || data.session.user.email || '',
          is_admin: typedProfile.is_admin,
          created_at: typedProfile.created_at,
        });
      }

      return true;
    } catch (error) {
      console.error('[Auth] Exception during session refresh:', error);
      return false;
    }
  }, []);

  /**
   * Check current session validity and refresh if needed
   * Returns true if session is valid or was successfully refreshed
   */
  const checkAndRefreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const supabase = getSupabaseClient();
      
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn('[Auth] No session found during validation');
        return false;
      }

      // Check if token is expired or about to expire (within 5 minutes)
      const expiresAt = session.expires_at;
      if (!expiresAt) {
        console.warn('[Auth] Session has no expiry - refreshing to be safe');
        return await refreshSession();
      }

      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeUntilExpiry = expiresAt - now;

      // If token expires in less than 5 minutes, refresh it
      if (timeUntilExpiry < 300) {
        console.log(`[Auth] Token expires in ${timeUntilExpiry}s - refreshing proactively`);
        return await refreshSession();
      }

      console.log(`[Auth] Session valid - expires in ${Math.floor(timeUntilExpiry / 60)} minutes`);
      return true;
    } catch (error) {
      console.error('[Auth] Error checking session validity:', error);
      return false;
    }
  }, [refreshSession]);

  /**
   * Handle session expired state - clear user and redirect to login
   */
  const handleSessionExpired = useCallback(() => {
    console.warn('[Auth] Session expired - redirecting to login');
    setUser(null);
    router.push('/admin/login?session_expired=true');
  }, [router]);

  return (
    <AdminAuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        logout,
        refreshSession,
        checkAndRefreshSession,
        handleSessionExpired,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
