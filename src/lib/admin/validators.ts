import { z } from 'zod';
import { POST_STATUSES, DISCLAIMER_TYPES, CONTENT_LIMITS, FILE_LIMITS } from './constants';

/**
 * Zod validation schemas for admin CMS forms
 */

// ============================================================================
// Post Validation
// ============================================================================

// Define enum values based on database schema
const POST_STATUS_VALUES = POST_STATUSES;
const DISCLAIMER_TYPE_VALUES = DISCLAIMER_TYPES;

export const PostFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(CONTENT_LIMITS.TITLE_MAX_LENGTH, `Title must be less than ${CONTENT_LIMITS.TITLE_MAX_LENGTH} characters`),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .max(CONTENT_LIMITS.SLUG_MAX_LENGTH, `Slug must be less than ${CONTENT_LIMITS.SLUG_MAX_LENGTH} characters`),
  excerpt: z
    .string()
    .max(CONTENT_LIMITS.EXCERPT_MAX_LENGTH, `Excerpt must be less than ${CONTENT_LIMITS.EXCERPT_MAX_LENGTH} characters`)
    .optional()
    .or(z.literal('')),
  content_html: z
    .string()
    .min(CONTENT_LIMITS.CONTENT_MIN_LENGTH, `Content must be at least ${CONTENT_LIMITS.CONTENT_MIN_LENGTH} characters`)
    .optional()
    .or(z.literal('')),
  cover_image: z.string().optional().or(z.literal('')),
  category_id: z.string().uuid('Invalid category').optional().or(z.literal('')),
  status: z.enum(POST_STATUS_VALUES, {
    message: `Status must be one of: ${POST_STATUS_VALUES.join(', ')}`
  }),
  disclaimer_type: z.enum(DISCLAIMER_TYPE_VALUES, {
    message: `Disclaimer type must be one of: ${DISCLAIMER_TYPE_VALUES.join(', ')}`
  }),
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
    .max(CONTENT_LIMITS.SLUG_MAX_LENGTH, `Category name must be less than ${CONTENT_LIMITS.SLUG_MAX_LENGTH} characters`),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .max(CONTENT_LIMITS.SLUG_MAX_LENGTH, `Slug must be less than ${CONTENT_LIMITS.SLUG_MAX_LENGTH} characters`),
});

export type CategoryFormInput = z.infer<typeof CategoryFormSchema>;

// ============================================================================
// Settings Validation
// ============================================================================

export const SettingsFormSchema = z.object({
  site_title: z.string().min(1, 'Site title is required').max(CONTENT_LIMITS.TITLE_MAX_LENGTH),
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
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed';
  }

  if (file.size > FILE_LIMITS.MAX_IMAGE_SIZE_BYTES) {
    return `Image must be smaller than ${FILE_LIMITS.MAX_IMAGE_SIZE_MB}MB`;
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
