/**
 * Settings Management Functions
 * Handle retrieval and storage of site configuration.
 * 
 * MVP scope: Site Title, Tagline, Contact Email (simple key-value pairs)
 */

import { supabase, getErrorMessage } from './supabase';
import { SiteSettings } from '@/types/admin';

/**
 * Get all site settings
 * Returns default values if table doesn't exist (MVP safety)
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase.from('settings').select('*');

    if (error) {
      console.warn('Settings table not found, using defaults:', error.message);
      return getDefaultSettings();
    }

    // Convert array of {key: value} to object
    if (Array.isArray(data) && data.length > 0) {
      const settings: Record<string, string> = {};
      data.forEach((item: Record<string, string>) => {
        settings[item.key] = item.value;
      });

      return {
        site_title: settings.site_title || 'Ridgewood Insights',
        site_tagline: settings.site_tagline || 'Financial insights for accountants',
        contact_email: settings.contact_email || '',
      };
    }

    return getDefaultSettings();
  } catch (error) {
    console.warn('Failed to load settings:', getErrorMessage(error));
    return getDefaultSettings();
  }
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single<{ value: string | null }>();

    if (error) throw error;
    return data?.value || null;
  } catch (error) {
    console.warn(`Failed to load setting ${key}:`, getErrorMessage(error));
    return null;
  }
}

/**
 * Update a single setting
 */
export async function updateSetting(key: string, value: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) throw error;
  } catch (error) {
    throw new Error(`Failed to update setting: ${getErrorMessage(error)}`);
  }
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(updates: Partial<SiteSettings>): Promise<void> {
  try {
    const entries = Object.entries(updates);

    for (const [key, value] of entries) {
      if (value !== undefined && value !== null) {
        await updateSetting(key, String(value));
      }
    }
  } catch (error) {
    throw new Error(`Failed to update settings: ${getErrorMessage(error)}`);
  }
}

/**
 * Get default settings (fallback if DB is not available)
 */
function getDefaultSettings(): SiteSettings {
  return {
    site_title: 'Ridgewood Insights',
    site_tagline: 'Financial insights for accountants',
    contact_email: 'hello@ridgewoodinsights.com',
  };
}
