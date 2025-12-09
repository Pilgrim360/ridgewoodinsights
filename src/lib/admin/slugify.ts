/**
 * Slug Utility Functions
 * Generates URL-friendly slugs from titles and handles duplicates.
 */

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
 * Note: This is a stub. In real implementation, query the posts table.
 */
export async function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): Promise<string> {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}

/**
 * Validate a slug
 * Must be lowercase, alphanumeric + hyphens only
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 200;
}
