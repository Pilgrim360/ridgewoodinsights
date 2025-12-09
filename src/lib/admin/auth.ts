import { createClient } from '@/lib/supabase/server';
import { AdminUser } from '@/types/admin';

/**
 * Server-side authentication utilities for admin panel
 * Verify user is authenticated and is admin
 */

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();

    // Get current auth user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch profile to check admin status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, is_admin, created_at')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      console.error('Failed to fetch profile:', error);
      return null;
    }

    // Verify user is admin
    if (!profile.is_admin) {
      console.warn(`Non-admin user attempted admin access: ${user.email}`);
      return null;
    }

    return {
      id: profile.id,
      email: profile.email || user.email || '',
      is_admin: profile.is_admin,
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Error getting current admin user:', error);
    return null;
  }
}

/**
 * Verify user is authenticated (can be admin or regular user)
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Verify request has admin access
 * Use in server actions or API routes
 */
export async function requireAdminUser() {
  const user = await getCurrentAdminUser();
  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }
  return user;
}
