import { z } from 'zod';

/**
 * Zod validation schemas for admin CMS forms
 */

// ============================================================================
// Post Validation
// ============================================================================

export const PostFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .max(100, 'Slug must be less than 100 characters'),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be less than 300 characters')
    .optional()
    .or(z.literal('')),
  content_html: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .optional()
    .or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  category_id: z.string().uuid('Invalid category').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'scheduled']),
  disclaimer_type: z.enum(['none', 'general', 'legal']),
  published_at: z.string().datetime().optional().or(z.literal('')),
});

export type PostFormInput = z.infer<typeof PostFormSchema>;

// ============================================================================
// Category Validation
// ============================================================================

export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .max(100, 'Slug must be less than 100 characters'),
});

export type CategoryFormInput = z.infer<typeof CategoryFormSchema>;

// ============================================================================
// Settings Validation
// ============================================================================

export const SettingsFormSchema = z.object({
  site_title: z.string().min(1, 'Site title is required').max(200),
  site_tagline: z.string().max(500, 'Tagline must be less than 500 characters'),
  contact_email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Contact email is required'),
});

export type SettingsFormInput = z.infer<typeof SettingsFormSchema>;

// ============================================================================
// Image Upload Validation
// ============================================================================

export const validateImageUpload = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed';
  }

  if (file.size > maxSize) {
    return 'Image must be smaller than 5MB';
  }

  return null;
};

// ============================================================================
// Slug Validation
// ============================================================================

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};
