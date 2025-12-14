/**
 * Slug Utility Functions
 * Generates URL-friendly slugs from titles and handles duplicates.
 */

import { supabase } from './supabase';

/**
 * Convert a title to a slug
 * Converts to lowercase, removes special characters, replaces spaces with hyphens
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if slug is unique in database and generate a new one if needed
 * Appends -2, -3, etc. if slug already exists
 */
export async function generateUniqueSlug(
  baseSlug: string,
  _existingSlugs?: string[] // Kept for signature compatibility, but unused
): Promise<string> {
  // Check if base slug exists
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('slug', baseSlug);

  if (count === 0) {
    return baseSlug;
  }

  // If exists, try appending numbers until unique
  let counter = 2;
  while (true) {
    const newSlug = `${baseSlug}-${counter}`;
    const { count: newCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('slug', newSlug);

    if (newCount === 0) {
      return newSlug;
    }
    counter++;
  }
}

/**
 * Validate a slug
 * Must be lowercase, alphanumeric + hyphens only
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 200;
}
