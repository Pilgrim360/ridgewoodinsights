'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { AdminUser, AdminContextType } from '@/types/admin';

/**
 * AdminAuthContext
 * Provides authenticated admin user and auth methods for the client side
 * Syncs with Supabase auth state
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

const AdminAuthContext = createContext<AdminContextType | undefined>(undefined);

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

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
