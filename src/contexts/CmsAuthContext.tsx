'use client';

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase/client';
import { CMSUser, CMSContextType } from '@/types/cms';

/**
 * CmsAuthContext
 * Provides authenticated cms user and auth methods for the client side
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

const CmsAuthContext = createContext<CMSContextType | undefined>(undefined);

export const useCmsAuth = () => {
  const context = useContext(CmsAuthContext);
  if (!context) {
    throw new Error('useCmsAuth must be used within CmsAuthProvider');
  }
  return context;
};

interface CmsAuthProviderProps {
  children: ReactNode;
}

export const CmsAuthProvider: React.FC<CmsAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CMSUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  const lastUserIdRef = useRef<string | null>(null);

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

        // Fetch profile to verify cms status
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

  useEffect(() => {
    if (isLoading) return;

    const currentUserId = user?.id ?? null;
    if (lastUserIdRef.current !== currentUserId) {
      queryClient.clear();
      lastUserIdRef.current = currentUserId;
    }
  }, [isLoading, user?.id, queryClient]);

  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      queryClient.clear();
      lastUserIdRef.current = null;
      setUser(null);
      router.push('/cms/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <CmsAuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </CmsAuthContext.Provider>
  );
};
