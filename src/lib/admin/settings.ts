/**
 * Settings Management Functions
 * Handle retrieval and storage of site configuration.
 * 
 * MVP scope: Site Title, Tagline, Contact Email
 * Uses environment variables as primary source, with defaults as fallback
 */

import { SiteSettings } from '@/types/admin';
import { ERROR_MESSAGES } from './constants';

/**
 * Get all site settings
 * Priority: Environment variables > Default values
 */
export async function getSettings(): Promise<SiteSettings> {
  // Use environment variables with fallbacks
  return {
    site_title: process.env.NEXT_PUBLIC_SITE_TITLE || getDefaultSettings().site_title,
    site_tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || getDefaultSettings().site_tagline,
    contact_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || getDefaultSettings().contact_email,
  };
}

/**
 * Get a single setting by key
 * Note: MVP implementation - settings are read-only from env variables
 */
export async function getSetting(key: string): Promise<string | null> {
  const settings = await getSettings();
  
  const settingMap = {
    site_title: settings.site_title,
    site_tagline: settings.site_tagline,
    contact_email: settings.contact_email,
  };
  
  return settingMap[key as keyof typeof settingMap] || null;
}

/**
 * Update a single setting
 * Note: MVP implementation - settings are read-only in MVP
 * In production, this would update environment variables or configuration
 */
export async function updateSetting(key: string, value: string): Promise<void> {
  console.warn('Settings update is read-only in MVP. Environment variables must be updated manually.');
  throw new Error(ERROR_MESSAGES.SETTINGS_READ_ONLY);
}

/**
 * Update multiple settings at once
 * Note: MVP implementation - settings are read-only in MVP
 */
export async function updateSettings(updates: Partial<SiteSettings>): Promise<void> {
  console.warn('Settings update is read-only in MVP. Environment variables must be updated manually.');
  throw new Error(ERROR_MESSAGES.SETTINGS_READ_ONLY);
}

/**
 * Get default settings (fallback if environment variables are not set)
 */
function getDefaultSettings(): SiteSettings {
  return {
    site_title: 'Ridgewood Insights',
    site_tagline: 'Professional accounting and financial insights',
    contact_email: 'info@ridgewoodinsights.com',
  };
}
