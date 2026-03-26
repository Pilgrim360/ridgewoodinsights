import { createClient } from '@/lib/supabase/server';
import { CMSUser } from '@/types/cms';

/**
 * Server-side authentication utilities for cms panel
 * Verify user is authenticated and is cms
 */

export async function getCurrentCMSUser(): Promise<CMSUser | null> {
  try {
    const supabase = await createClient();

    // Get current auth user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch profile to check cms status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, is_admin, created_at')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      console.error('Failed to fetch profile:', error);
      return null;
    }

    // Verify user is cms
    if (!profile.is_admin) {
      console.warn(`Non-cms user attempted cms access: ${user.email}`);
      return null;
    }

    return {
      id: profile.id,
      email: profile.email || user.email || '',
      is_admin: profile.is_admin,
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Error getting current cms user:', error);
    return null;
  }
}

/**
 * Verify user is authenticated (can be cms or regular user)
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Verify request has cms access
 * Use in server actions or API routes
 */
export async function requireCMSUser() {
  const user = await getCurrentCMSUser();
  if (!user) {
    throw new Error('Unauthorized: CMS access required');
  }
  return user;
}
